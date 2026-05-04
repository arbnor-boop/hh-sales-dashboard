"use client";
import { useState, useMemo } from "react";

const INTERN_PARTNERS = ["ZELLGUT GmbH","Grundl Leadership","Schippke","HH SCG","Nuhi Consulting","White Immobilien","KHPH AG","Peak","Hamann & Kollegen Immobilien GmbH","Candidate-flow"];

const PARTNER_MONTHLY: Record<string, Record<string, { vol: number; cash: number; netto: number; intern: boolean }>> = {
  "01-2026": {
    "Candidate-flow":         { vol: 51249,     cash: 38316.60, netto: 36462.43, intern: true  },
    "ZELLGUT GmbH":           { vol: 118372.66, cash: 64858.52, netto: 53183.08, intern: true  },
    "Schippke":               { vol: 39375,     cash: 26062.50, netto: 21922.50, intern: true  },
    "ECOM HOUSE GmbH":        { vol: 26240,     cash: 10220,    netto: 10220,    intern: false },
    "2b AHEAD ThinkTank GmbH":{ vol: 23238.40,  cash: 14149.20, netto: 14149.20, intern: false },
    "Grundl Leadership":      { vol: 35319.14,  cash: 26163.01, netto: 18101.25, intern: true  },
    "Temmer":                 { vol: 21992.50,  cash: 8114.52,  netto: 8114.52,  intern: false },
    "Everflow Excellence":    { vol: 20220,     cash: 11040,    netto: 11040,    intern: false },
    "Volume-Trader":          { vol: 17990.66,  cash: 12020.81, netto: 12020.81, intern: false },
    "HH SCG":                 { vol: 60000,     cash: 20000,    netto: 20000,    intern: true  },
    "Eitel Invest AG":        { vol: 5175,      cash: 2548.50,  netto: 2548.50,  intern: false },
    "Nuhi Consulting":        { vol: 13366.25,  cash: 5238.75,  netto: 4410,     intern: true  },
    "White Immobilien":       { vol: 30000,     cash: 30000,    netto: 15800,    intern: true  },
    "KHPH AG":                { vol: 25000,     cash: 25000,    netto: 25000,    intern: true  },
    "MBA":                    { vol: 3000,      cash: 2375,     netto: 2375,     intern: false },
  },
  "02-2026": {
    "Candidate-flow":         { vol: 115342,    cash: 66207.55, netto: 60373.05, intern: true  },
    "Everflow Excellence":    { vol: 33720,     cash: 5700,     netto: 5700,     intern: false },
    "Grundl Leadership":      { vol: 39118.69,  cash: 34768.69, netto: 30318.26, intern: true  },
    "2b AHEAD ThinkTank GmbH":{ vol: 29619.40,  cash: 16194.40, netto: 16194.40, intern: false },
    "Schippke":               { vol: 52800,     cash: 35904,    netto: 27150.72, intern: true  },
    "ECOM HOUSE GmbH":        { vol: 27000,     cash: 9230,     netto: 9230,     intern: false },
    "Temmer":                 { vol: 22439,     cash: 4287.67,  netto: 4287.67,  intern: false },
    "Volume-Trader":          { vol: 13345.28,  cash: 8120.64,  netto: 8120.64,  intern: false },
    "KHPH AG":                { vol: 86000,     cash: 28000,    netto: 28000,    intern: true  },
    "Eitel Invest AG":        { vol: 6390,      cash: 2695.50,  netto: 2695.50,  intern: false },
    "Nuhi Consulting":        { vol: 15696,     cash: 6032,     netto: 5276,     intern: true  },
    "ZELLGUT GmbH":           { vol: 3890.76,   cash: 1342.44,  netto: 817.73,   intern: true  },
    "MBA":                    { vol: 1887.50,   cash: 755.20,   netto: 755.20,   intern: false },
  },
  "03-2026": {
    "Candidate-flow":         { vol: 93930,     cash: 52904.40, netto: 48604.40, intern: true  },
    "ZELLGUT GmbH":           { vol: 53305.34,  cash: 28778.11, netto: 20426.45, intern: true  },
    "Grundl Leadership":      { vol: 47966.40,  cash: 31807.21, netto: 27521.06, intern: true  },
    "ECOM HOUSE GmbH":        { vol: 29876,     cash: 17043,    netto: 17043,    intern: false },
    "2b AHEAD ThinkTank GmbH":{ vol: 27560,     cash: 16160,    netto: 16160,    intern: false },
    "Schippke":               { vol: 43250,     cash: 35462.50, netto: 26682.50, intern: true  },
    "Temmer":                 { vol: 16159.50,  cash: 4390.58,  netto: 4390.58,  intern: false },
    "Volume-Trader":          { vol: 8129.63,   cash: 4812.75,  netto: 4812.75,  intern: false },
    "White Immobilien":       { vol: 60197.65,  cash: 60197.65, netto: 58391.72, intern: true  },
    "Eitel Invest AG":        { vol: 4230,      cash: 1777.50,  netto: 1777.50,  intern: false },
    "Nuhi Consulting":        { vol: 6558.75,   cash: 3243.75,  netto: 2510.63,  intern: true  },
    "KHPH AG":                { vol: 25000,     cash: 25000,    netto: 25000,    intern: true  },
    "CAREFREE":               { vol: 152.40,    cash: 152.40,   netto: 152.40,   intern: false },
  },
  "04-2026": {
    "Candidate-flow":         { vol: 74813.60,  cash: 58856.73, netto: 52199.23, intern: true  },
    "Schippke":               { vol: 83750,     cash: 75958.25, netto: 60171.61, intern: true  },
    "Grundl Leadership":      { vol: 58805.82,  cash: 54105.93, netto: 38369.05, intern: true  },
    "Investmentpunk":         { vol: 38827.53,  cash: 21608.03, netto: 21608.03, intern: false },
    "ECOM HOUSE GmbH":        { vol: 28300,     cash: 11150,    netto: 11150,    intern: false },
    "Everflow Excellence":    { vol: 14600,     cash: 4200,     netto: 4200,     intern: false },
    "Volume-Trader":          { vol: 9752.44,   cash: 6314.48,  netto: 6314.48,  intern: false },
    "2b AHEAD ThinkTank GmbH":{ vol: 11068.07,  cash: 4668.07,  netto: 4668.07,  intern: false },
    "ZELLGUT GmbH":           { vol: 10043.60,  cash: 5187.83,  netto: 3419.80,  intern: true  },
    "Eitel Invest AG":        { vol: 5571,      cash: 2445,     netto: 2445,     intern: false },
    "Nuhi Consulting":        { vol: 9577.50,   cash: 4480,     netto: 3280,     intern: true  },
    "Temmer":                 { vol: 2090,      cash: 1045,     netto: 1045,     intern: false },
    "Peak":                   { vol: 20820.17,  cash: 20820.17, netto: 20820.17, intern: true  },
    "Hamann & Kollegen Immobilien GmbH": { vol: 20529.41, cash: 20529.41, netto: 20529.41, intern: true },
    "Close Consulting - Leon":{ vol: 3900,      cash: 1500,     netto: 1500,     intern: false },
  },
  "05-2026": {
    "Investmentpunk": { vol: 500, cash: 500, netto: 500, intern: false },
  },
};

const MONTHS = ["01-2026","02-2026","03-2026","04-2026","05-2026"];
const MONTH_LABELS: Record<string,string> = {"01-2026":"Jan 2026","02-2026":"Feb 2026","03-2026":"Mär 2026","04-2026":"Apr 2026","05-2026":"Mai 2026"};
const MONTH_SHORT: Record<string,string>  = {"01-2026":"Jan","02-2026":"Feb","03-2026":"Mär","04-2026":"Apr","05-2026":"Mai"};
const DEALS: Record<string,number> = {"01-2026":445,"02-2026":283,"03-2026":334,"04-2026":309,"05-2026":1};

const fmt = (n: number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

function getMonthData(month: string, view: "gesamt"|"intern"|"extern") {
  let vol=0,cash=0,netto=0;
  for (const d of Object.values(PARTNER_MONTHLY[month]||{})) {
    if(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern)){vol+=d.vol;cash+=d.cash;netto+=d.netto;}
  }
  return {vol,cash,netto,deals:DEALS[month]||0};
}

function getRankedPartners(months: string[], view: "gesamt"|"intern"|"extern") {
  const map: Record<string,{vol:number;cash:number;netto:number}> = {};
  for (const m of months) {
    for (const [name,d] of Object.entries(PARTNER_MONTHLY[m]||{})) {
      if(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern)){
        if(!map[name])map[name]={vol:0,cash:0,netto:0};
        map[name].vol+=d.vol;map[name].cash+=d.cash;map[name].netto+=d.netto;
      }
    }
  }
  return Object.entries(map).sort((a,b)=>b[1].vol-a[1].vol);
}

export default function Dashboard() {
  const [view,setView]   = useState<"gesamt"|"intern"|"extern">("gesamt");
  const [tab,setTab]     = useState<"overview"|"partner"|"prognose">("overview");
  const [fromM,setFromM] = useState("01-2026");
  const [toM,setToM]     = useState("04-2026");

  const selectedMonths = useMemo(()=>MONTHS.filter(m=>m>=fromM&&m<=toM),[fromM,toM]);
  const kpis = useMemo(()=>{
    let vol=0,cash=0,netto=0,deals=0;
    for(const m of selectedMonths){const d=getMonthData(m,view);vol+=d.vol;cash+=d.cash;netto+=d.netto;deals+=d.deals;}
    return{vol,cash,netto,deals,cashRate:vol>0?(cash/vol*100):0};
  },[selectedMonths,view]);
  const monthRows = useMemo(()=>selectedMonths.map(m=>({m,...getMonthData(m,view)})),[selectedMonths,view]);
  const partners  = useMemo(()=>getRankedPartners(selectedMonths,view),[selectedMonths,view]);
  const maxVol    = partners[0]?.[1].vol||1;
  const ZIEL      = 500000;
  const basisNetto= getMonthData("04-2026","gesamt").netto;
  const zielPct   = Math.min((basisNetto/ZIEL)*100,100);

  const S = {
    page:  {minHeight:"100vh",background:"#0a0a0f",color:"#e8e8f0",fontFamily:"'DM Sans','Segoe UI',sans-serif"} as React.CSSProperties,
    side:  {position:"fixed" as const,left:0,top:0,bottom:0,width:220,background:"#0f0f1a",borderRight:"1px solid #1e1e30",display:"flex",flexDirection:"column" as const,padding:"24px 0",zIndex:100},
    main:  {marginLeft:220,padding:"32px 32px 64px"} as React.CSSProperties,
    card:  (color?:string)=>({background:"#0f0f1a",border:"1px solid #1e1e30",borderRadius:14,padding:"24px",borderTop:`2px solid ${color||"#1e1e30"}`} as React.CSSProperties),
    btn:   (active:boolean,color?:string)=>({display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:4,background:active?"#1a1a2e":"transparent",color:active?(color||"#818cf8"):"#666",fontSize:13,fontWeight:active?600:400} as React.CSSProperties),
    label: {fontSize:11,color:"#555",textTransform:"uppercase" as const,letterSpacing:"1.5px",marginBottom:8},
    mono:  (color:string)=>({fontFamily:"'DM Mono',monospace",color} as React.CSSProperties),
    th:    {padding:"12px 20px",textAlign:"left" as const,fontSize:11,color:"#555",letterSpacing:"1.5px",textTransform:"uppercase" as const,borderBottom:"1px solid #1e1e30"},
    td:    {padding:"12px 20px",fontSize:13},
  };

  return (
    <div style={S.page}>
      {/* SIDEBAR */}
      <div style={S.side}>
        <div style={{padding:"0 20px 24px",borderBottom:"1px solid #1e1e30"}}>
          <div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.5px",color:"#fff"}}>HH SCG</div>
          <div style={{fontSize:11,color:"#555",marginTop:2,letterSpacing:"2px",textTransform:"uppercase"}}>Sales Dashboard</div>
        </div>

        <div style={{padding:"20px 16px 8px"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>Ansicht</div>
          {(["gesamt","intern","extern"] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={S.btn(view===v,v==="intern"?"#34d399":v==="extern"?"#f472b6":undefined)}>
              <span style={{textTransform:"capitalize"}}>{v}</span>
              {view===v&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#818cf8"}}/>}
            </button>
          ))}
        </div>

        <div style={{height:1,background:"#1e1e30",margin:"8px 16px"}}/>

        <div style={{padding:"8px 16px"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>Navigation</div>
          {(["overview","partner","prognose"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={S.btn(tab===t)}>
              {t==="overview"?"Übersicht":t==="partner"?"Partner":"Prognose"}
            </button>
          ))}
        </div>

        <div style={{padding:"16px 16px 0",marginTop:"auto",borderTop:"1px solid #1e1e30"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:12,textTransform:"uppercase"}}>Zeitraum</div>
          {[["Von",fromM,setFromM,MONTHS],["Bis",toM,setToM,MONTHS.filter(m=>m>=fromM)]].map(([lbl,val,setter,opts])=>(
            <div key={lbl as string} style={{marginBottom:8}}>
              <div style={{fontSize:11,color:"#555",marginBottom:4}}>{lbl as string}</div>
              <select value={val as string} onChange={e=>(setter as (v:string)=>void)(e.target.value)} style={{width:"100%",background:"#1a1a2e",border:"1px solid #2a2a40",color:"#e8e8f0",borderRadius:6,padding:"6px 8px",fontSize:12}}>
                {(opts as string[]).map(m=><option key={m} value={m}>{MONTH_LABELS[m]}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={S.main}>
        <div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <h1 style={{margin:0,fontSize:24,fontWeight:700,letterSpacing:"-0.5px"}}>
              {tab==="overview"?"Übersicht":tab==="partner"?"Partner Analyse":"Prognose"}
            </h1>
            <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",background:view==="intern"?"#0d1f1a":view==="extern"?"#1a0d1a":"#1a1a2e",color:view==="intern"?"#34d399":view==="extern"?"#f472b6":"#818cf8",border:`1px solid ${view==="intern"?"#1a4a35":view==="extern"?"#4a1a3a":"#2a2a50"}`}}>{view}</span>
          </div>
          <p style={{margin:"6px 0 0",color:"#555",fontSize:13}}>{MONTH_LABELS[fromM]} – {MONTH_LABELS[toM]} · {selectedMonths.length} Monat{selectedMonths.length!==1?"e":""}</p>
        </div>

        {/* ── OVERVIEW ── */}
        {tab==="overview"&&(<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
            {([["SCG Volumen",fmt(kpis.vol),"Auftragsvolumen","#818cf8"],["Cash IN",fmt(kpis.cash),`${kpis.cashRate.toFixed(1)}% Cash-Rate`,"#34d399"],["Netto Cash IN",fmt(kpis.netto),"Nach Provisionen","#f59e0b"],["Deals",kpis.deals.toString(),"Abgeschlossene Deals","#f472b6"]] as [string,string,string,string][]).map(([lbl,val,sub,color])=>(
              <div key={lbl} style={{...S.card(color),padding:"20px 22px"}}>
                <div style={S.label}>{lbl}</div>
                <div style={{fontSize:24,fontWeight:700,...S.mono("#fff"),letterSpacing:"-1px"}}>{val}</div>
                <div style={{fontSize:11,color:"#444",marginTop:4}}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{...S.card(),marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>MONATSVERLAUF · VOLUMEN & CASH IN</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:200}}>
              {monthRows.map(({m,vol,cash})=>{
                const maxV=Math.max(...monthRows.map(r=>r.vol),1);
                return(
                  <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:180}}>
                      <div style={{width:24,height:Math.max((vol/maxV)*180,2),background:"#818cf8",borderRadius:"4px 4px 0 0",opacity:.9}}/>
                      <div style={{width:24,height:Math.max((cash/maxV)*180,2),background:"#34d399",borderRadius:"4px 4px 0 0",opacity:.9}}/>
                    </div>
                    <div style={{fontSize:11,color:"#555"}}>{MONTH_SHORT[m]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:20,marginTop:12}}>
              {[["#818cf8","SCG Volumen"],["#34d399","Cash IN"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                  <span style={{fontSize:11,color:"#555"}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{...S.card(),padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a0a14"}}>
                {["Monat","SCG Volumen","Cash IN","Netto Cash IN","Deals","Cash-Rate"].map(h=><th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {monthRows.map(({m,vol,cash,netto,deals},i)=>{
                  const rate=vol>0?(cash/vol*100):0;
                  return(<tr key={m} style={{borderBottom:"1px solid #1a1a28",background:i%2===0?"transparent":"#0d0d18"}}>
                    <td style={{...S.td,fontWeight:600}}>{MONTH_LABELS[m]}</td>
                    <td style={{...S.td,...S.mono("#818cf8")}}>{fmt(vol)}</td>
                    <td style={{...S.td,...S.mono("#34d399")}}>{fmt(cash)}</td>
                    <td style={{...S.td,...S.mono("#f59e0b")}}>{fmt(netto)}</td>
                    <td style={{...S.td,color:"#888"}}>{deals}</td>
                    <td style={S.td}><span style={{padding:"2px 8px",borderRadius:12,background:rate>=70?"#0d2a1a":rate>=55?"#1a2a10":"#2a1a10",color:rate>=70?"#34d399":rate>=55?"#84cc16":"#f59e0b",fontSize:12,fontWeight:600}}>{rate.toFixed(1)}%</span></td>
                  </tr>);
                })}
                <tr style={{background:"#12121e",borderTop:"2px solid #2a2a40"}}>
                  <td style={{...S.td,fontWeight:700,color:"#fff"}}>Gesamt</td>
                  <td style={{...S.td,...S.mono("#818cf8"),fontWeight:700}}>{fmt(kpis.vol)}</td>
                  <td style={{...S.td,...S.mono("#34d399"),fontWeight:700}}>{fmt(kpis.cash)}</td>
                  <td style={{...S.td,...S.mono("#f59e0b"),fontWeight:700}}>{fmt(kpis.netto)}</td>
                  <td style={{...S.td,fontWeight:700,color:"#888"}}>{kpis.deals}</td>
                  <td style={{...S.td,fontWeight:700,color:"#818cf8"}}>{kpis.cashRate.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>)}

        {/* ── PARTNER ── */}
        {tab==="partner"&&(<>
          <div style={{...S.card(),marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>PARTNER RANKING · {view.toUpperCase()}</div>
            {partners.map(([name,{vol,cash,netto}],i)=>{
              const isInt=INTERN_PARTNERS.includes(name);
              return(<div key={name} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:22,height:22,borderRadius:6,background:i===0?"#818cf8":i===1?"#6366f1":i===2?"#4f46e5":"#1e1e30",color:i<3?"#fff":"#555",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{name}</span>
                    <span style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:isInt?"#0d1f1a":"#1a0d1a",color:isInt?"#34d399":"#f472b6",border:`1px solid ${isInt?"#1a4a35":"#4a1a3a"}`}}>{isInt?"INT":"EXT"}</span>
                  </div>
                  <div style={{display:"flex",gap:20}}>
                    {([["Vol",fmt(vol),"#818cf8"],["Cash",fmt(cash),"#34d399"],["Netto",fmt(netto),"#f59e0b"]] as [string,string,string][]).map(([l,v,c])=>(
                      <div key={l} style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:"#555"}}>{l}</div>
                        <div style={{fontSize:12,...S.mono(c),fontWeight:600}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:"#1e1e30",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,width:`${(vol/maxVol)*100}%`,background:"linear-gradient(90deg,#818cf8,#6366f1)"}}/>
                </div>
              </div>);
            })}
          </div>

          <div style={{...S.card(),padding:0,overflow:"auto"}}>
            <div style={{padding:"20px 24px 12px",fontSize:13,fontWeight:600,color:"#888"}}>PARTNER NACH MONAT · SCG VOLUMEN</div>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
              <thead><tr style={{background:"#0a0a14"}}>
                <th style={{...S.th,whiteSpace:"nowrap"}}>Partner</th>
                {selectedMonths.map(m=><th key={m} style={{...S.th,textAlign:"right"}}>{MONTH_SHORT[m]}</th>)}
                <th style={{...S.th,textAlign:"right",color:"#818cf8"}}>Total</th>
              </tr></thead>
              <tbody>
                {partners.map(([name,{vol}],i)=>(
                  <tr key={name} style={{borderBottom:"1px solid #1a1a28",background:i%2===0?"transparent":"#0d0d18"}}>
                    <td style={{...S.td,fontWeight:600,whiteSpace:"nowrap"}}>{name}</td>
                    {selectedMonths.map(m=>{
                      const d=PARTNER_MONTHLY[m]?.[name];
                      const show=d&&(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern));
                      return<td key={m} style={{...S.td,textAlign:"right",...S.mono(show&&d.vol>0?"#818cf8":"#2a2a40")}}>{show&&d.vol>0?fmt(d.vol):"—"}</td>;
                    })}
                    <td style={{...S.td,textAlign:"right",...S.mono("#818cf8"),fontWeight:700}}>{fmt(vol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ── PROGNOSE ── */}
        {tab==="prognose"&&(<>
          <div style={{...S.card(),marginBottom:24,padding:"28px"}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>MONATSZIEL · NETTO CASH IN</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:36,fontWeight:700,...S.mono("#fff"),letterSpacing:"-2px"}}>{fmt(basisNetto)}</div>
                <div style={{fontSize:12,color:"#555",marginTop:4}}>April 2026 (letzter Monat)</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:700,...S.mono("#f59e0b")}}>{fmt(ZIEL)}</div>
                <div style={{fontSize:12,color:"#555",marginTop:4}}>Ziel pro Monat</div>
              </div>
            </div>
            <div style={{height:12,borderRadius:6,background:"#1e1e30",overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",borderRadius:6,width:`${zielPct}%`,background:"linear-gradient(90deg,#f59e0b,#d97706)"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#555"}}>
              <span>{zielPct.toFixed(1)}% des Ziels erreicht</span>
              <span>Noch {fmt(Math.max(ZIEL-basisNetto,0))} bis zum Ziel</span>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={S.card("#818cf8")}>
              <div style={S.label}>Jahresprognose</div>
              <div style={{fontSize:28,fontWeight:700,...S.mono("#818cf8"),letterSpacing:"-1px"}}>{fmt(basisNetto*12)}</div>
              <div style={{fontSize:12,color:"#444",marginTop:6}}>Basis: April × 12 Monate</div>
            </div>
            <div style={S.card("#34d399")}>
              <div style={S.label}>Ø Netto/Monat (Zeitraum)</div>
              <div style={{fontSize:28,fontWeight:700,...S.mono("#34d399"),letterSpacing:"-1px"}}>{fmt(kpis.netto/Math.max(selectedMonths.length,1))}</div>
              <div style={{fontSize:12,color:"#444",marginTop:6}}>{selectedMonths.length} Monat{selectedMonths.length!==1?"e":""} gewählt</div>
            </div>
          </div>

          <div style={S.card()}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>NETTO CASH IN ENTWICKLUNG (Jan–Apr 2026)</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,height:200}}>
              {MONTHS.slice(0,4).map(m=>{
                const {netto}=getMonthData(m,"gesamt");
                const maxN=Math.max(...MONTHS.slice(0,4).map(mm=>getMonthData(mm,"gesamt").netto),1);
                const inRange=m>=fromM&&m<=toM;
                return(
                  <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                    <div style={{fontSize:11,...S.mono(inRange?"#f59e0b":"#333")}}>{(netto/1000).toFixed(0)}k</div>
                    <div style={{width:"100%",height:Math.max((netto/maxN)*160,2),background:inRange?"linear-gradient(180deg,#f59e0b,#d97706)":"#1e1e30",borderRadius:"4px 4px 0 0"}}/>
                    <div style={{fontSize:12,color:inRange?"#e8e8f0":"#444"}}>{MONTH_SHORT[m]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:16,padding:"12px 16px",background:"#0a0a14",borderRadius:8,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:10,height:10,borderRadius:2,background:"#f59e0b"}}/>
              <span style={{fontSize:12,color:"#555"}}>Ziel: {fmt(ZIEL)}/Monat — Aktuell: {zielPct.toFixed(0)}% erreicht ({fmt(Math.max(ZIEL-basisNetto,0))} fehlen)</span>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
