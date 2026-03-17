import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("access_token");

  // 인증 없이 접근 가능한 경로
  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // 미인증 상태에서 보호된 페이지 접근 → /login 리다이렉트
  if (!isPublic && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 인증된 상태에서 /login 접근 → / 리다이렉트
  if (isPublic && hasToken) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon|images|api).*)"],
};
