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

/** 주문 상태 */
export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  PREPARING: "PREPARING",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** 회원 상태 */
export const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  DORMANT: "DORMANT",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type MemberStatus = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

/** 클레임 타입 (API: CANCEL, RETURN, EXCHANGE) */
export const CLAIM_TYPE = {
  CANCEL: "CANCEL",
  RETURN: "RETURN",
  EXCHANGE: "EXCHANGE",
} as const;

export type ClaimType = (typeof CLAIM_TYPE)[keyof typeof CLAIM_TYPE];

/** 클레임 상태 (API: REQUESTED, APPROVED, IN_PROGRESS, COMPLETED, REJECTED) */
export const CLAIM_STATUS = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
} as const;

export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

/** 문의 상태 */
export const INQUIRY_STATUS = {
  WAITING: "WAITING",
  ANSWERED: "ANSWERED",
} as const;

export type InquiryStatus = (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

/** 배너 위치 (API: HERO, SLIDE, HALF, FULL) */
export const BANNER_POSITION = {
  HERO: "HERO",
  SLIDE: "SLIDE",
  HALF: "HALF",
  FULL: "FULL",
} as const;

export type BannerPosition = (typeof BANNER_POSITION)[keyof typeof BANNER_POSITION];

/** 배너 상태 */
export const BANNER_STATUS = {
  ACTIVE: "ACTIVE",
  SCHEDULED: "SCHEDULED",
  INACTIVE: "INACTIVE",
} as const;

export type BannerStatus = (typeof BANNER_STATUS)[keyof typeof BANNER_STATUS];

/** 공지 유형 (API: NOTICE, INSPECTION, GUIDELINES, EVENT) */
export const NOTICE_TYPE = {
  NOTICE: "NOTICE",
  INSPECTION: "INSPECTION",
  GUIDELINES: "GUIDELINES",
  EVENT: "EVENT",
} as const;

export type NoticeType = (typeof NOTICE_TYPE)[keyof typeof NOTICE_TYPE];

/** 공지 상태 (API: ACTIVE, INACTIVE) */
export const NOTICE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type NoticeStatus = (typeof NOTICE_STATUS)[keyof typeof NOTICE_STATUS];

/** 쿠폰 상태 (API: REGISTERED, ACTIVE, STOPPED, ENDED, RECALLED) */
export const COUPON_STATUS = {
  REGISTERED: "REGISTERED",
  ACTIVE: "ACTIVE",
  STOPPED: "STOPPED",
  ENDED: "ENDED",
  RECALLED: "RECALLED",
} as const;

export type CouponStatus = (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS];

/** 쿠폰 할인 타입 */
export const COUPON_DISCOUNT_TYPE = {
  RATE: "RATE",
  AMOUNT: "AMOUNT",
} as const;

export type CouponDiscountType = (typeof COUPON_DISCOUNT_TYPE)[keyof typeof COUPON_DISCOUNT_TYPE];

/** 쿠폰 유형 */
export const COUPON_TYPE = {
  PRODUCT_DISCOUNT: "PRODUCT_DISCOUNT",
  FREE_SHIPPING: "FREE_SHIPPING",
} as const;

export type CouponType = (typeof COUPON_TYPE)[keyof typeof COUPON_TYPE];

/** 쿠폰 유효기간 타입 */
export const COUPON_VALIDITY_TYPE = {
  DAYS_FROM_DOWNLOAD: "DAYS_FROM_DOWNLOAD",
  FIXED_PERIOD: "FIXED_PERIOD",
} as const;

export type CouponValidityType = (typeof COUPON_VALIDITY_TYPE)[keyof typeof COUPON_VALIDITY_TYPE];

/** 팝업 타입 */
export const POPUP_TYPE = {
  CENTER: "CENTER",
  FLOATING: "FLOATING",
} as const;

export type PopupType = (typeof POPUP_TYPE)[keyof typeof POPUP_TYPE];

/** 팝업 상태 */
export const POPUP_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type PopupStatus = (typeof POPUP_STATUS)[keyof typeof POPUP_STATUS];

/** QnA 상태 */
export const QNA_STATUS = {
  WAITING: "WAITING",
  ANSWERED: "ANSWERED",
} as const;

export type QnaStatus = (typeof QNA_STATUS)[keyof typeof QNA_STATUS];

/** 페이지네이션 기본값 */
export const DEFAULT_PAGE_SIZE = 30;
export const PAGE_SIZE_OPTIONS = [30, 50, 100] as const;
