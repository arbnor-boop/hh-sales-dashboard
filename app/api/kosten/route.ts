import { IS_PROJEKTE } from "../../dashboard-config";

// Peak-Dashboard: Projekte & Mitarbeiterkosten aus dem Peak-Google-Sheet.
// In Vercel setzen: PEAK_PROJEKTE_CSV_URL und PEAK_MITARBEITER_CSV_URL
// (CSV-Links aus "Datei → Freigeben → Im Web veröffentlichen").
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const typ = new URL(req.url).searchParams.get("typ");
  const url = !IS_PROJEKTE
    ? ""
    : typ === "projekte"
      ? process.env.PEAK_PROJEKTE_CSV_URL
      : typ === "mitarbeiter"
        ? process.env.PEAK_MITARBEITER_CSV_URL
        : "";
  if (!url) return new Response("", { status: 404 });
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return new Response("", { status: 502 });
    const text = (await res.text()).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    return new Response(text, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch {
    return new Response("", { status: 500 });
  }
}
