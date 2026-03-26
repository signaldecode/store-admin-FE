import type { PaginationParams } from "./api";
import type { CouponStatus, CouponDiscountType, CouponType, CouponValidityType } from "@/lib/constants";

/** 백엔드 CouponResponse 기준 */
export interface Coupon {
  id: number;
  tenantId: number;
  name: string;
  description: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderAmount: number | null;
  totalQuantity: number | null;
  issuedQuantity: number;
  usedQuantity: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

/** 백엔드 CouponCreateRequest에 맞춘 폼 데이터 */
export interface CouponFormData {
  tenantId: number;
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  totalQuantity: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
  /** 프론트 전용 (백엔드 미지원) */
  couponType?: CouponType;
  validityType?: CouponValidityType;
  validityDays?: number;
  allowPromotionOverlap?: boolean;
  allowDuplicateUse?: boolean;
  notice?: string;
}

export interface CouponListParams extends PaginationParams {
  tenantId?: number;
  keyword?: string;
  isActive?: boolean;
}
