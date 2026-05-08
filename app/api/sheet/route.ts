export async function GET() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvEtbNxKBc_D9vdTtiglhv8rTmraXiH6nLr9dTLrQQjyQCG2SEkVXsUdganxtjmdRniRamAJx_e1Ek/pub?output=csv";
  const res = await fetch(url, { next: { revalidate: 0 } });
  const text = await res.text();
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
