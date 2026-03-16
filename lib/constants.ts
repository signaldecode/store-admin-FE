/** API base URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/** 상품 상태 */
export const PRODUCT_STATUS = {
  SALE: "SALE",
  SOLDOUT: "SOLDOUT",
  HIDDEN: "HIDDEN",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

/** 옵션 타입 */
export const OPTION_TYPE = {
  FIXED: "FIXED",
  FREE: "FREE",
} as const;

export type OptionType = (typeof OPTION_TYPE)[keyof typeof OPTION_TYPE];

/** 관리자 역할 */
export const ADMIN_ROLE = {
  SUPER: "SUPER",
  MANAGER: "MANAGER",
} as const;

export type AdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];

/** 페이지네이션 기본값 */
export const DEFAULT_PAGE_SIZE = 30;
export const PAGE_SIZE_OPTIONS = [30, 50, 100] as const;
