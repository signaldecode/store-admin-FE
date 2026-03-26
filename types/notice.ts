import type { PaginationParams } from "./api";
import type { NoticeType, NoticeStatus } from "@/lib/constants";

export interface Notice {
  id: number;
  type: NoticeType;
  title: string;
  content: string;
  isPinned: boolean;
  status: NoticeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeFormData {
  type: NoticeType;
  title: string;
  content: string;
  isPinned: boolean;
  status: NoticeStatus;
}

export interface NoticeListParams extends PaginationParams {
  type?: NoticeType;
  keyword?: string;
}
