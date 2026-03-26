import type { PaginationParams } from "./api";

export interface FaqCategory {
  id: number;
  name: string;
}

export interface Faq {
  id: number;
  categoryId: number;
  categoryName: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqFormData {
  categoryId: number;
  question: string;
  answer: string;
}

export interface FaqListParams extends PaginationParams {
  categoryId?: number;
  keyword?: string;
}
