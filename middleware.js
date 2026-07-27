import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "./app/lib/auth";

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // 서버 컴포넌트(레이아웃)가 현재 경로를 알 수 있도록 헤더로 전달 — 준비중 게이트의 /admin 예외 처리에 사용
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-qs", search || "");
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } });

  // 로그인 API는 항상 통과(로그인 시도 자체를 막으면 안 됨)
  if (pathname === "/api/admin/login") return pass();

  const authed = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);

  // 관리 API 보호
  if (pathname.startsWith("/api/admin")) {
    if (!authed) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return pass();
  }

  // 관리 페이지 보호
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return authed ? NextResponse.redirect(new URL("/admin", req.url)) : pass();
    }
    if (!authed) return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return pass();
}

export const config = {
  // 정적 자산(_next·이미지 등)을 제외한 모든 경로에서 실행 — 공개 페이지에도 x-pathname 헤더를 심는다
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|gif|txt|xml)$).*)",
  ],
};
