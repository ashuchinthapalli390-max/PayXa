import { NextResponse, type NextMiddleware } from "next/server";

/**
 * This site has no dashboard of its own any more. Old /dashboard links go through the
 * role router (/continue), which checks the signed-in person's role and access and then
 * sends them to the right place on dash.payxa.in (or the admin console).
 */
export const middleware: NextMiddleware = (req) => {
  const rest = req.nextUrl.pathname.slice("/dashboard".length);
  const url = new URL("/continue", req.nextUrl.origin);
  if (rest && rest !== "/") url.searchParams.set("next", rest + req.nextUrl.search);
  return NextResponse.redirect(url, 307);
};

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
