import { IS_PROJEKTE, filterHhSalesCsv } from "../../dashboard-config";

// Peak-Dashboard: HH-Sales-Deals für die Ansicht "Gesamt Peak + HH".
// Liefert das HH-Sales-Sheet so gefiltert, wie es das HH-Dashboard zeigt (ohne Peak-Projekte),
// damit nichts doppelt gezählt wird. Optional in Vercel: HH_SALES_SHEET_CSV_URL.
const DEFAULT_HH_SALES_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvEtbNxKBc_D9vdTtiglhv8rTmraXiH6nLr9dTLrQQjyQCG2SEkVXsUdganxtjmdRniRamAJx_e1Ek/pub?output=csv&gid=0";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!IS_PROJEKTE) return new Response("", { status: 404 });
  const url = process.env.HH_SALES_SHEET_CSV_URL || DEFAULT_HH_SALES_SHEET_URL;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return new Response("", { status: 502 });
    const text = (await res.text()).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    return new Response(filterHhSalesCsv(text), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch {
    return new Response("", { status: 500 });
  }
}
