import type { PaginationParams } from "./api";

export interface Review {
  id: number;
  rating: number;
  content: string;
  images: string[];
  isVisible: boolean;
  userName: string;
  productId: number;
  productName: string;
  createdAt: string;
}

export interface ReviewListParams extends PaginationParams {
  keyword?: string;
  isVisible?: boolean;
}
