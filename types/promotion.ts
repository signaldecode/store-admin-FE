import type { PaginationParams } from "./api";
import type { CouponDiscountType } from "@/lib/constants";

export interface Promotion {
  id: number;
  name: string;
  isActive: boolean;
  discountType: CouponDiscountType;
  discountValue: number;
  applicableCategories: number[];
  startedAt: string;
  endedAt: string;
  createdAt: string;
}

export interface PromotionFormData {
  name: string;
  isActive: boolean;
  discountType: CouponDiscountType;
  discountValue: number;
  applicableCategories: number[];
  startedAt: string;
  endedAt: string;
}

export interface PromotionListParams extends PaginationParams {
  isActive?: boolean;
  keyword?: string;
}
