"use client";
import { useState } from "react";

const funnelData = [
  { n: "01", label: "Presetting", count: 3506, color: "#1a1a1a", max: 3506 },
  { n: "02", label: "Presetting FollowUp", count: 613, color: "#1a1a1a", max: 3506 },
  { n: "03", label: "Setting", count: 439, color: "#1a1a1a", max: 3506 },
  { n: "04", label: "Setting FollowUp", count: 290, color: "#1a1a1a", max: 3506 },
  { n: "05", label: "Setting NoShow", count: 262, color: "#aaa", max: 3506 },
  { n: "06", label: "Closing", count: 250, color: "#1a1a1a", max: 3506 },
  { n: "07", label: "Closing FollowUp", count: 11, color: "#aaa", max: 3506 },
  { n: "08", label: "Closing NoShow", count: 128, color: "#aaa", max: 3506 },
  { n: "09", label: "Gewonnen", count: 2660, color: "#1D9E75", max: 3506 },
  { n: "10", label: "Verloren", count: 89, color: "#aaa", max: 3506 },
  { n: "11", label: "Unqualified", count: 3226, color: "#aaa", max: 3506 },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState(4);
  const navItems = [
    { n: "01", label: "Overview", sub: "Weekly Pulse" },
    { n: "02", label: "Marketing", sub: "Leads & ROAS" },
    { n: "03", label: "LinkedIn", sub: "Reach & Engagement" },
    { n: "04", label: "E-Mail Marketing", sub: "Opens & Conversions" },
    { n: "05", label: "Sales", sub: "Funnel & Deals" },
    { n: "06", label: "Finance", sub: "Cash & Forderungen" },
    { n: "07", label: "Retention", sub: "Upsell & CLV" },
    { n: "08", label: "Operations", sub: "Utilisation & Margin" },
  ];
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#f5f4f0" }}>
      <div style={{ width: 220, background: "#fff", borderRight: "0.5px solid rgba(0,0,0,0.1)", padding: "20px 0", position: "fixed", height: "100vh" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>PEAK REVENUE</div>
          <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase" }}>KPI Dashboard</div>
        </div>
        {navItems.map((item, i) => (
          <div key={i} onClick={() => setActiveNav(i)} style={{ display: "flex", gap: 10, padding: "8px 20px", cursor: "pointer", background: activeNav === i ? "#f5f4f0" : "transparent" }}>
            <span style={{ fontSize: 10, color: "#999" }}>{item.n}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "#999" }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginLeft: 220, padding: "28px 32px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[{ label: "Leads gesamt", val: "11.474" }, { label: "Gewonnen", val: "2.660" }, { label: "Verloren", val: "89" }, { label: "In Pipeline", val: "8.499" }].map((c, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 10, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{c.val}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(0,0,0,0.08)", fontSize: 11, color: "#999" }}>Pipeline-Übersicht · 11.474 Leads gesamt</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {funnelData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "0.5px solid rgba(0,0,0,0.06)", borderRight: i % 2 === 0 ? "0.5px solid rgba(0,0,0,0.06)" : "none" }}>
                <span style={{ fontSize: 10, color: "#bbb", minWidth: 14 }}>{d.n}</span>
                <span style={{ fontSize: 12, minWidth: 150 }}>{d.label}</span>
                <div style={{ flex: 1, height: 6, background: "#f0efe9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: d.color, width: `${Math.max((d.count / d.max) * 100, 2)}%` }}/>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, minWidth: 40, textAlign: "right" }}>{d.count.toLocaleString("de-DE")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
