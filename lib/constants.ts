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

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  SALE: "판매중",
  SOLDOUT: "품절",
  HIDDEN: "숨김",
};

/** 옵션 타입 */
export const OPTION_TYPE = {
  FIXED: "FIXED",
  FREE: "FREE",
} as const;

export type OptionType = (typeof OPTION_TYPE)[keyof typeof OPTION_TYPE];

export const OPTION_TYPE_LABEL: Record<OptionType, string> = {
  FIXED: "고정 옵션",
  FREE: "자유 입력",
};

/** 관리자 역할 */
export const ADMIN_ROLE = {
  SUPER: "SUPER",
  MANAGER: "MANAGER",
} as const;

export type AdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  SUPER: "슈퍼 관리자",
  MANAGER: "매니저",
};

/** 페이지네이션 기본값 */
export const DEFAULT_PAGE_SIZE = 20;
