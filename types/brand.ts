import type { PaginationParams } from "./api";

export interface Brand {
  id: number;
  name: string;
  description: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ActiveBrand {
  id: number;
  name: string;
}

export interface BrandFormData {
  name: string;
  description: string;
}

export interface BrandListParams extends PaginationParams {}