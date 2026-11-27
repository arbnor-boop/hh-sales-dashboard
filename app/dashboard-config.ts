// ============================================================
// Dashboard-Konfiguration
// ------------------------------------------------------------
// Derselbe Code läuft als zwei getrennte Dashboards (zwei Vercel-Projekte):
//
//  1) HH SCG Dashboard (Standard)
//     NEXT_PUBLIC_DASHBOARD_MODE   nicht gesetzt (oder "hh")
//     NEXT_PUBLIC_HIDE_PROJEKTE    "1"  -> die 6 Projekte werden hier ausgeblendet
//
//  2) Projekte-Dashboard (Investmentpunk, ProviPanda, SML, Close Consulting - Leon,
//     OD Solutions, ZELLGUT) – Daten aus einem Google Sheet in einem anderen Google Drive
//     NEXT_PUBLIC_DASHBOARD_MODE     "projekte"
//     SALES_SHEET_CSV_URL            CSV-Link ("Im Web veröffentlichen") des Sheets im anderen Drive
//     NEXT_PUBLIC_SALES_PASSWORD     eigenes Passwort
//     NEXT_PUBLIC_DASHBOARD_TITLE    optional, Name oben links (Standard "PROJEKTE")
//     NEXT_PUBLIC_SHOW_ALL_PARTNERS  "1" -> alle Partner aus diesem Sheet zeigen (nicht nur die 6)
// ============================================================

export const PROJEKT_PARTNERS = [
  "Investmentpunk",
  "ProviPanda",
  "SML Solution GmbH",
  "Close Consulting - Leon",
  "OD Solutions GmbH",
  "ZELLGUT GmbH",
];

// Normalisierte Erkennungs-Schlüssel (fängt Schreibvarianten wie "Invesmentpunk",
// "Provipanda", "OD Solutions", "Zellgut" usw. ab)
const PROJEKT_KEYS = [
  "investmentpunk", "invesmentpunk", "investmenpunk",
  "provipanda",
  "smlsolution",
  "closeconsulting",
  "odsolution",
  "zellgut",
];

export type DashboardMode = "hh" | "projekte";

export const DASHBOARD_MODE: DashboardMode =
  process.env.NEXT_PUBLIC_DASHBOARD_MODE === "projekte" ? "projekte" : "hh";

export const IS_PROJEKTE = DASHBOARD_MODE === "projekte";

const HIDE_PROJEKTE_IN_HH = process.env.NEXT_PUBLIC_HIDE_PROJEKTE === "1";

export const DASHBOARD_TITLE =
  process.env.NEXT_PUBLIC_DASHBOARD_TITLE || (IS_PROJEKTE ? "PROJEKTE" : "HH SCG");

function norm(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
}

// Partner, die nur im Peak-Dashboard erscheinen sollen (werden im HH-Dashboard
// zusätzlich zu den 6 Projekten ausgeblendet, wenn NEXT_PUBLIC_HIDE_PROJEKTE=1)
const PEAK_ONLY_KEYS = ["taxangels", "peak", "khph", "carefree"];

function isPeakOnlyPartner(name: string): boolean {
  const n = norm(name || "");
  if (!n) return false;
  return isProjektPartner(name) || PEAK_ONLY_KEYS.some(k => n.startsWith(k));
}

export function isProjektPartner(name: string): boolean {
  const n = norm(name || "");
  if (!n) return false;
  return PROJEKT_KEYS.some(k => n.startsWith(k));
}

/** Darf dieser Partner im aktuellen Dashboard angezeigt werden? */
// Projekte-Dashboard: NEXT_PUBLIC_SHOW_ALL_PARTNERS=1 zeigt alle Partner aus dem eigenen Sheet
const SHOW_ALL_PARTNERS = process.env.NEXT_PUBLIC_SHOW_ALL_PARTNERS === "1";

export function partnerAllowed(name: string): boolean {
  if (IS_PROJEKTE) return SHOW_ALL_PARTNERS || isProjektPartner(name);
  if (HIDE_PROJEKTE_IN_HH) return !isPeakOnlyPartner(name);
  return true;
}

/** Server-seitig: Partner-Filter auf ein Sales-CSV anwenden (Kopfzeilen bleiben erhalten). */
export function filterSalesCsv(text: string): string {
  if (IS_PROJEKTE ? SHOW_ALL_PARTNERS : !HIDE_PROJEKTE_IN_HH) return text;
  const lines = text.split("\n");
  let headerIdx = -1;
  let partnerCol = -1;
  let sep = ",";
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const s = lines[i].includes("\t") ? "\t" : lines[i].includes(";") ? ";" : ",";
    const cols = splitCsvLine(lines[i], s).map(c => c.toLowerCase());
    const pi = cols.findIndex(c => c === "partner");
    if (pi !== -1 && cols.some(c => c === "date" || c === "datum")) {
      headerIdx = i; partnerCol = pi; sep = s; break;
    }
  }
  // Kein Header gefunden: alte Spaltenlogik (Partner in Spalte 0)
  if (headerIdx === -1) { partnerCol = 0; }
  return lines
    .filter((line, i) => {
      if (i <= headerIdx) return true;
      if (!line.trim()) return false;
      const cols = splitCsvLine(line, sep);
      const partner = (cols[partnerCol] || "").trim();
      if (!partner) return headerIdx === -1; // Vorspann-Zeilen ohne Header behalten
      return partnerAllowed(partner);
    })
    .join("\n");
}

function splitCsvLine(line: string, sep: string): string[] {
  if (sep !== ",") return line.split(sep).map(c => c.replace(/^"|"$/g, "").trim());
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
    } else if (ch === "," && !q) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}
