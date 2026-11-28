import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gid = searchParams.get("gid") ?? "0";
  // Firmen-/Marge-Daten. Der Reiter "Marge" ist nur noch im Peak-Dashboard, nutzt aber dasselbe Firmen-Sheet.
  const base = process.env.FIRMEN_SHEET_CSV_URL
    || ("https://docs.google.com/spreadsheets/d/e/2PACX-1vQYYsY8LCNoYUVl-Hi4yPb_w7vVrx-AuhNh0wcVuxKeevlndP7IdyzwGO6t8ckisPVoDWMVhnSyGlXv/pub?output=csv");
  if (!base) return new NextResponse("", { status: 404 });
  const url = base.replace(/([?&])gid=[^&]*/, "$1").replace(/[?&]$/, "") + (base.includes("?") ? "&" : "?") + "gid=" + gid;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Surrogate-Control": "no-store",
      }
    });
  } catch {
    return new NextResponse("error", { status: 500 });
  }
}
