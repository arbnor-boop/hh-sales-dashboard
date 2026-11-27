"use client";
import React, { useEffect, useMemo, useState } from "react";

// "Projekte & Kosten" für das Peak-Dashboard.
// Daten: /api/kosten?typ=projekte (Reiter "Projekte") und ?typ=mitarbeiter (Reiter "Mitarbeiter")
// aus dem Google Sheet "Peak Projekte & Mitarbeiterkosten 2026".

type ProjektZeile = { monat: string; projekt: string; umsatz: number; kosten: number; gewinn: number; pers: Record<string, number> };
type MaZeile = { monat: string; person: string; grund: number; reise: number; kosten: number; retainer: number; einnahmen: number; ergebnis: number };

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monatName = (m: string) => (m ? MONATE[Number(m.slice(5, 7)) - 1] + " " + m.slice(0, 4) : "");
const eur = (v: number | null | undefined) =>
  v == null || isNaN(v) ? "—" : new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
const pct = (v: number | null | undefined) =>
  v == null || isNaN(v) ? "—" : new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 }).format(v);

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

function num(s: string | undefined): number {
  let t = String(s ?? "").replace(/[€\s  ]/g, "");
  if (!t || t === "-" || t === "—") return 0;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  const n = Number(t);
  return isFinite(n) ? n : 0;
}

function monatKey(s: string): string {
  const m = String(s ?? "").trim().match(/^(\d{1,2})-(\d{4})$/);
  return m ? m[2] + "-" + m[1].padStart(2, "0") : "";
}

export function ladeProjekte(text: string): { zeilen: ProjektZeile[]; personen: string[] } {
  const rows = parseCsv(text);
  const hi = rows.findIndex((r) => r.map((c) => c.trim()).includes("Projekt") && r.map((c) => c.trim()).includes("Umsatz"));
  if (hi < 0) return { zeilen: [], personen: [] };
  const head = rows[hi].map((c) => c.trim());
  const iM = head.indexOf("Monat"), iP = head.indexOf("Projekt"), iU = head.indexOf("Umsatz");
  let iG = head.indexOf("Gewinn"); if (iG < 0) iG = head.length;
  const personen = head.slice(iU + 1, iG).filter(Boolean);
  const zeilen: ProjektZeile[] = [];
  for (const r of rows.slice(hi + 1)) {
    const monat = monatKey(r[iM]); const projekt = String(r[iP] ?? "").trim();
    if (!monat || !projekt) continue;
    const pers: Record<string, number> = {}; let kosten = 0;
    personen.forEach((p, k) => { const v = num(r[iU + 1 + k]); if (v) { pers[p] = v; kosten += v; } });
    const umsatz = num(r[iU]);
    zeilen.push({ monat, projekt, umsatz, kosten, gewinn: umsatz - kosten, pers });
  }
  return { zeilen, personen };
}

export function ladeMitarbeiter(text: string): MaZeile[] {
  const rows = parseCsv(text);
  const hi = rows.findIndex((r) => String(r[0] ?? "").trim() === "Monat");
  if (hi < 0) return [];
  const head = rows[hi].map((c) => c.trim());
  const c = (n: string) => head.indexOf(n);
  const reiseSp = ["Zugtickets", "Zuschuss", "Hotel", "Taxi / Sixt", "Tanken", "Flugtickets"].map(c).filter((i) => i >= 0);
  const out: MaZeile[] = [];
  for (const r of rows.slice(hi + 1)) {
    const monat = monatKey(r[0]); const person = String(r[c("Mitarbeiter")] ?? "").trim();
    if (!monat || !person) continue;
    const kosten = num(r[c("Gesamtkosten")]), retainer = c("Retainer") >= 0 ? num(r[c("Retainer")]) : 0, einnahmen = num(r[c("Einnahmen")]);
    out.push({
      monat, person, grund: num(r[c("Grundkosten")]), reise: reiseSp.reduce((t, i) => t + num(r[i]), 0),
      kosten, retainer, einnahmen, ergebnis: einnahmen + retainer - kosten,
    });
  }
  return out;
}

const F = {
  bg: "#f0ece0", card: "#ffffff", border: "#d4c9b8", text: "#1a1208", muted: "#6b5e4e", th: "#e8ddd0",
  akzent: "#5c4a2a", green: "#2d7a3a", red: "#c0392b", amber: "#a07820",
};
const TH: React.CSSProperties = { padding: "10px 14px", textAlign: "right", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: F.muted, background: F.th, fontWeight: 600, whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "10px 14px", textAlign: "right", borderBottom: `1px solid ${F.border}`, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" };
const L: React.CSSProperties = { textAlign: "left" };
const farbe = (v: number) => (v < 0 ? F.red : F.green);

function Kachel({ titel, wert, sub, farbeOben }: { titel: string; wert: string; sub?: string; farbeOben: string }) {
  return (
    <div style={{ background: F.card, border: `1px solid ${F.border}`, borderTop: `3px solid ${farbeOben}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, color: F.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>{titel}</div>
      <div style={{ fontWeight: 800, fontSize: 26, marginTop: 6, fontVariantNumeric: "tabular-nums", color: F.text }}>{wert}</div>
      {sub && <div style={{ fontSize: 12, color: F.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Karte({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: F.muted, letterSpacing: 2, textTransform: "uppercase", padding: "14px 16px 8px" }}>{titel}</div>
      <div style={{ overflowX: "auto" }}>{children}</div>
    </div>
  );
}

export default function PeakKosten() {
  const [projekte, setProjekte] = useState<ProjektZeile[]>([]);
  const [mitarbeiter, setMitarbeiter] = useState<MaZeile[]>([]);
  const [status, setStatus] = useState<"laden" | "ok" | "fehler">("laden");
  const [monat, setMonat] = useState("");
  const [offen, setOffen] = useState<Set<string>>(new Set());

  useEffect(() => {
    let aktiv = true;
    const laden = async () => {
      try {
        const [p, m] = await Promise.all([
          fetch("/api/kosten?typ=projekte&t=" + Date.now(), { cache: "no-store" }),
          fetch("/api/kosten?typ=mitarbeiter&t=" + Date.now(), { cache: "no-store" }),
        ]);
        if (!p.ok) throw new Error("projekte");
        const pz = ladeProjekte(await p.text());
        const mz = m.ok ? ladeMitarbeiter(await m.text()) : [];
        if (!aktiv) return;
        setProjekte(pz.zeilen); setMitarbeiter(mz); setStatus("ok");
      } catch {
        if (aktiv) setStatus("fehler");
      }
    };
    laden();
    const t = setInterval(laden, 5 * 60 * 1000);
    return () => { aktiv = false; clearInterval(t); };
  }, []);

  const monate = useMemo(() => [...new Set([...projekte.map((r) => r.monat), ...mitarbeiter.map((r) => r.monat)])].sort(), [projekte, mitarbeiter]);
  const pSel = useMemo(() => (monat ? projekte.filter((r) => r.monat === monat) : projekte), [projekte, monat]);
  const mSel = useMemo(() => (monat ? mitarbeiter.filter((r) => r.monat === monat) : mitarbeiter), [mitarbeiter, monat]);

  const kpi = useMemo(() => {
    const umsatz = pSel.reduce((t, r) => t + r.umsatz, 0), kosten = pSel.reduce((t, r) => t + r.kosten, 0);
    return { umsatz, kosten, gewinn: umsatz - kosten, marge: umsatz ? (umsatz - kosten) / umsatz : null };
  }, [pSel]);

  const proProjekt = useMemo(() => {
    const m = new Map<string, { projekt: string; umsatz: number; kosten: number; pers: Record<string, number>; zeilen: ProjektZeile[] }>();
    for (const r of pSel) {
      const a = m.get(r.projekt) || { projekt: r.projekt, umsatz: 0, kosten: 0, pers: {}, zeilen: [] };
      a.umsatz += r.umsatz; a.kosten += r.kosten; a.zeilen.push(r);
      for (const [p, v] of Object.entries(r.pers)) a.pers[p] = (a.pers[p] || 0) + v;
      m.set(r.projekt, a);
    }
    return [...m.values()].filter((a) => a.umsatz || a.kosten)
      .map((a) => ({ ...a, gewinn: a.umsatz - a.kosten, zeilen: a.zeilen.sort((x, y) => x.monat.localeCompare(y.monat)) }))
      .sort((a, b) => b.gewinn - a.gewinn);
  }, [pSel]);

  const proMonat = useMemo(() => {
    const m = new Map<string, { monat: string; umsatz: number; kosten: number }>();
    for (const r of projekte) {
      const a = m.get(r.monat) || { monat: r.monat, umsatz: 0, kosten: 0 };
      a.umsatz += r.umsatz; a.kosten += r.kosten; m.set(r.monat, a);
    }
    return [...m.values()].sort((a, b) => a.monat.localeCompare(b.monat));
  }, [projekte]);

  const proPerson = useMemo(() => {
    const m = new Map<string, { person: string; grund: number; reise: number; kosten: number; retainer: number; einnahmen: number; ergebnis: number }>();
    for (const r of mSel) {
      const a = m.get(r.person) || { person: r.person, grund: 0, reise: 0, kosten: 0, retainer: 0, einnahmen: 0, ergebnis: 0 };
      a.grund += r.grund; a.reise += r.reise; a.kosten += r.kosten; a.retainer += r.retainer; a.einnahmen += r.einnahmen; a.ergebnis += r.ergebnis;
      m.set(r.person, a);
    }
    return [...m.values()].sort((a, b) => b.ergebnis - a.ergebnis);
  }, [mSel]);

  const maxMonat = Math.max(1, ...proMonat.map((r) => Math.max(r.umsatz, r.kosten)));
  const zeitraum = monat ? monatName(monat) : "Ganzes Jahr";

  if (status === "laden") return <div style={{ padding: 40, color: F.muted }}>Lade Projekte & Kosten…</div>;
  if (status === "fehler")
    return (
      <div style={{ padding: 24, background: F.card, border: `1px solid ${F.border}`, borderRadius: 12, color: F.text }}>
        Die Tabelle „Peak Projekte & Mitarbeiterkosten 2026“ konnte nicht geladen werden. In Vercel müssen
        <code> PEAK_PROJEKTE_CSV_URL</code> und <code>PEAK_MITARBEITER_CSV_URL</code> gesetzt sein.
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, color: F.text }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>💼 Projekte & Kosten — {zeitraum}</h2>
        <select value={monat} onChange={(e) => setMonat(e.target.value)}
          style={{ marginLeft: "auto", padding: "8px 12px", borderRadius: 8, border: `1px solid ${F.border}`, background: F.card, color: F.text, fontSize: 13 }}>
          <option value="">Ganzes Jahr</option>
          {monate.slice().reverse().map((m) => <option key={m} value={m}>{monatName(m)}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
        <Kachel titel="Umsatz netto" wert={eur(kpi.umsatz)} sub={zeitraum} farbeOben={F.akzent} />
        <Kachel titel="Mitarbeiterkosten" wert={eur(kpi.kosten)} sub={(kpi.umsatz ? pct(kpi.kosten / kpi.umsatz) : "—") + " vom Umsatz"} farbeOben={F.amber} />
        <Kachel titel="Gewinn" wert={eur(kpi.gewinn)} sub="Umsatz − Mitarbeiterkosten" farbeOben={F.green} />
        <Kachel titel="Marge" wert={pct(kpi.marge)} sub="Gewinn ÷ Umsatz" farbeOben={F.green} />
      </div>

      <Karte titel="Umsatz, Kosten und Gewinn pro Monat">
        <div style={{ padding: "4px 16px 16px" }}>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: F.muted, marginBottom: 10 }}>
            <span><i style={{ display: "inline-block", width: 10, height: 10, background: F.akzent, borderRadius: 2, marginRight: 5 }} />Umsatz</span>
            <span><i style={{ display: "inline-block", width: 10, height: 10, background: F.amber, borderRadius: 2, marginRight: 5 }} />Mitarbeiterkosten</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200 }}>
            {proMonat.map((r) => (
              <div key={r.monat} onClick={() => setMonat(r.monat === monat ? "" : r.monat)}
                title={`${monatName(r.monat)}\nUmsatz: ${eur(r.umsatz)}\nKosten: ${eur(r.kosten)}\nGewinn: ${eur(r.umsatz - r.kosten)}`}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: !monat || monat === r.monat ? 1 : 0.35 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 175, width: "100%", justifyContent: "center" }}>
                  <div style={{ width: "40%", height: `${(r.umsatz / maxMonat) * 100}%`, background: F.akzent, borderRadius: 2 }} />
                  <div style={{ width: "40%", height: `${(r.kosten / maxMonat) * 100}%`, background: F.amber, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 11, color: F.muted, marginTop: 6, fontWeight: monat === r.monat ? 700 : 400 }}>{MONATE[Number(r.monat.slice(5, 7)) - 1].slice(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </Karte>

      <Karte titel="Projekte (Klick klappt die Monate auf)">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr>
            <th style={{ ...TH, ...L }}>Projekt</th><th style={TH}>Umsatz</th><th style={TH}>Mitarbeiterkosten</th>
            <th style={TH}>Gewinn</th><th style={TH}>Marge</th><th style={{ ...TH, ...L }}>Mitarbeiter</th>
          </tr></thead>
          <tbody>
            {proProjekt.map((p) => (
              <React.Fragment key={p.projekt}>
                <tr style={{ cursor: "pointer" }} onClick={() => setOffen((s) => { const n = new Set(s); if (n.has(p.projekt)) n.delete(p.projekt); else n.add(p.projekt); return n; })}>
                  <td style={{ ...TD, ...L, fontWeight: 700 }}>{offen.has(p.projekt) ? "▾ " : "▸ "}{p.projekt}</td>
                  <td style={TD}>{eur(p.umsatz)}</td><td style={TD}>{eur(p.kosten)}</td>
                  <td style={{ ...TD, color: farbe(p.gewinn), fontWeight: 700 }}>{eur(p.gewinn)}</td>
                  <td style={TD}>{pct(p.umsatz ? p.gewinn / p.umsatz : null)}</td>
                  <td style={{ ...TD, ...L, whiteSpace: "normal", color: F.muted, fontSize: 12, minWidth: 220 }}>
                    {Object.entries(p.pers).sort((a, b) => b[1] - a[1]).map(([n, v]) => `${n} ${eur(v)}`).join(" · ") || "—"}
                  </td>
                </tr>
                {offen.has(p.projekt) && p.zeilen.map((z) => (
                  <tr key={p.projekt + z.monat} style={{ background: "#faf6ef" }}>
                    <td style={{ ...TD, ...L, paddingLeft: 34, color: F.muted }}>{monatName(z.monat)}</td>
                    <td style={TD}>{eur(z.umsatz)}</td><td style={TD}>{eur(z.kosten)}</td>
                    <td style={{ ...TD, color: farbe(z.gewinn) }}>{eur(z.gewinn)}</td>
                    <td style={TD}>{pct(z.umsatz ? z.gewinn / z.umsatz : null)}</td>
                    <td style={{ ...TD, ...L, whiteSpace: "normal", color: F.muted, fontSize: 12 }}>
                      {Object.entries(z.pers).map(([n, v]) => `${n} ${eur(v)}`).join(" · ") || "—"}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {!proProjekt.length && <tr><td style={{ ...TD, ...L, color: F.muted }} colSpan={6}>Keine Einträge in diesem Zeitraum.</td></tr>}
            {!!proProjekt.length && (
              <tr style={{ background: F.th, fontWeight: 800 }}>
                <td style={{ ...TD, ...L }}>Summe</td><td style={TD}>{eur(kpi.umsatz)}</td><td style={TD}>{eur(kpi.kosten)}</td>
                <td style={{ ...TD, color: farbe(kpi.gewinn) }}>{eur(kpi.gewinn)}</td><td style={TD}>{pct(kpi.marge)}</td><td style={TD} />
              </tr>
            )}
          </tbody>
        </table>
      </Karte>

      <Karte titel="Mitarbeiter-Rentabilität (Ergebnis = Einnahmen + Retainer − Gesamtkosten)">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr>
            <th style={{ ...TH, ...L }}>Mitarbeiter</th><th style={TH}>Grundkosten</th><th style={TH}>Reisekosten</th><th style={TH}>Gesamtkosten</th>
            <th style={TH}>Retainer</th><th style={TH}>Einnahmen</th><th style={TH}>Ergebnis</th><th style={TH}>Rentabilität</th>
          </tr></thead>
          <tbody>
            {proPerson.map((r) => (
              <tr key={r.person}>
                <td style={{ ...TD, ...L, fontWeight: 700 }}>{r.person}</td>
                <td style={TD}>{eur(r.grund)}</td><td style={TD}>{r.reise ? eur(r.reise) : "–"}</td><td style={TD}>{eur(r.kosten)}</td>
                <td style={TD}>{r.retainer ? eur(r.retainer) : "–"}</td><td style={TD}>{eur(r.einnahmen)}</td>
                <td style={{ ...TD, color: farbe(r.ergebnis), fontWeight: 700 }}>{eur(r.ergebnis)}</td>
                <td style={{ ...TD, color: farbe(r.ergebnis) }}>{pct(r.kosten ? r.ergebnis / r.kosten : null)}</td>
              </tr>
            ))}
            {!proPerson.length && <tr><td style={{ ...TD, ...L, color: F.muted }} colSpan={8}>Keine Mitarbeiterdaten in diesem Zeitraum.</td></tr>}
          </tbody>
        </table>
      </Karte>

      <p style={{ fontSize: 12, color: F.muted, margin: 0 }}>
        Quelle: Google Sheet „Peak Projekte & Mitarbeiterkosten 2026“ (Reiter „Projekte“ und „Mitarbeiter“), aktualisiert alle 5 Minuten.
        Gewinn = Umsatz minus Summe der Mitarbeiter-Spalten.
      </p>
    </div>
  );
}
