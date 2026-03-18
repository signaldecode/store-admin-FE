import type { PaginationParams } from "./api";

export interface Site {
  id: number;
  code: string;
  name: string;
  domain: string | null;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface ActiveSite {
  id: number;
  code: string;
  name: string;
}

export interface SiteFormData {
  code: string;
  name: string;
  domain: string;
  description: string;
}

export interface SiteListParams extends PaginationParams {
  keyword?: string;
  isActive?: boolean;
}