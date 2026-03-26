import type { PaginationParams } from "./api";
import type { BannerPosition, BannerStatus } from "@/lib/constants";

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

export interface BannerFormData {
  tenantId: number;
  title: string;
  position: BannerPosition;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
  status: BannerStatus;
  startedAt: string;
  endedAt?: string;
  noEndDate: boolean;
}

export interface BannerListParams extends PaginationParams {
  tenantId?: number;
  status?: BannerStatus;
  keyword?: string;
}
