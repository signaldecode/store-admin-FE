import type { PaginationParams } from "./api";
import type { QnaStatus } from "@/lib/constants";

/** 백엔드 QnaResponse 기준 */
export interface Qna {
  id: number;
  tenantId: number;
  userId: number;
  qnaType: string;
  productId: number | null;
  orderId: number | null;
  category: string | null;
  title: string;
  question: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isSecret: boolean;
  isAnswered: boolean;
  answer: string | null;
  answeredBy: number | null;
  answeredAt: string | null;
  status: QnaStatus;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 백엔드 QnaListResponse 기준 */
export interface QnaSummary {
  id: number;
  tenantId: number;
  qnaType: string;
  title: string;
  isSecret: boolean;
  isAnswered: boolean;
  status: QnaStatus;
  createdAt: string;
}

export interface QnaListParams extends PaginationParams {
  tenantId?: number;
  status?: QnaStatus;
}
