/**
 * API 백엔드 라우팅 설정
 *
 * 현재 두 서버가 존재:
 *   - store   : 기존 store-admin-FE 백엔드 (상품, 카테고리, 브랜드, 사이트, 관리자, 이미지)
 *   - mall    : shoppingmall_admin 백엔드 (주문, 회원, 배너, 공지, 쿠폰, 프로모션, 클레임, 문의, 리뷰, FAQ, 팝업, QnA, 태그, 정책, 테넌트, 전시)
 *
 * 통합 API가 만들어지면 모든 도메인을 하나의 origin으로 전환하면 된다.
 *
 * ─── 사용 방법 ───
 * 1. 서비스 파일에서 `import { getApiClient } from "@/lib/apiConfig"` 후
 *    `const api = getApiClient("orders")` 처럼 도메인 키를 넘긴다.
 * 2. 환경변수로 백엔드 URL을 지정한다 (.env.local):
 *    - NEXT_PUBLIC_API_STORE_URL : store 백엔드 (default: /api/v1 = 프록시)
 *    - NEXT_PUBLIC_API_MALL_URL  : mall 백엔드 (default: /api/v1 = 프록시)
 *    - NEXT_PUBLIC_API_UNIFIED_URL : 통합 후 단일 URL (설정 시 모든 도메인이 여기로)
 * 3. mock → 실제 API 전환 시, 서비스 파일 내부만 수정하면 된다.
 */

// ─── 백엔드 Origin 정의 ───
export type ApiOrigin = "store" | "mall";

// ─── 도메인 → Origin 매핑 ───
const DOMAIN_ORIGIN_MAP: Record<string, ApiOrigin> = {
  // store 백엔드 (기존)
  auth: "store",
  products: "store",
  categories: "store",
  brands: "store",
  tenants: "store",
  admins: "store",
  images: "store",

  // mall 백엔드 (shoppingmall_admin)
  orders: "mall",
  members: "mall",
  banners: "mall",
  notices: "mall",
  coupons: "mall",
  promotions: "mall",
  claims: "mall",
  inquiries: "mall",
  reviews: "mall",
  faqs: "mall",
  popups: "mall",
  qnas: "mall",
  tags: "mall",
  policy: "mall",
  tenant: "mall",
  displays: "mall",
  delivery: "mall",
  refunds: "mall",
  points: "mall",
};

// ─── Origin → Base URL 해석 ───
function getBaseUrl(origin: ApiOrigin): string {
  // 통합 URL이 설정되면 모든 요청이 여기로
  const unified = process.env.NEXT_PUBLIC_API_UNIFIED_URL;
  if (unified) return unified;

  if (origin === "store") {
    return process.env.NEXT_PUBLIC_API_STORE_URL || "/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_MALL_URL || "/api/v1";
}

/**
 * 도메인 키로 해당 백엔드의 base URL을 가져온다.
 * 서비스 파일에서 `getApiBaseUrl("orders")` → "/api/v1" (또는 환경변수에 따라 다른 URL)
 */
export function getApiBaseUrl(domain: string): string {
  const origin = DOMAIN_ORIGIN_MAP[domain] || "store";
  return getBaseUrl(origin);
}

/**
 * 도메인이 어느 백엔드에 속하는지 반환
 */
export function getApiOrigin(domain: string): ApiOrigin {
  return DOMAIN_ORIGIN_MAP[domain] || "store";
}
