import type { PaginationParams } from "./api";

/** 백엔드 FaqCategoryResponse 기준 */
export interface FaqCategory {
  id: number;
  tenantId: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

/** 백엔드 FaqResponse 기준 — categoryName은 백엔드에 없음 */
export interface Faq {
  id: number;
  tenantId: number;
  categoryId: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqFormData {
  tenantId: number;
  categoryId: number;
  question: string;
  answer: string;
}

export interface FaqListParams extends PaginationParams {
  tenantId?: number;
  categoryId?: number;
  keyword?: string;
}
