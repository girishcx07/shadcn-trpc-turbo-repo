import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("session"); // read session cookie
  const isLoggedIn = !!cookie?.value; // simple check — you can do server validation here

  const path = req.nextUrl.pathname;

  // ✅ If user is NOT logged in and trying to access protected route
  if (!isLoggedIn && path.startsWith("/react-query-example")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ If user IS logged in and visits `/`, redirect to dashboard
  if (isLoggedIn && path === "/") {
    return NextResponse.redirect(new URL("/react-query-example", req.url));
  }

  // Otherwise continue as normal
  return NextResponse.next();
}

// Limit middleware to specific paths (optional)
export const config = {
  matcher: [
    "/", // home
    "/react-query-example", // your protected page
  ],
};
