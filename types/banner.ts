import type { PaginationParams } from "./api";
import type { BannerPosition, BannerStatus } from "@/lib/constants";

export interface Banner {
  id: number;
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
  title: string;
  position: BannerPosition;
  linkUrl?: string;
  sortOrder?: number;
  status: BannerStatus;
  startedAt: string;
  endedAt?: string;
  noEndDate: boolean;
}

export interface BannerListParams extends PaginationParams {
  status?: BannerStatus;
  keyword?: string;
}
