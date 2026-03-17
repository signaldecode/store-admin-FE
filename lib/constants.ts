/** API base URL (프록시 경유 — same-origin) */
export const API_BASE_URL = "/api/v1";

/** 상품 상태 */
export const PRODUCT_STATUS = {
  ON_SALE: "ON_SALE",
  SOLD_OUT: "SOLD_OUT",
  DISCONTINUED: "DISCONTINUED",
  DRAFT: "DRAFT",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

/** 할인 유형 */
export const DISCOUNT_TYPE = {
  NONE: "NONE",
  RATE: "RATE",
  AMOUNT: "AMOUNT",
} as const;

export type DiscountType =
  (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

/** 옵션 타입 */
export const OPTION_TYPE = {
  FIXED: "FIXED",
  FREE: "FREE",
} as const;

export type OptionType = (typeof OPTION_TYPE)[keyof typeof OPTION_TYPE];

/** 관리자 역할 */
export const ADMIN_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
} as const;

export type AdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];

/** 페이지네이션 기본값 */
export const DEFAULT_PAGE_SIZE = 30;
export const PAGE_SIZE_OPTIONS = [30, 50, 100] as const;
