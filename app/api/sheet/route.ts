export async function GET() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvEtbNxKBc_D9vdTtiglhv8rTmraXiH6nLr9dTLrQQjyQCG2SEkVXsUdganxtjmdRniRamAJx_e1Ek/pub?output=csv";
  const res = await fetch(url, { cache: "no-store" });
  let text = await res.text();
  // Normalize line endings
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
