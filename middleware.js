import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "./app/lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 로그인 API는 항상 통과(로그인 시도 자체를 막으면 안 됨)
  if (pathname === "/api/admin/login") return NextResponse.next();

  const authed = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);

  // 관리 API 보호
  if (pathname.startsWith("/api/admin")) {
    if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  // 관리 페이지 보호
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return authed ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
    }
    if (!authed) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
