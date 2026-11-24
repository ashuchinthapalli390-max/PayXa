import { NextResponse } from "next/server";
import { merchantApp } from "@/lib/merchant-app";

/** Stable download link (payxa.in/download/android) → the latest signed APK. */
export function GET() {
  return NextResponse.redirect(merchantApp.url, {
    status: 302,
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
