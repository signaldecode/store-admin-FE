import type { PaginationParams } from "./api";
import type { QnaStatus } from "@/lib/constants";

export interface Qna {
  id: number;
  productId: number;
  productName: string;
  title: string;
  content: string;
  isSecret: boolean;
  status: QnaStatus;
  answer: string | null;
  answeredAt: string | null;
  userName: string;
  createdAt: string;
}

export interface QnaSummary {
  id: number;
  productName: string;
  title: string;
  userName: string;
  isSecret: boolean;
  status: QnaStatus;
  createdAt: string;
}

export interface QnaListParams extends PaginationParams {
  productId?: number;
  status?: QnaStatus;
  keyword?: string;
}
