import type { PaginationParams } from "./api";
import type { CouponStatus, CouponDiscountType, CouponType, CouponValidityType } from "@/lib/constants";

export interface Coupon {
  id: number;
  name: string;
  description: string;
  couponType: CouponType;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  totalQuantity: number;
  issuedCount: number;
  validityType: CouponValidityType;
  validityDays: number | null;
  validFrom: string;
  validTo: string;
  allowPromotionOverlap: boolean;
  allowDuplicateUse: boolean;
  notice: string;
  status: CouponStatus;
  createdAt: string;
}

export interface CouponFormData {
  name: string;
  description: string;
  couponType: CouponType;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
  totalQuantity: number;
  validityType: CouponValidityType;
  validityDays?: number;
  validFrom: string;
  validTo: string;
  allowPromotionOverlap: boolean;
  allowDuplicateUse: boolean;
  notice: string;
}

export interface CouponListParams extends PaginationParams {
  status?: CouponStatus;
  keyword?: string;
}
