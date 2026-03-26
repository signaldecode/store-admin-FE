import { NextRequest, NextResponse } from "next/server";

/**
 * API 프록시 라우트
 *
 * 두 백엔드를 지원:
 *   - /api/v1/admin/products, /api/v1/admin/categories, /api/v1/admin/brands,
 *     /api/v1/admin/sites, /api/v1/admin/admins, /api/v1/admin/images, /api/v1/auth
 *     → STORE 백엔드 (API_URL)
 *
 *   - /api/v1/admin/orders, /api/v1/admin/users, /api/v1/admin/banners,
 *     /api/v1/admin/notices, /api/v1/admin/coupons, /api/v1/admin/promotions,
 *     /api/v1/admin/claims, /api/v1/admin/inquiries, /api/v1/admin/reviews,
 *     /api/v1/admin/faqs, /api/v1/admin/popups, /api/v1/admin/qnas,
 *     /api/v1/admin/tags, /api/v1/admin/policy, /api/v1/admin/tenant,
 *     /api/v1/admin/displays, /api/v1/admin/delivery, /api/v1/admin/refunds
 *     → MALL 백엔드 (API_MALL_URL)
 *
 * 통합 API가 완성되면 API_UNIFIED_URL 하나로 전환하면 된다.
 */

const STORE_URL = process.env.API_URL || "http://localhost:8080";
const MALL_URL = process.env.API_MALL_URL || STORE_URL;
const UNIFIED_URL = process.env.API_UNIFIED_URL;

/** mall 백엔드로 라우팅해야 하는 경로 접두사 */
const MALL_PREFIXES = [
  "/v1/admin/orders",
  "/v1/admin/users",
  "/v1/admin/banners",
  "/v1/admin/notices",
  "/v1/admin/coupons",
  "/v1/admin/promotions",
  "/v1/admin/claims",
  "/v1/admin/inquiries",
  "/v1/admin/reviews",
  "/v1/admin/faqs",
  "/v1/admin/popups",
  "/v1/admin/qnas",
  "/v1/admin/tags",
  "/v1/admin/policy",
  "/v1/admin/tenant",
  "/v1/admin/displays",
  "/v1/admin/delivery",
  "/v1/admin/refunds",
  "/v1/admin/points",
];

function resolveBackendUrl(apiPath: string): string {
  // 통합 URL이 있으면 모든 요청이 여기로
  if (UNIFIED_URL) return UNIFIED_URL;

  // mall 백엔드에 해당하는 경로인지 확인
  if (MALL_PREFIXES.some((prefix) => apiPath.startsWith(prefix))) {
    return MALL_URL;
  }

  return STORE_URL;
}

async function proxyRequest(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const targetPath = pathname.replace(/^\/api/, "");
  const backendUrl = resolveBackendUrl(targetPath);
  const url = `${backendUrl}/api${targetPath}${search}`;

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
