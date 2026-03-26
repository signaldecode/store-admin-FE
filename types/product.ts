import type { ProductStatus } from "@/lib/constants";
import type { PaginationParams } from "./api";

export interface Product {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  brandId: number | null;
  brandName: string | null;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  discountPrice: number | null;
  discountStartAt: string | null;
  discountEndAt: string | null;
  marginPrice1: number | null;
  marginPrice2: number | null;
  origin: string | null;
  material: string | null;
  washingInfo: string | null;
  hasOption: boolean;
  status: ProductStatus;
  isVisible: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  options: ProductOption[];
  skus: ProductSku[];
}

export interface ProductImage {
  id: number;
  url: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductOptionValue {
  id: number;
  value: string;
  extraPrice: number;
  sortOrder: number;
}

export interface ProductOption {
  id: number;
  optionName: string;
  sortOrder: number;
  values: ProductOptionValue[];
}

export interface ProductSku {
  id: number;
  skuCode: string;
  stock: number;
  isActive: boolean;
  optionValues: string[];
}

/** 상품 등록/수정 API 요청 JSON (multipart의 data 필드) */
export interface ProductFormData {
  categoryId: number;
  brandId?: number;
  name: string;
  sku?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  discountStartAt?: string;
  discountEndAt?: string;
  marginPrice1?: number;
  marginPrice2?: number;
  origin?: string;
  material?: string;
  washingInfo?: string;
  stock?: number;
  status: ProductStatus;
  isVisible: boolean;
  hasOption: boolean;
  options?: ProductOptionInput[];
  skus?: ProductSkuInput[];
}

export interface ProductOptionInput {
  optionName: string;
  sortOrder: number;
  values: { value: string; extraPrice?: number; sortOrder: number }[];
}

export interface ProductSkuInput {
  skuCode: string;
  stock: number;
  optionValues: string[];
}

/** 상품 목록 조회용 (간소화된 응답) */
export interface ProductSummary {
  id: number;
  thumbnailUrl: string | null;
  name: string;
  price: number;
  discountPrice: number | null;
  status: ProductStatus;
  isVisible: boolean;
  brandName: string | null;
  categoryName: string | null;
  createdAt: string;
}

export interface ProductListParams extends PaginationParams {
  keyword?: string;
  siteId?: number;
  categoryId?: number;
  brandId?: number;
  status?: ProductStatus;
}
