import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function localeFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return segment === "en" || segment === "fr" ? segment : "es";
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const carried = request.headers.get("x-mm-locale");
  const fromPath = localeFromPath(pathname);
  const locale = carried === "en" || carried === "fr" || carried === "es" ? carried : fromPath;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-mm-locale", locale);
  requestHeaders.set("x-mm-path", request.headers.get("x-mm-path") || pathname);

  let response: NextResponse;
  if (fromPath === "es" || carried) {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${fromPath}`.length) || "/";
    response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
  response.cookies.set("x-pathname", `${requestHeaders.get("x-mm-path")}${request.nextUrl.search}`, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/data|.*\\..*).*)"],
};
