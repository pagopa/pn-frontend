import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    // eslint-disable-next-line functional/immutable-data
    url.pathname = "/cittadini";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
