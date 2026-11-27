import { filterSalesCsv } from "../../dashboard-config";

// Standard: HH SCG Sales-Sheet. Für ein anderes Google Drive in Vercel
// die Umgebungsvariable SALES_SHEET_CSV_URL setzen (CSV-Link aus "Im Web veröffentlichen").
const DEFAULT_SALES_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvEtbNxKBc_D9vdTtiglhv8rTmraXiH6nLr9dTLrQQjyQCG2SEkVXsUdganxtjmdRniRamAJx_e1Ek/pub?output=csv&gid=0";

export async function GET() {
  const url = process.env.SALES_SHEET_CSV_URL || DEFAULT_SALES_SHEET_URL;
  const res = await fetch(url, { cache: "no-store" });
  let text = await res.text();
  // Normalize line endings
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  // Nur die Partner ausliefern, die zu diesem Dashboard gehören
  text = filterSalesCsv(text);
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
