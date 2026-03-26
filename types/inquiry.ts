import type { PaginationParams } from "./api";
import type { InquiryStatus } from "@/lib/constants";

export interface InquiryType {
  id: number;
  name: string;
}

export interface Inquiry {
  id: number;
  type: string;
  title: string;
  content: string;
  status: InquiryStatus;
  answer: string | null;
  answeredAt: string | null;
  userName: string;
  userEmail: string;
  attachments: string[];
  createdAt: string;
}

export interface InquirySummary {
  id: number;
  type: string;
  title: string;
  userName: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryListParams extends PaginationParams {
  status?: InquiryStatus;
  type?: string;
  keyword?: string;
}
