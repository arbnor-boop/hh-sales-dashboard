import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYYsY8LCNoYUVl-Hi4yPb_w7vVrx-AuhNh0wcVuxKeevlndP7ldyzwGO6t8ckisPVoDWMVhnSyGlXv/pub?output=csv";
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/csv; charset=utf-8" },
    });
  } catch {
    return new NextResponse("error", { status: 500 });
  }
}
