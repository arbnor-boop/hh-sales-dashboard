with open('app/page.tsx', 'r') as f:
    c = f.read()

old = '''                  {(f?.bwaKategorien || []).map(({kat,icon,items})=>{
                    const total = f.ausDetails.filter(([n])=>items.includes(n)).reduce((a,[,v])=>a+v,0);
                    const rows = f.ausDetails.filter(([n])=>items.includes(n));
                    if (rows.length===0) return null;
                    return (
                      <div key={kat} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                        <div style={{padding:"12px 16px",background:"#0a0a18",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:13,fontWeight:700}}>{icon} {kat}</span>
                          <span style={{fontSize:13,fontWeight:800,color:C.pink,fontFamily:"monospace"}}>{fmtN(total)} {f.currency}</span>
                        </div>
                        {rows.map(([n,v],i)=>(
                          <div key={i} style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:i%2===0?"transparent":"#0c0c1a"}}>
                            <span style={{fontSize:11,color:C.muted}}>{n}</span>
                            <span style={{fontSize:11,color:C.pink,fontFamily:"monospace"}}>{fmtN(v)} {f.currency}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}'''

new = '''                  {(f?.bwaKategorien || []).map(({kat,icon,items})=>{
                    const total = f.ausDetails.filter(([n])=>items.includes(n)).reduce((a,[,v])=>a+v,0);
                    const rows = f.ausDetails.filter(([n])=>items.includes(n));
                    if (rows.length===0) return null;
                    // Echte Transaktionen aus allRows
                    const txRows = allRows.filter(r=>r.firma===f.firma && r.monat===selMonat && r.betrag<0 && items.includes(r.kategorie));
                    return (
                      <BwaKategorie key={kat} kat={kat} icon={icon} total={total} currency={f.currency} rows={rows} txRows={txRows} C={C} fmtN={fmtN} />
                    );
                  })}'''

if old in c:
    c = c.replace(old, new)
    print('Replaced map')
else:
    print('NOT FOUND map')

# Add BwaKategorie component before FirmenDashboard
comp = '''
function BwaKategorie({kat,icon,total,currency,rows,txRows,C,fmtN}: {kat:string;icon:string;total:number;currency:string;rows:[string,number][];txRows:{datum:string;name:string;betrag:number}[];C:any;fmtN:(n:number)=>string}) {
  const [open, setOpen] = React.useState(false);
  const hasDetails = txRows.length > 0;
  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <div onClick={()=>hasDetails&&setOpen(o=>!o)} style={{padding:"12px 16px",background:"#0a0a18",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:hasDetails?"pointer":"default"}}>
        <span style={{fontSize:13,fontWeight:700}}>{icon} {kat}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:13,fontWeight:800,color:"#f472b6",fontFamily:"monospace"}}>{fmtN(total)} {currency}</span>
          {hasDetails && <span style={{fontSize:11,color:"#818cf8"}}>{open?"▲":"▼"}</span>}
        </div>
      </div>
      {!open && rows.map(([n,v],i)=>(
        <div key={i} style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:i%2===0?"transparent":"#0c0c1a"}}>
          <span style={{fontSize:11,color:C.muted}}>{n}</span>
          <span style={{fontSize:11,color:"#f472b6",fontFamily:"monospace"}}>{fmtN(v)} {currency}</span>
        </div>
      ))}
      {open && txRows.map((r,i)=>(
        <div key={i} style={{padding:"8px 16px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",gap:8,background:i%2===0?"transparent":"#0c0c1a"}}>
          <span style={{fontSize:10,color:C.muted,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.datum} — {r.name}</span>
          <span style={{fontSize:11,color:"#f472b6",fontFamily:"monospace",whiteSpace:"nowrap"}}>{fmtN(r.betrag)} {currency}</span>
        </div>
      ))}
    </div>
  );
}

'''

if 'function FirmenDashboard' in c:
    c = c.replace('function FirmenDashboard', comp + 'function FirmenDashboard', 1)
    print('Added component')
else:
    print('NOT FOUND FirmenDashboard')

with open('app/page.tsx', 'w') as f:
    f.write(c)
print('Done')
