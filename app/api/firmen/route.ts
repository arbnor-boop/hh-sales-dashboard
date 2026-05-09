export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gid = searchParams.get("gid") || "0";
  const url = `https://docs.google.com/spreadsheets/d/17HUix4ut6JIOBItOS9p7yJKvKmQMLicltvGARtgWk64/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { cache: "no-store" });
  let text = await res.text();
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
