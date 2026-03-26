import type { PaginationParams } from "./api";
import type { NoticeType, NoticeStatus } from "@/lib/constants";

export interface Notice {
  id: number;
  tenantId: number;
  type: NoticeType;
  title: string;
  content: string;
  isPinned: boolean;
  status: NoticeStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeFormData {
  tenantId: number;
  type: NoticeType;
  title: string;
  content: string;
  isPinned: boolean;
  status: NoticeStatus;
}

export interface NoticeListParams extends PaginationParams {
  tenantId?: number;
  type?: NoticeType;
  keyword?: string;
}
