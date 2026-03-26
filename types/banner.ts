import type { PaginationParams } from "./api";
import type { BannerPosition, BannerStatus } from "@/lib/constants";

/** 백엔드 BannerResponse 기준 */
export interface Banner {
  id: number;
  tenantId: number;
  title: string;
  position: BannerPosition;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  status: BannerStatus;
  startedAt: string;
  endedAt: string | null;
  noEndDate: boolean;
  createdAt: string;
}

/** 백엔드 BannerCreateRequest/UpdateRequest 기준 (imageUrl 제거 — Multipart로 전송) */
export interface BannerFormData {
  tenantId: number;
  title: string;
  position: BannerPosition;
  linkUrl?: string;
  sortOrder: number;
  status: BannerStatus;
  startedAt?: string;
  endedAt?: string;
  noEndDate: boolean;
}

export interface BannerListParams extends PaginationParams {
  tenantId?: number;
}
