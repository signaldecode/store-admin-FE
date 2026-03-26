import type { PaginationParams } from "./api";
import type { CouponDiscountType } from "@/lib/constants";

export interface Promotion {
  id: number;
  tenantId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  applicableCategories: string | null;
  roundingType: string;
  isActive: boolean;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
}

export interface PromotionFormData {
  tenantId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  applicableCategories?: string;
  roundingType: string;
  isActive: boolean;
  startedAt: string;
  endedAt?: string;
}

export interface PromotionListParams extends PaginationParams {
  tenantId?: number;
  isActive?: boolean;
  keyword?: string;
}
