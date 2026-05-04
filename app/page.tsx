"use client";
import { useState, useMemo } from "react";

// ─── INTERN PARTNER LISTE ────────────────────────────────────────────────────
const INTERN_PARTNERS = new Set([
  "ZELLGUT GmbH","Grundl Leadership","Schippke","HH SCG",
  "Nuhi Consulting","White Immobilien","KHPH AG","Peak",
  "Hamann & Kollegen Immobilien GmbH","Candidate-flow"
]);

// ─── SETTER ──────────────────────────────────────────────────────────────────
const SETTER = ["Montano","Cem","Yves","Mert","Kada","Sören","Rene"];

// ─── DEAL-DATEN ──────────────────────────────────────────────────────────────
type Deal = {
  datum: string; monat: string; partner: string;
  total: number; ersteRate: number; intern: boolean;
  setter: string; nettoFaktor: number;
};

const DEALS: Deal[] = [
  // ── Januar 2026 ──────────────────────────────────────────────────────────
  { datum:"05.01.2026", monat:"Januar 2026",  partner:"Candidate-flow",              total:51249,    ersteRate:38316.60, intern:true,  setter:"Montano", nettoFaktor:0.95 },
  { datum:"10.01.2026", monat:"Januar 2026",  partner:"ZELLGUT GmbH",                total:118372.66,ersteRate:64858.52, intern:true,  setter:"Cem",     nettoFaktor:0.82 },
  { datum:"12.01.2026", monat:"Januar 2026",  partner:"Schippke",                    total:39375,    ersteRate:26062.50, intern:true,  setter:"",        nettoFaktor:0.84 },
  { datum:"15.01.2026", monat:"Januar 2026",  partner:"HH SCG",                      total:60000,    ersteRate:20000,    intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"18.01.2026", monat:"Januar 2026",  partner:"Grundl Leadership",           total:35319.14, ersteRate:26163.01, intern:true,  setter:"Yves",    nettoFaktor:0.69 },
  { datum:"20.01.2026", monat:"Januar 2026",  partner:"Nuhi Consulting",             total:13366.25, ersteRate:5238.75,  intern:true,  setter:"",        nettoFaktor:0.84 },
  { datum:"22.01.2026", monat:"Januar 2026",  partner:"White Immobilien",            total:30000,    ersteRate:30000,    intern:true,  setter:"",        nettoFaktor:0.53 },
  { datum:"25.01.2026", monat:"Januar 2026",  partner:"KHPH AG",                     total:25000,    ersteRate:25000,    intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"08.01.2026", monat:"Januar 2026",  partner:"ECOM HOUSE GmbH",             total:26240,    ersteRate:10220,    intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"14.01.2026", monat:"Januar 2026",  partner:"2b AHEAD ThinkTank GmbH",     total:23238.40, ersteRate:14149.20, intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"16.01.2026", monat:"Januar 2026",  partner:"Temmer",                      total:21992.50, ersteRate:8114.52,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"19.01.2026", monat:"Januar 2026",  partner:"Everflow Excellence",         total:20220,    ersteRate:11040,    intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"21.01.2026", monat:"Januar 2026",  partner:"Volume-Trader",               total:17990.66, ersteRate:12020.81, intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"24.01.2026", monat:"Januar 2026",  partner:"Eitel Invest AG",             total:5175,     ersteRate:2548.50,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"28.01.2026", monat:"Januar 2026",  partner:"MBA",                         total:3000,     ersteRate:2375,     intern:false, setter:"",        nettoFaktor:1.00 },
  // ── Februar 2026 ─────────────────────────────────────────────────────────
  { datum:"04.02.2026", monat:"Februar 2026", partner:"Candidate-flow",              total:115342,   ersteRate:66207.55, intern:true,  setter:"Montano", nettoFaktor:0.91 },
  { datum:"07.02.2026", monat:"Februar 2026", partner:"Schippke",                    total:52800,    ersteRate:35904,    intern:true,  setter:"",        nettoFaktor:0.76 },
  { datum:"11.02.2026", monat:"Februar 2026", partner:"Grundl Leadership",           total:39118.69, ersteRate:34768.69, intern:true,  setter:"Cem",     nettoFaktor:0.87 },
  { datum:"14.02.2026", monat:"Februar 2026", partner:"KHPH AG",                     total:86000,    ersteRate:28000,    intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"18.02.2026", monat:"Februar 2026", partner:"Nuhi Consulting",             total:15696,    ersteRate:6032,     intern:true,  setter:"",        nettoFaktor:0.87 },
  { datum:"22.02.2026", monat:"Februar 2026", partner:"ZELLGUT GmbH",                total:3890.76,  ersteRate:1342.44,  intern:true,  setter:"",        nettoFaktor:0.61 },
  { datum:"06.02.2026", monat:"Februar 2026", partner:"Everflow Excellence",         total:33720,    ersteRate:5700,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"10.02.2026", monat:"Februar 2026", partner:"2b AHEAD ThinkTank GmbH",     total:29619.40, ersteRate:16194.40, intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"13.02.2026", monat:"Februar 2026", partner:"ECOM HOUSE GmbH",             total:27000,    ersteRate:9230,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"17.02.2026", monat:"Februar 2026", partner:"Temmer",                      total:22439,    ersteRate:4287.67,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"20.02.2026", monat:"Februar 2026", partner:"Volume-Trader",               total:13345.28, ersteRate:8120.64,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"24.02.2026", monat:"Februar 2026", partner:"Eitel Invest AG",             total:6390,     ersteRate:2695.50,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"26.02.2026", monat:"Februar 2026", partner:"MBA",                         total:1887.50,  ersteRate:755.20,   intern:false, setter:"",        nettoFaktor:1.00 },
  // ── März 2026 ────────────────────────────────────────────────────────────
  { datum:"05.03.2026", monat:"März 2026",    partner:"Candidate-flow",              total:93930,    ersteRate:52904.40, intern:true,  setter:"Montano", nettoFaktor:0.92 },
  { datum:"08.03.2026", monat:"März 2026",    partner:"ZELLGUT GmbH",                total:53305.34, ersteRate:28778.11, intern:true,  setter:"",        nettoFaktor:0.71 },
  { datum:"12.03.2026", monat:"März 2026",    partner:"Grundl Leadership",           total:47966.40, ersteRate:31807.21, intern:true,  setter:"Cem",     nettoFaktor:0.87 },
  { datum:"15.03.2026", monat:"März 2026",    partner:"Schippke",                    total:43250,    ersteRate:35462.50, intern:true,  setter:"",        nettoFaktor:0.75 },
  { datum:"18.03.2026", monat:"März 2026",    partner:"White Immobilien",            total:60197.65, ersteRate:60197.65, intern:true,  setter:"",        nettoFaktor:0.97 },
  { datum:"20.03.2026", monat:"März 2026",    partner:"KHPH AG",                     total:25000,    ersteRate:25000,    intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"24.03.2026", monat:"März 2026",    partner:"Nuhi Consulting",             total:6558.75,  ersteRate:3243.75,  intern:true,  setter:"",        nettoFaktor:0.77 },
  { datum:"07.03.2026", monat:"März 2026",    partner:"ECOM HOUSE GmbH",             total:29876,    ersteRate:17043,    intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"11.03.2026", monat:"März 2026",    partner:"2b AHEAD ThinkTank GmbH",     total:27560,    ersteRate:16160,    intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"14.03.2026", monat:"März 2026",    partner:"Temmer",                      total:16159.50, ersteRate:4390.58,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"17.03.2026", monat:"März 2026",    partner:"Volume-Trader",               total:8129.63,  ersteRate:4812.75,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"22.03.2026", monat:"März 2026",    partner:"Eitel Invest AG",             total:4230,     ersteRate:1777.50,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"26.03.2026", monat:"März 2026",    partner:"CAREFREE",                    total:152.40,   ersteRate:152.40,   intern:false, setter:"",        nettoFaktor:1.00 },
  // ── April 2026 ───────────────────────────────────────────────────────────
  { datum:"03.04.2026", monat:"April 2026",   partner:"Schippke",                    total:83750,    ersteRate:75958.25, intern:true,  setter:"",        nettoFaktor:0.79 },
  { datum:"06.04.2026", monat:"April 2026",   partner:"Candidate-flow",              total:74813.60, ersteRate:58856.73, intern:true,  setter:"Montano", nettoFaktor:0.89 },
  { datum:"09.04.2026", monat:"April 2026",   partner:"Grundl Leadership",           total:58805.82, ersteRate:54105.93, intern:true,  setter:"Cem",     nettoFaktor:0.71 },
  { datum:"12.04.2026", monat:"April 2026",   partner:"ZELLGUT GmbH",                total:10043.60, ersteRate:5187.83,  intern:true,  setter:"",        nettoFaktor:0.66 },
  { datum:"15.04.2026", monat:"April 2026",   partner:"Nuhi Consulting",             total:9577.50,  ersteRate:4480,     intern:true,  setter:"",        nettoFaktor:0.73 },
  { datum:"18.04.2026", monat:"April 2026",   partner:"Peak",                        total:20820.17, ersteRate:20820.17, intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"22.04.2026", monat:"April 2026",   partner:"Hamann & Kollegen Immobilien GmbH", total:20529.41, ersteRate:20529.41, intern:true, setter:"", nettoFaktor:1.00 },
  { datum:"05.04.2026", monat:"April 2026",   partner:"Investmentpunk",              total:38827.53, ersteRate:21608.03, intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"08.04.2026", monat:"April 2026",   partner:"ECOM HOUSE GmbH",             total:28300,    ersteRate:11150,    intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"11.04.2026", monat:"April 2026",   partner:"Everflow Excellence",         total:14600,    ersteRate:4200,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"14.04.2026", monat:"April 2026",   partner:"Volume-Trader",               total:9752.44,  ersteRate:6314.48,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"17.04.2026", monat:"April 2026",   partner:"2b AHEAD ThinkTank GmbH",     total:11068.07, ersteRate:4668.07,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"20.04.2026", monat:"April 2026",   partner:"Eitel Invest AG",             total:5571,     ersteRate:2445,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"23.04.2026", monat:"April 2026",   partner:"Temmer",                      total:2090,     ersteRate:1045,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"25.04.2026", monat:"April 2026",   partner:"Close Consulting - Leon",     total:3900,     ersteRate:1500,     intern:false, setter:"",        nettoFaktor:1.00 },
  // ── Mai 2026 ─────────────────────────────────────────────────────────────
  { datum:"01.05.2026", monat:"Mai 2026",     partner:"Candidate-flow",              total:900,      ersteRate:900,      intern:true,  setter:"",        nettoFaktor:0.95 },
  { datum:"01.05.2026", monat:"Mai 2026",     partner:"Schippke",                    total:1150,     ersteRate:1150,     intern:true,  setter:"",        nettoFaktor:0.84 },
  { datum:"02.05.2026", monat:"Mai 2026",     partner:"Candidate-flow",              total:7386,     ersteRate:5490,     intern:true,  setter:"",        nettoFaktor:0.95 },
  { datum:"02.05.2026", monat:"Mai 2026",     partner:"Investmentpunk",              total:5169.49,  ersteRate:3495.49,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"02.05.2026", monat:"Mai 2026",     partner:"Volume-Trader",               total:337.41,   ersteRate:337.41,   intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"02.05.2026", monat:"Mai 2026",     partner:"Eitel Invest AG",             total:180,      ersteRate:36,       intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Candidate-flow",              total:7840,     ersteRate:5390,     intern:true,  setter:"Montano", nettoFaktor:0.95 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Hamann & Kollegen Immobilien GmbH", total:38340, ersteRate:38340, intern:true,  setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Schippke",                    total:4125,     ersteRate:4125,     intern:true,  setter:"Cem",     nettoFaktor:0.84 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Candidate-flow",              total:2603,     ersteRate:2225,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Investmentpunk",              total:6690.41,  ersteRate:4515.41,  intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Schippke",                    total:1150,     ersteRate:1150,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Close Consulting - Leon",     total:1800,     ersteRate:1800,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Volume-Trader",               total:3749,     ersteRate:3749,     intern:false, setter:"",        nettoFaktor:1.00 },
  { datum:"04.05.2026", monat:"Mai 2026",     partner:"Eitel Invest AG",             total:2000,     ersteRate:400,      intern:false, setter:"",        nettoFaktor:1.00 },
];

const MONTHS = ["Januar 2026","Februar 2026","März 2026","April 2026","Mai 2026"];
const MONTH_SHORT: Record<string,string> = {"Januar 2026":"Jan","Februar 2026":"Feb","März 2026":"Mär","April 2026":"Apr","Mai 2026":"Mai"};
const DEALS_COUNT: Record<string,number> = {"Januar 2026":445,"Februar 2026":283,"März 2026":334,"April 2026":309,"Mai 2026":32};

const fmt  = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const fmt0 = (n:number) => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(n);

type PRow = {
  partner:string; total:number; ersteRate:number;
  internVol:number; internCash:number; externVol:number; externCash:number;
  scgVol:number; scgCash:number; netto:number;
  setterMap:Record<string,number>;
};

function aggregate(deals:Deal[]):PRow[] {
  const map:Record<string,PRow> = {};
  for(const d of deals){
    if(!map[d.partner]) map[d.partner]={
      partner:d.partner, total:0, ersteRate:0,
      internVol:0, internCash:0, externVol:0, externCash:0,
      scgVol:0, scgCash:0, netto:0, setterMap:{}
    };
    const r=map[d.partner];
    r.total+=d.total; r.ersteRate+=d.ersteRate;
    if(d.intern){ r.internVol+=d.ersteRate; r.internCash+=d.ersteRate; }
    else        { r.externVol+=d.ersteRate; r.externCash+=d.ersteRate; }
    r.scgVol+=d.ersteRate; r.scgCash+=d.ersteRate;
    r.netto+=d.ersteRate*d.nettoFaktor;
    if(d.setter) r.setterMap[d.setter]=(r.setterMap[d.setter]||0)+d.ersteRate;
  }
  return Object.values(map).sort((a,b)=>b.total-a.total);
}

function sumRows(rows:PRow[]):PRow {
  return rows.reduce((acc,r)=>({
    partner:"Gesamtsumme", total:acc.total+r.total, ersteRate:acc.ersteRate+r.ersteRate,
    internVol:acc.internVol+r.internVol, internCash:acc.internCash+r.internCash,
    externVol:acc.externVol+r.externVol, externCash:acc.externCash+r.externCash,
    scgVol:acc.scgVol+r.scgVol, scgCash:acc.scgCash+r.scgCash, netto:acc.netto+r.netto,
    setterMap:{}
  }),{partner:"",total:0,ersteRate:0,internVol:0,internCash:0,externVol:0,externCash:0,scgVol:0,scgCash:0,netto:0,setterMap:{}});
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState("Mai 2026");
  const [selectedDatum, setSelectedDatum] = useState("04.05.2026");
  const [activeTab, setActiveTab]         = useState<"tagesansicht"|"monatsansicht"|"jahresuebersicht">("tagesansicht");

  const C = {
    bg:"#07070f", sidebar:"#0b0b15", card:"#0f0f1c", border:"#1c1c2e", border2:"#252538",
    indigo:"#818cf8", green:"#34d399", amber:"#f59e0b", pink:"#f472b6",
    cyan:"#67e8f9", text:"#e8e8f0", muted:"#52526a", dimmed:"#252540",
  };
  const TH: React.CSSProperties = {
    padding:"10px 16px", textAlign:"left", fontSize:11, color:C.muted,
    letterSpacing:"1.2px", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`,
    whiteSpace:"nowrap", background:"#08081a",
  };
  const TD: React.CSSProperties = { padding:"10px 16px", fontSize:13, whiteSpace:"nowrap" };
  const card = (accent?:string):React.CSSProperties => ({
    background:C.card, border:`1px solid ${C.border}`, borderRadius:12,
    ...(accent?{borderTop:`2px solid ${accent}`}:{})
  });
  const mono = (color:string):React.CSSProperties => ({fontFamily:"'DM Mono',monospace",color});

  const tageImMonat = useMemo(()=>[...new Set(DEALS.filter(d=>d.monat===selectedMonth).map(d=>d.datum))].sort(),[selectedMonth]);

  const tagRows     = useMemo(()=>aggregate(DEALS.filter(d=>d.datum===selectedDatum)),[selectedDatum]);
  const tagIntern   = useMemo(()=>tagRows.filter(r=>INTERN_PARTNERS.has(r.partner)),[tagRows]);
  const tagExtern   = useMemo(()=>tagRows.filter(r=>!INTERN_PARTNERS.has(r.partner)),[tagRows]);

  const monatsRows   = useMemo(()=>aggregate(DEALS.filter(d=>d.monat===selectedMonth)),[selectedMonth]);
  const monatsIntern = useMemo(()=>monatsRows.filter(r=>INTERN_PARTNERS.has(r.partner)),[monatsRows]);
  const monatsExtern = useMemo(()=>monatsRows.filter(r=>!INTERN_PARTNERS.has(r.partner)),[monatsRows]);

  const jahresRows   = useMemo(()=>aggregate(DEALS),[]);

  // ── Summary Card ──
  function SumCard({label,vol,cash,netto,color,bg,border}:{label:string;vol:number;cash:number;netto?:number;color:string;bg:string;border:string}) {
    return(
      <div style={{background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"18px 22px"}}>
        <div style={{fontSize:10,color,textTransform:"uppercase",letterSpacing:"2px",marginBottom:14,fontWeight:700}}>{label}</div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>SCG Volumen</div><div style={{fontSize:17,fontWeight:700,...mono(color)}}>{fmt0(vol)}</div></div>
          <div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Cash IN</div><div style={{fontSize:17,fontWeight:700,...mono(C.green)}}>{fmt0(cash)}</div></div>
          {netto!==undefined&&<div><div style={{fontSize:10,color:C.muted,marginBottom:3}}>Netto</div><div style={{fontSize:17,fontWeight:700,...mono(C.amber)}}>{fmt0(netto)}</div></div>}
        </div>
      </div>
    );
  }

  // ── INTERN Tabelle ──
  function InternTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.green,letterSpacing:"1px"}}>INTERN</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.green}}>SUM von Intern Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von Intern Cash IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.green)}}>{fmt(r.internVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.internCash)}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.green)}}>{fmt(sum.internVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.internCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ── EXTERN Tabelle ──
  function ExternTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.pink}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.pink,letterSpacing:"1px"}}>EXTERN</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.pink}}>SUM von Extern Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von Extern Cash IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.pink)}}>{fmt(r.externVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.externCash)}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.pink)}}>{fmt(sum.externVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.externCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ── GESAMT Tabelle ──
  function GesamtTable({rows,label}:{rows:PRow[];label:string}) {
    const sum=sumRows(rows);
    return(
      <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
        <div style={{padding:"13px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.indigo}}/>
          <span style={{fontSize:13,fontWeight:700,color:C.indigo,letterSpacing:"1px"}}>GESAMT</span>
          <span style={{fontSize:12,color:C.muted}}>{label}</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th style={TH}>Partner</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Total</th>
            <th style={{...TH,textAlign:"right"}}>SUM von Erste Rate</th>
            <th style={{...TH,textAlign:"right",color:C.indigo}}>SUM von SCG Volumen</th>
            <th style={{...TH,textAlign:"right",color:C.cyan}}>SUM von SCG Cash IN</th>
            {SETTER.map(s=><th key={s} style={{...TH,textAlign:"right",color:C.amber}}>{s}</th>)}
            <th style={{...TH,textAlign:"right",color:C.green}}>Netto Cash-IN</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.partner} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":"#0c0c1a"}}>
                <td style={{...TD,fontWeight:600,color:C.text}}>{r.partner}</td>
                <td style={{...TD,textAlign:"right",...mono(C.text)}}>{fmt(r.total)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.muted)}}>{fmt(r.ersteRate)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.indigo)}}>{fmt(r.scgVol)}</td>
                <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(r.scgCash)}</td>
                {SETTER.map(s=><td key={s} style={{...TD,textAlign:"right",...mono(r.setterMap[s]?C.amber:C.dimmed)}}>{fmt(r.setterMap[s]||0)}</td>)}
                <td style={{...TD,textAlign:"right",...mono(C.green),fontWeight:600}}>{fmt(r.netto)}</td>
              </tr>
            ))}
            <tr style={{background:"#09091a",borderTop:`2px solid ${C.border2}`}}>
              <td style={{...TD,fontWeight:700,color:"#fff"}}>Gesamtsumme</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.text)}}>{fmt(sum.total)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.muted)}}>{fmt(sum.ersteRate)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.indigo)}}>{fmt(sum.scgVol)}</td>
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.cyan)}}>{fmt(sum.scgCash)}</td>
              {SETTER.map(s=>{const t=rows.reduce((a,r)=>a+(r.setterMap[s]||0),0);return<td key={s} style={{...TD,textAlign:"right",fontWeight:700,...mono(t?C.amber:C.dimmed)}}>{fmt(t)}</td>;})}
              <td style={{...TD,textAlign:"right",fontWeight:700,...mono(C.green)}}>{fmt(sum.netto)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const sideBtn=(active:boolean):React.CSSProperties=>({
    display:"flex",alignItems:"center",justifyContent:"space-between",
    width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,
    border:"none",cursor:"pointer",marginBottom:3,
    background:active?"#1a1a30":"transparent",
    color:active?C.text:C.muted,fontSize:13,fontWeight:active?600:400,
  });

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans','Inter',sans-serif",display:"flex"}}>

      {/* ── SIDEBAR ── */}
      <div style={{width:220,background:C.sidebar,borderRight:`1px solid ${C.border}`,position:"fixed",top:0,bottom:0,left:0,zIndex:100,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:19,fontWeight:800,letterSpacing:"-0.5px",color:"#fff"}}>HH SCG</div>
          <div style={{fontSize:10,color:C.muted,marginTop:2,letterSpacing:"3px"}}>SALES DASHBOARD</div>
        </div>

        {/* Ansicht */}
        <div style={{padding:"14px 12px 4px"}}>
          <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",marginBottom:6,padding:"0 4px",textTransform:"uppercase"}}>Ansicht</div>
          {([["tagesansicht","📅 Tagesansicht"],["monatsansicht","📊 Monatsansicht"],["jahresuebersicht","📈 Jahresübersicht"]] as const).map(([t,lbl])=>(
            <button key={t} onClick={()=>setActiveTab(t)} style={sideBtn(activeTab===t)}>
              <span>{lbl}</span>
              {activeTab===t&&<span style={{width:6,height:6,borderRadius:"50%",background:C.indigo,flexShrink:0}}/>}
            </button>
          ))}
        </div>

        <div style={{height:1,background:C.border,margin:"8px 12px"}}/>

        {/* Monat */}
        <div style={{padding:"4px 12px"}}>
          <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",marginBottom:6,padding:"0 4px",textTransform:"uppercase"}}>Monat</div>
          {MONTHS.map(m=>(
            <button key={m} onClick={()=>{setSelectedMonth(m);const t=[...new Set(DEALS.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}} style={sideBtn(selectedMonth===m)}>
              <span>{m}</span>
              {selectedMonth===m&&<span style={{width:6,height:6,borderRadius:"50%",background:C.green,flexShrink:0}}/>}
            </button>
          ))}
        </div>

        {/* Datum (nur Tagesansicht) */}
        {activeTab==="tagesansicht"&&(<>
          <div style={{height:1,background:C.border,margin:"8px 12px"}}/>
          <div style={{padding:"4px 12px 16px"}}>
            <div style={{fontSize:10,color:"#2e2e50",letterSpacing:"2px",marginBottom:6,padding:"0 4px",textTransform:"uppercase"}}>Datum</div>
            {tageImMonat.map(d=>(
              <button key={d} onClick={()=>setSelectedDatum(d)} style={sideBtn(selectedDatum===d)}>
                <span>{d.slice(0,5)}</span>
                {selectedDatum===d&&<span style={{width:6,height:6,borderRadius:"50%",background:C.amber,flexShrink:0}}/>}
              </button>
            ))}
          </div>
        </>)}
      </div>

      {/* ── MAIN ── */}
      <div style={{marginLeft:220,flex:1,padding:"28px 32px 64px",minWidth:0}}>

        {/* ── TAGESANSICHT ── */}
        {activeTab==="tagesansicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Tagesansicht</h1>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:"#1a1a2e",color:C.amber,border:`1px solid #3a3a20`}}>{selectedDatum}</span>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,background:"#1a1a2e",color:C.muted,border:`1px solid ${C.border}`}}>{selectedMonth}</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
            <SumCard label="INTERN" vol={sumRows(tagIntern).scgVol} cash={sumRows(tagIntern).scgCash} color={C.green} bg="#0a1a10" border="#1a4a25"/>
            <SumCard label="EXTERN" vol={sumRows(tagExtern).scgVol} cash={sumRows(tagExtern).scgCash} color={C.pink}  bg="#1a0a10" border="#4a1a25"/>
            <SumCard label="GESAMT" vol={sumRows(tagRows).scgVol}   cash={sumRows(tagRows).scgCash}   color={C.indigo} bg="#0f0f1c" border="#2a2a50"/>
          </div>

          <InternTable rows={tagIntern} label={selectedDatum}/>
          <ExternTable rows={tagExtern} label={selectedDatum}/>
          <GesamtTable rows={tagRows}   label={selectedDatum}/>
        </>)}

        {/* ── MONATSANSICHT ── */}
        {activeTab==="monatsansicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Monatsansicht</h1>
            <span style={{padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:"#1a1a2e",color:C.indigo,border:`1px solid #2a2a50`}}>{selectedMonth}</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
            <SumCard label="INTERN" vol={sumRows(monatsIntern).scgVol} cash={sumRows(monatsIntern).scgCash} netto={sumRows(monatsIntern).netto} color={C.green}  bg="#0a1a10" border="#1a4a25"/>
            <SumCard label="EXTERN" vol={sumRows(monatsExtern).scgVol} cash={sumRows(monatsExtern).scgCash} netto={sumRows(monatsExtern).netto} color={C.pink}   bg="#1a0a10" border="#4a1a25"/>
            <SumCard label="GESAMT" vol={sumRows(monatsRows).scgVol}   cash={sumRows(monatsRows).scgCash}   netto={sumRows(monatsRows).netto}   color={C.indigo}  bg="#0f0f1c" border="#2a2a50"/>
          </div>

          <InternTable rows={monatsIntern} label={selectedMonth}/>
          <ExternTable rows={monatsExtern} label={selectedMonth}/>
          <GesamtTable rows={monatsRows}   label={selectedMonth}/>
        </>)}

        {/* ── JAHRESÜBERSICHT ── */}
        {activeTab==="jahresuebersicht"&&(<>
          <div style={{marginBottom:24,display:"flex",alignItems:"center",gap:10}}>
            <h1 style={{margin:0,fontSize:21,fontWeight:700}}>Jahresübersicht 2026</h1>
          </div>

          {/* Balken Chart */}
          <div style={{...card(),padding:24,marginBottom:28}}>
            <div style={{fontSize:11,fontWeight:600,color:C.muted,letterSpacing:"1.5px",marginBottom:20}}>SCG VOLUMEN · ALLE MONATE</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:160}}>
              {MONTHS.map(m=>{
                const rows=aggregate(DEALS.filter(d=>d.monat===m));
                const vol=rows.reduce((a,r)=>a+r.scgVol,0);
                const maxV=Math.max(...MONTHS.map(mm=>aggregate(DEALS.filter(d=>d.monat===mm)).reduce((a,r)=>a+r.scgVol,0)),1);
                const isSel=m===selectedMonth;
                return(
                  <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>{setSelectedMonth(m);const t=[...new Set(DEALS.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}}>
                    <div style={{fontSize:10,...mono(isSel?C.amber:C.muted)}}>{fmt0(vol)}</div>
                    <div style={{width:"100%",height:Math.max((vol/maxV)*130,3),background:isSel?`linear-gradient(180deg,${C.indigo},#4f46e5)`:"#1e1e38",borderRadius:"4px 4px 0 0"}}/>
                    <div style={{fontSize:12,color:isSel?C.text:C.muted,fontWeight:isSel?700:400}}>{MONTH_SHORT[m]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monatstabelle */}
          <div style={{...card(),padding:0,overflow:"auto",marginBottom:28}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={TH}>Monat</th>
                <th style={{...TH,textAlign:"right",color:C.indigo}}>SCG Volumen</th>
                <th style={{...TH,textAlign:"right",color:C.cyan}}>SCG Cash IN</th>
                <th style={{...TH,textAlign:"right",color:C.green}}>Netto Cash-IN</th>
                <th style={{...TH,textAlign:"right"}}>Deals</th>
                <th style={{...TH,textAlign:"right"}}>Cash-Rate</th>
              </tr></thead>
              <tbody>
                {MONTHS.map((m,i)=>{
                  const rows=aggregate(DEALS.filter(d=>d.monat===m));
                  const vol=rows.reduce((a,r)=>a+r.scgVol,0);
                  const cash=rows.reduce((a,r)=>a+r.scgCash,0);
                  const netto=rows.reduce((a,r)=>a+r.netto,0);
                  const rate=vol>0?cash/vol*100:0;
                  const isSel=m===selectedMonth;
                  return(
                    <tr key={m} onClick={()=>{setSelectedMonth(m);const t=[...new Set(DEALS.filter(d=>d.monat===m).map(d=>d.datum))].sort();if(t.length)setSelectedDatum(t[t.length-1]);}} style={{borderBottom:`1px solid ${C.border}`,background:isSel?"#13132a":i%2===0?"transparent":"#0c0c1a",cursor:"pointer"}}>
                      <td style={{...TD,fontWeight:isSel?700:600,color:isSel?C.indigo:C.text}}>{m}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.indigo)}}>{fmt(vol)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.cyan)}}>{fmt(cash)}</td>
                      <td style={{...TD,textAlign:"right",...mono(C.green)}}>{fmt(netto)}</td>
                      <td style={{...TD,textAlign:"right",color:C.muted}}>{DEALS_COUNT[m]||0}</td>
                      <td style={{...TD,textAlign:"right"}}><span style={{padding:"2px 9px",borderRadius:12,background:rate>=70?"#0d2a1a":rate>=55?"#1a2a10":"#2a1a10",color:rate>=70?C.green:rate>=55?"#84cc16":C.amber,fontSize:12,fontWeight:600}}>{rate.toFixed(1)}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <GesamtTable rows={jahresRows} label="Gesamtes Jahr 2026"/>
        </>)}
      </div>
    </div>
  );
}
