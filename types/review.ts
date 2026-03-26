import type { PaginationParams } from "./api";

/** 백엔드 ReviewResponse 기준 */
export interface Review {
  id: number;
  tenantId: number;
  productId: number;
  userId: number;
  rating: number;
  title: string | null;
  content: string | null;
  images: string | null;
  isVerifiedPurchase: boolean;
  isVisible: boolean;
  isBest: boolean;
  helpfulCount: number;
  adminReply: string | null;
  adminRepliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListParams extends PaginationParams {
  tenantId?: number;
}
