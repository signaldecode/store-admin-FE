import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL || "http://localhost:8080";

async function proxyRequest(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const targetPath = pathname.replace(/^\/api/, "");
  const url = `${API_URL}/api${targetPath}${search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("origin");

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-expect-error -- Node fetch supports duplex for streaming body
    duplex: "half",
  });

  const responseHeaders = new Headers(res.headers);
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
