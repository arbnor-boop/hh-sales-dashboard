"use client";
import { useState, useMemo } from "react";

// ─── INTERN PARTNER LISTE ───────────────────────────────────────────────────
const INTERN_PARTNERS = new Set([
  "ZELLGUT GmbH","Grundl Leadership","Schippke","HH SCG",
  "Nuhi Consulting","White Immobilien","KHPH AG","Peak",
  "Hamann & Kollegen Immobilien GmbH","Candidate-flow"
]);

// ─── DEAL-DATEN PRO TAG (Mai 2026 - aus Google Sheet) ──────────────────────
// Format: { datum, partner, name, produkt, vol, cash, intern }
const DEALS_MAI: Array<{datum:string;partner:string;name:string;produkt:string;vol:number;cash:number;intern:boolean}> = [
  { datum:"01.05.2026", partner:"Candidate-flow", name:"Malerbetrieb Kluge", produkt:"Recruiting", vol:360, cash:360, intern:true },
  { datum:"01.05.2026", partner:"Candidate-flow", name:"Dachdecker Hoffmann", produkt:"Recruiting", vol:540, cash:540, intern:true },
  { datum:"01.05.2026", partner:"Schippke", name:"Thomas Weber", produkt:"Coaching", vol:1150, cash:1150, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Sanitär Meister GmbH", produkt:"Recruiting", vol:756, cash:756, intern:true },
  { datum:"02.05.2026", partner:"Investmentpunk", name:"Klaus Bauer", produkt:"Mastermind", vol:3495.49, cash:3495.49, intern:false },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Elektro Braun", produkt:"Recruiting", vol:900, cash:900, intern:true },
  { datum:"02.05.2026", partner:"Volume-Trader", name:"Stefan Müller", produkt:"Mentoring", vol:337.41, cash:337.41, intern:false },
  { datum:"02.05.2026", partner:"Eitel Invest AG", name:"Peter Koch", produkt:"Coaching", vol:180, cash:36, intern:false },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Bäcker Schneider", produkt:"Recruiting", vol:360, cash:360, intern:true },
  { datum:"02.05.2026", partner:"Investmentpunk", name:"Maria Lange", produkt:"Mastermind", vol:1674.00, cash:0, intern:false },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Friseur Maier", produkt:"Recruiting", vol:756, cash:756, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Handwerk GmbH", produkt:"Recruiting", vol:540, cash:540, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Maler Schmidt", produkt:"Recruiting", vol:630, cash:630, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Tischler Fischer", produkt:"Recruiting", vol:900, cash:900, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Gärtner Wagner", produkt:"Recruiting", vol:900, cash:900, intern:true },
  { datum:"02.05.2026", partner:"Candidate-flow", name:"Heizung Becker", produkt:"Recruiting", vol:1501, cash:900, intern:true },
];

// ─── MONATSDATEN (aggregiert aus Google Sheet) ────────────────────────────
const PARTNER_MONTHLY: Record<string, Record<string,{vol:number;cash:number;netto:number;intern:boolean}>> = {
  "Januar 2026": {
    "Candidate-flow":         {vol:51249,     cash:38316.60, netto:36462.43, intern:true},
    "ZELLGUT GmbH":           {vol:118372.66, cash:64858.52, netto:53183.08, intern:true},
    "Schippke":               {vol:39375,     cash:26062.50, netto:21922.50, intern:true},
    "HH SCG":                 {vol:60000,     cash:20000,    netto:20000,    intern:true},
    "Grundl Leadership":      {vol:35319.14,  cash:26163.01, netto:18101.25, intern:true},
    "Nuhi Consulting":        {vol:13366.25,  cash:5238.75,  netto:4410,     intern:true},
    "White Immobilien":       {vol:30000,     cash:30000,    netto:15800,    intern:true},
    "KHPH AG":                {vol:25000,     cash:25000,    netto:25000,    intern:true},
    "ECOM HOUSE GmbH":        {vol:26240,     cash:10220,    netto:10220,    intern:false},
    "2b AHEAD ThinkTank GmbH":{vol:23238.40,  cash:14149.20, netto:14149.20, intern:false},
    "Temmer":                 {vol:21992.50,  cash:8114.52,  netto:8114.52,  intern:false},
    "Everflow Excellence":    {vol:20220,     cash:11040,    netto:11040,    intern:false},
    "Volume-Trader":          {vol:17990.66,  cash:12020.81, netto:12020.81, intern:false},
    "Eitel Invest AG":        {vol:5175,      cash:2548.50,  netto:2548.50,  intern:false},
    "MBA":                    {vol:3000,      cash:2375,     netto:2375,     intern:false},
  },
  "Februar 2026": {
    "Candidate-flow":         {vol:115342,    cash:66207.55, netto:60373.05, intern:true},
    "Schippke":               {vol:52800,     cash:35904,    netto:27150.72, intern:true},
    "Grundl Leadership":      {vol:39118.69,  cash:34768.69, netto:30318.26, intern:true},
    "KHPH AG":                {vol:86000,     cash:28000,    netto:28000,    intern:true},
    "Nuhi Consulting":        {vol:15696,     cash:6032,     netto:5276,     intern:true},
    "ZELLGUT GmbH":           {vol:3890.76,   cash:1342.44,  netto:817.73,   intern:true},
    "Everflow Excellence":    {vol:33720,     cash:5700,     netto:5700,     intern:false},
    "2b AHEAD ThinkTank GmbH":{vol:29619.40,  cash:16194.40, netto:16194.40, intern:false},
    "ECOM HOUSE GmbH":        {vol:27000,     cash:9230,     netto:9230,     intern:false},
    "Temmer":                 {vol:22439,     cash:4287.67,  netto:4287.67,  intern:false},
    "Volume-Trader":          {vol:13345.28,  cash:8120.64,  netto:8120.64,  intern:false},
    "Eitel Invest AG":        {vol:6390,      cash:2695.50,  netto:2695.50,  intern:false},
    "MBA":                    {vol:1887.50,   cash:755.20,   netto:755.20,   intern:false},
  },
  "März 2026": {
    "Candidate-flow":         {vol:93930,     cash:52904.40, netto:48604.40, intern:true},
    "ZELLGUT GmbH":           {vol:53305.34,  cash:28778.11, netto:20426.45, intern:true},
    "Grundl Leadership":      {vol:47966.40,  cash:31807.21, netto:27521.06, intern:true},
    "Schippke":               {vol:43250,     cash:35462.50, netto:26682.50, intern:true},
    "White Immobilien":       {vol:60197.65,  cash:60197.65, netto:58391.72, intern:true},
    "KHPH AG":                {vol:25000,     cash:25000,    netto:25000,    intern:true},
    "Nuhi Consulting":        {vol:6558.75,   cash:3243.75,  netto:2510.63,  intern:true},
    "ECOM HOUSE GmbH":        {vol:29876,     cash:17043,    netto:17043,    intern:false},
    "2b AHEAD ThinkTank GmbH":{vol:27560,     cash:16160,    netto:16160,    intern:false},
    "Temmer":                 {vol:16159.50,  cash:4390.58,  netto:4390.58,  intern:false},
    "Volume-Trader":          {vol:8129.63,   cash:4812.75,  netto:4812.75,  intern:false},
    "Eitel Invest AG":        {vol:4230,      cash:1777.50,  netto:1777.50,  intern:false},
    "CAREFREE":               {vol:152.40,    cash:152.40,   netto:152.40,   intern:false},
  },
  "April 2026": {
    "Schippke":               {vol:83750,     cash:75958.25, netto:60171.61, intern:true},
    "Candidate-flow":         {vol:74813.60,  cash:58856.73, netto:52199.23, intern:true},
    "Grundl Leadership":      {vol:58805.82,  cash:54105.93, netto:38369.05, intern:true},
    "ZELLGUT GmbH":           {vol:10043.60,  cash:5187.83,  netto:3419.80,  intern:true},
    "Nuhi Consulting":        {vol:9577.50,   cash:4480,     netto:3280,     intern:true},
    "Peak":                   {vol:20820.17,  cash:20820.17, netto:20820.17, intern:true},
    "Hamann & Kollegen Immobilien GmbH":{vol:20529.41,cash:20529.41,netto:20529.41,intern:true},
    "Investmentpunk":         {vol:38827.53,  cash:21608.03, netto:21608.03, intern:false},
    "ECOM HOUSE GmbH":        {vol:28300,     cash:11150,    netto:11150,    intern:false},
    "Everflow Excellence":    {vol:14600,     cash:4200,     netto:4200,     intern:false},
    "Volume-Trader":          {vol:9752.44,   cash:6314.48,  netto:6314.48,  intern:false},
    "2b AHEAD ThinkTank GmbH":{vol:11068.07,  cash:4668.07,  netto:4668.07,  intern:false},
    "Eitel Invest AG":        {vol:5571,      cash:2445,     netto:2445,     intern:false},
    "Temmer":                 {vol:2090,      cash:1045,     netto:1045,     intern:false},
    "Close Consulting - Leon":{vol:3900,      cash:1500,     netto:1500,     intern:false},
  },
  "Mai 2026": {
    "Candidate-flow":         {vol:10443,     cash:7615,     netto:5690,     intern:true},
    "Schippke":               {vol:1150,      cash:1150,     netto:1150,     intern:true},
    "Investmentpunk":         {vol:5170.49,   cash:3495.49,  netto:3495.49,  intern:false},
    "Volume-Trader":          {vol:337.41,    cash:337.41,   netto:337.41,   intern:false},
    "Eitel Invest AG":        {vol:180,       cash:36,       netto:36,       intern:false},
  },
};

const MONTHS = ["Januar 2026","Februar 2026","März 2026","April 2026","Mai 2026"];
const MONTH_SHORT: Record<string,string> = {
  "Januar 2026":"Jan","Februar 2026":"Feb","März 2026":"Mär",
  "April 2026":"Apr","Mai 2026":"Mai"
};
const DEALS_COUNT: Record<string,number> = {
  "Januar 2026":445,"Februar 2026":283,"März 2026":334,"April 2026":309,"Mai 2026":16
};

const fmt = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

function calcMonth(month:string, view:"gesamt"|"intern"|"extern") {
  let vol=0,cash=0,netto=0;
  for(const d of Object.values(PARTNER_MONTHLY[month]||{})){
    if(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern)){
      vol+=d.vol;cash+=d.cash;netto+=d.netto;
    }
  }
  return {vol,cash,netto,deals:DEALS_COUNT[month]||0};
}

function calcPartners(months:string[], view:"gesamt"|"intern"|"extern") {
  const map:Record<string,{vol:number;cash:number;netto:number}> = {};
  for(const m of months){
    for(const [name,d] of Object.entries(PARTNER_MONTHLY[m]||{})){
      if(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern)){
        if(!map[name])map[name]={vol:0,cash:0,netto:0};
        map[name].vol+=d.vol;map[name].cash+=d.cash;map[name].netto+=d.netto;
      }
    }
  }
  return Object.entries(map).sort((a,b)=>b[1].vol-a[1].vol);
}

// Tagesdaten für Mai (aus DEALS_MAI)
function calcDay(datum:string, view:"gesamt"|"intern"|"extern") {
  const deals = DEALS_MAI.filter(d=>d.datum===datum);
  let vol=0,cash=0,count=0;
  const partnerMap:Record<string,{vol:number;cash:number}> = {};
  for(const d of deals){
    if(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern)){
      vol+=d.vol;cash+=d.cash;count++;
      if(!partnerMap[d.partner])partnerMap[d.partner]={vol:0,cash:0};
      partnerMap[d.partner].vol+=d.vol;
      partnerMap[d.partner].cash+=d.cash;
    }
  }
  return {vol,cash,count,partnerMap};
}

// Alle verfügbaren Daten im Mai
const MAI_TAGE = [...new Set(DEALS_MAI.map(d=>d.datum))].sort();

export default function Dashboard() {
  const [view,setView]   = useState<"gesamt"|"intern"|"extern">("gesamt");
  const [tab,setTab]     = useState<"overview"|"partner"|"datum"|"prognose">("overview");
  const [selectedMonth,setSelectedMonth] = useState("April 2026");
  const [selectedDay,setSelectedDay]     = useState(MAI_TAGE[MAI_TAGE.length-1]);

  // Für Übersicht: alle Monate bis zum gewählten
  const rangeMonths = useMemo(()=>MONTHS.filter((_,i)=>i<=MONTHS.indexOf(selectedMonth)),[selectedMonth]);

  const monthKpis = useMemo(()=>calcMonth(selectedMonth,view),[selectedMonth,view]);
  const partners  = useMemo(()=>calcPartners([selectedMonth],view),[selectedMonth,view]);
  const maxVol    = partners[0]?.[1].vol||1;

  // Alle Monate für Chart
  const allRows = useMemo(()=>MONTHS.map(m=>({m,...calcMonth(m,view)})),[view]);

  const dayData = useMemo(()=>calcDay(selectedDay,view),[selectedDay,view]);

  const ZIEL = 500000;
  const basisNetto = calcMonth("April 2026","gesamt").netto;
  const zielPct = Math.min((basisNetto/ZIEL)*100,100);

  const C = {
    bg:"#0a0a0f", card:"#0f0f1a", border:"#1e1e30",
    indigo:"#818cf8", green:"#34d399", amber:"#f59e0b", pink:"#f472b6",
    text:"#e8e8f0", muted:"#555",
  };
  const card = (color?:string):React.CSSProperties => ({
    background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24,
    ...(color ? {borderTop:`2px solid ${color}`} : {})
  });
  const mono = (color:string):React.CSSProperties => ({fontFamily:"'DM Mono',monospace",color});
  const sideBtn = (active:boolean,color?:string):React.CSSProperties => ({
    display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",
    borderRadius:8,border:"none",cursor:"pointer",marginBottom:4,
    background:active?"#1a1a2e":"transparent",
    color:active?(color||C.indigo):C.muted,
    fontSize:13,fontWeight:active?600:400,
  });
  const TH:React.CSSProperties = {padding:"11px 18px",textAlign:"left",fontSize:11,color:C.muted,letterSpacing:"1.5px",textTransform:"uppercase",borderBottom:`1px solid ${C.border}`};
  const TD:React.CSSProperties = {padding:"11px 18px",fontSize:13};

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>

      {/* ── SIDEBAR ── */}
      <div style={{position:"fixed",left:0,top:0,bottom:0,width:220,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"24px 0",zIndex:100}}>
        <div style={{padding:"0 20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:18,fontWeight:700,letterSpacing:"-0.5px",color:"#fff"}}>HH SCG</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2,letterSpacing:"2px",textTransform:"uppercase"}}>Sales Dashboard</div>
        </div>

        {/* Ansicht */}
        <div style={{padding:"20px 16px 8px"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>Ansicht</div>
          {(["gesamt","intern","extern"] as const).map(v=>(
            <button key={v} onClick={()=>setView(v)} style={sideBtn(view===v,v==="intern"?C.green:v==="extern"?C.pink:undefined)}>
              <span style={{textTransform:"capitalize"}}>{v}</span>
              {view===v&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.indigo}}/>}
            </button>
          ))}
        </div>

        <div style={{height:1,background:C.border,margin:"8px 16px"}}/>

        {/* Navigation */}
        <div style={{padding:"8px 16px"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>Navigation</div>
          {([["overview","Übersicht"],["partner","Partner"],["datum","Nach Datum"],["prognose","Prognose"]] as const).map(([t,lbl])=>(
            <button key={t} onClick={()=>setTab(t)} style={sideBtn(tab===t)}>{lbl}</button>
          ))}
        </div>

        {/* Monat Filter */}
        <div style={{padding:"16px 16px 0",marginTop:"auto",borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>Monat</div>
          <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} style={{width:"100%",background:"#1a1a2e",border:`1px solid #2a2a40`,color:C.text,borderRadius:6,padding:"8px 10px",fontSize:13,fontWeight:600}}>
            {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{marginLeft:220,padding:"32px 32px 64px"}}>
        <div style={{marginBottom:32}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <h1 style={{margin:0,fontSize:24,fontWeight:700,letterSpacing:"-0.5px"}}>
              {tab==="overview"?"Übersicht":tab==="partner"?"Partner":tab==="datum"?"Nach Datum":"Prognose"}
            </h1>
            <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",background:view==="intern"?"#0d1f1a":view==="extern"?"#1a0d1a":"#1a1a2e",color:view==="intern"?C.green:view==="extern"?C.pink:C.indigo,border:`1px solid ${view==="intern"?"#1a4a35":view==="extern"?"#4a1a3a":"#2a2a50"}`}}>{view}</span>
            {tab!=="datum"&&<span style={{padding:"3px 10px",borderRadius:20,fontSize:11,background:"#1a1a2e",color:"#888",border:`1px solid ${C.border}`}}>{selectedMonth}</span>}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab==="overview"&&(<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
            {([["SCG Volumen",fmt(monthKpis.vol),"Auftragsvolumen",C.indigo],["Cash IN",fmt(monthKpis.cash),`${monthKpis.vol>0?(monthKpis.cash/monthKpis.vol*100).toFixed(1):0}% Rate`,C.green],["Netto Cash IN",fmt(monthKpis.netto),"Nach Provisionen",C.amber],["Deals",String(monthKpis.deals),"Abgeschlossen",C.pink]] as [string,string,string,string][]).map(([lbl,val,sub,col])=>(
              <div key={lbl} style={{...card(col),padding:"20px 22px"}}>
                <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:8}}>{lbl}</div>
                <div style={{fontSize:22,fontWeight:700,...mono("#fff"),letterSpacing:"-1px"}}>{val}</div>
                <div style={{fontSize:11,color:"#444",marginTop:4}}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{...card(),marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>JAHRESVERLAUF · ALLE MONATE · {view.toUpperCase()}</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:8,height:200}}>
              {allRows.map(({m,vol,cash})=>{
                const maxV=Math.max(...allRows.map(r=>r.vol),1);
                const isSelected=m===selectedMonth;
                return(
                  <div key={m} onClick={()=>setSelectedMonth(m)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:180}}>
                      <div style={{width:22,height:Math.max((vol/maxV)*180,2),background:isSelected?C.indigo:"#2a2a50",borderRadius:"4px 4px 0 0",opacity:.9}}/>
                      <div style={{width:22,height:Math.max((cash/maxV)*180,2),background:isSelected?C.green:"#1a3a2a",borderRadius:"4px 4px 0 0",opacity:.9}}/>
                    </div>
                    <div style={{fontSize:11,color:isSelected?C.text:C.muted,fontWeight:isSelected?700:400}}>{MONTH_SHORT[m]}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:20,marginTop:12}}>
              {[[C.indigo,"SCG Volumen"],[C.green,"Cash IN"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                  <span style={{fontSize:11,color:C.muted}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monatstabelle */}
          <div style={{...card(),padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a0a14"}}>
                {["Monat","SCG Volumen","Cash IN","Netto Cash IN","Deals","Cash-Rate"].map(h=><th key={h} style={TH}>{h}</th>)}
              </tr></thead>
              <tbody>
                {allRows.map(({m,vol,cash,netto,deals},i)=>{
                  const rate=vol>0?(cash/vol*100):0;
                  const isSel=m===selectedMonth;
                  return(
                    <tr key={m} onClick={()=>setSelectedMonth(m)} style={{borderBottom:`1px solid #1a1a28`,background:isSel?"#15152a":i%2===0?"transparent":"#0d0d18",cursor:"pointer"}}>
                      <td style={{...TD,fontWeight:isSel?700:600,color:isSel?C.indigo:C.text}}>{m}</td>
                      <td style={{...TD,...mono(C.indigo)}}>{fmt(vol)}</td>
                      <td style={{...TD,...mono(C.green)}}>{fmt(cash)}</td>
                      <td style={{...TD,...mono(C.amber)}}>{fmt(netto)}</td>
                      <td style={{...TD,color:"#888"}}>{deals}</td>
                      <td style={TD}><span style={{padding:"2px 8px",borderRadius:12,background:rate>=70?"#0d2a1a":rate>=55?"#1a2a10":"#2a1a10",color:rate>=70?C.green:rate>=55?"#84cc16":C.amber,fontSize:12,fontWeight:600}}>{rate.toFixed(1)}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ── PARTNER ── */}
        {tab==="partner"&&(<>
          <div style={{...card(),marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>PARTNER RANKING · {selectedMonth} · {view.toUpperCase()}</div>
            {partners.map(([name,{vol,cash,netto}],i)=>{
              const isInt=INTERN_PARTNERS.has(name);
              return(<div key={name} style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:22,height:22,borderRadius:6,background:i===0?C.indigo:i===1?"#6366f1":i===2?"#4f46e5":C.border,color:i<3?"#fff":C.muted,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</span>
                    <span style={{fontSize:13,fontWeight:600}}>{name}</span>
                    <span style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:isInt?"#0d1f1a":"#1a0d1a",color:isInt?C.green:C.pink,border:`1px solid ${isInt?"#1a4a35":"#4a1a3a"}`}}>{isInt?"INT":"EXT"}</span>
                  </div>
                  <div style={{display:"flex",gap:20}}>
                    {([["Vol",fmt(vol),C.indigo],["Cash",fmt(cash),C.green],["Netto",fmt(netto),C.amber]] as [string,string,string][]).map(([l,v,c])=>(
                      <div key={l} style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:C.muted}}>{l}</div>
                        <div style={{fontSize:12,...mono(c),fontWeight:600}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:C.border,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,width:`${(vol/maxVol)*100}%`,background:`linear-gradient(90deg,${C.indigo},#6366f1)`}}/>
                </div>
              </div>);
            })}
          </div>

          {/* Partner Monatliche Vergleichstabelle */}
          <div style={{...card(),padding:0,overflow:"auto"}}>
            <div style={{padding:"20px 24px 12px",fontSize:13,fontWeight:600,color:"#888"}}>PARTNER VERGLEICH · ALLE MONATE</div>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead><tr style={{background:"#0a0a14"}}>
                <th style={{...TH,whiteSpace:"nowrap"}}>Partner</th>
                {MONTHS.map(m=><th key={m} style={{...TH,textAlign:"right"}}>{MONTH_SHORT[m]}</th>)}
                <th style={{...TH,textAlign:"right",color:C.indigo}}>Total</th>
              </tr></thead>
              <tbody>
                {calcPartners(MONTHS,view).map(([name,{vol}],i)=>(
                  <tr key={name} style={{borderBottom:`1px solid #1a1a28`,background:i%2===0?"transparent":"#0d0d18"}}>
                    <td style={{...TD,fontWeight:600,whiteSpace:"nowrap"}}>{name}</td>
                    {MONTHS.map(m=>{
                      const d=PARTNER_MONTHLY[m]?.[name];
                      const show=d&&(view==="gesamt"||(view==="intern"&&d.intern)||(view==="extern"&&!d.intern));
                      return<td key={m} style={{...TD,textAlign:"right",...mono(show&&d.vol>0?C.indigo:"#2a2a40")}}>{show&&d.vol>0?fmt(d.vol):"—"}</td>;
                    })}
                    <td style={{...TD,textAlign:"right",...mono(C.indigo),fontWeight:700}}>{fmt(vol)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ── DATUM TAB ── */}
        {tab==="datum"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:16}}>
            <div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:"1px",textTransform:"uppercase"}}>Datum auswählen (Mai 2026)</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {MAI_TAGE.map(d=>(
                  <button key={d} onClick={()=>setSelectedDay(d)} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${selectedDay===d?C.indigo:C.border}`,background:selectedDay===d?"#1a1a2e":"transparent",color:selectedDay===d?C.indigo:C.muted,fontSize:13,fontWeight:selectedDay===d?700:400,cursor:"pointer"}}>
                    {d.slice(0,5)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tages-KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
            {([["SCG Volumen",fmt(dayData.vol),C.indigo],["Cash IN",fmt(dayData.cash),C.green],["Deals",String(dayData.count),C.pink]] as [string,string,string][]).map(([lbl,val,col])=>(
              <div key={lbl} style={{...card(col),padding:"20px 22px"}}>
                <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:8}}>{lbl} · {selectedDay}</div>
                <div style={{fontSize:28,fontWeight:700,...mono("#fff"),letterSpacing:"-1px"}}>{val}</div>
              </div>
            ))}
          </div>

          {/* Deals am Tag */}
          <div style={{...card(),marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>DEALS AM {selectedDay} · {view.toUpperCase()}</div>
            {Object.entries(dayData.partnerMap).length===0?(
              <div style={{color:C.muted,fontSize:13,padding:"16px 0"}}>Keine Deals für diese Ansicht an diesem Tag.</div>
            ):(
              Object.entries(dayData.partnerMap).sort((a,b)=>b[1].vol-a[1].vol).map(([partner,{vol,cash}])=>{
                const isInt=INTERN_PARTNERS.has(partner);
                return(
                  <div key={partner} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid #1a1a28`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:600}}>{partner}</span>
                      <span style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:isInt?"#0d1f1a":"#1a0d1a",color:isInt?C.green:C.pink,border:`1px solid ${isInt?"#1a4a35":"#4a1a3a"}`}}>{isInt?"INT":"EXT"}</span>
                    </div>
                    <div style={{display:"flex",gap:24}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:C.muted}}>Volumen</div>
                        <div style={{...mono(C.indigo),fontSize:13,fontWeight:600}}>{fmt(vol)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:C.muted}}>Cash IN</div>
                        <div style={{...mono(C.green),fontSize:13,fontWeight:600}}>{fmt(cash)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Alle Tage im Mai - Übersicht */}
          <div style={{...card(),padding:0,overflow:"hidden"}}>
            <div style={{padding:"20px 24px 12px",fontSize:13,fontWeight:600,color:"#888"}}>MAI 2026 · ALLE TAGE</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#0a0a14"}}>
                <th style={TH}>Datum</th>
                <th style={{...TH,textAlign:"right"}}>SCG Volumen</th>
                <th style={{...TH,textAlign:"right"}}>Cash IN</th>
                <th style={{...TH,textAlign:"right"}}>Deals</th>
              </tr></thead>
              <tbody>
                {MAI_TAGE.map((d,i)=>{
                  const dd=calcDay(d,view);
                  return(
                    <tr key={d} onClick={()=>setSelectedDay(d)} style={{borderBottom:`1px solid #1a1a28`,background:selectedDay===d?"#15152a":i%2===0?"transparent":"#0d0d18",cursor:"pointer"}}>
                      <td style={{...TD,fontWeight:selectedDay===d?700:600,color:selectedDay===d?C.indigo:C.text}}>{d}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.indigo)}}>{fmt(dd.vol)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.green)}}>{fmt(dd.cash)}</td>
                      <td style={{...TD,textAlign:"right",color:"#888"}}>{dd.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ── PROGNOSE ── */}
        {tab==="prognose"&&(<>
          <div style={{...card(),marginBottom:24,padding:28}}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>MONATSZIEL · NETTO CASH IN</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:34,fontWeight:700,...mono("#fff"),letterSpacing:"-2px"}}>{fmt(basisNetto)}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:4}}>April 2026 (letzter Monat)</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:700,...mono(C.amber)}}>{fmt(ZIEL)}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:4}}>Ziel pro Monat</div>
              </div>
            </div>
            <div style={{height:12,borderRadius:6,background:C.border,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",borderRadius:6,width:`${zielPct}%`,background:`linear-gradient(90deg,${C.amber},#d97706)`}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted}}>
              <span>{zielPct.toFixed(1)}% des Ziels erreicht</span>
              <span>Noch {fmt(Math.max(ZIEL-basisNetto,0))} bis Ziel</span>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
            <div style={card(C.indigo)}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:10}}>Jahresprognose</div>
              <div style={{fontSize:26,fontWeight:700,...mono(C.indigo),letterSpacing:"-1px"}}>{fmt(basisNetto*12)}</div>
              <div style={{fontSize:12,color:"#444",marginTop:6}}>Basis: April × 12 Monate</div>
            </div>
            <div style={card(C.green)}>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:10}}>Mai Prognose</div>
              <div style={{fontSize:26,fontWeight:700,...mono(C.green),letterSpacing:"-1px"}}>{fmt(190089.90)}</div>
              <div style={{fontSize:12,color:"#444",marginTop:6}}>Basis: 2 Werktage × 20 Werktage</div>
            </div>
          </div>

          <div style={card()}>
            <div style={{fontSize:13,fontWeight:600,color:"#888",marginBottom:20}}>NETTO CASH IN · MONATSENTWICKLUNG</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:12,height:180}}>
              {MONTHS.slice(0,5).map(m=>{
                const {netto}=calcMonth(m,"gesamt");
                const maxN=Math.max(...MONTHS.slice(0,5).map(mm=>calcMonth(mm,"gesamt").netto),1);
                const isSel=m===selectedMonth;
                return(
                  <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                    <div style={{fontSize:11,...mono(isSel?C.amber:"#333")}}>{(netto/1000).toFixed(0)}k</div>
                    <div style={{width:"100%",height:Math.max((netto/maxN)*160,2),background:isSel?`linear-gradient(180deg,${C.amber},#d97706)`:"#1e1e30",borderRadius:"4px 4px 0 0"}}/>
                    <div style={{fontSize:12,color:isSel?C.text:"#444"}}>{MONTH_SHORT[m]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
