import type { PaginationParams } from "./api";
import type { InquiryStatus } from "@/lib/constants";

/** 백엔드 QnaResponse 기준 (inquiry는 QnA 엔드포인트 사용) */
export interface Inquiry {
  id: number;
  tenantId: number;
  userId: number;
  qnaType: string;
  productId: number | null;
  title: string;
  question: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isSecret: boolean;
  isAnswered: boolean;
  answer: string | null;
  answeredAt: string | null;
  status: InquiryStatus;
  isVisible: boolean;
  createdAt: string;
}

/** 백엔드 QnaListResponse 기준 */
export interface InquirySummary {
  id: number;
  tenantId: number;
  qnaType: string;
  title: string;
  isSecret: boolean;
  isAnswered: boolean;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryListParams extends PaginationParams {
  tenantId?: number;
  status?: InquiryStatus;
}
