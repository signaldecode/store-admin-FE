import type { ProductStatus, OptionType } from "@/lib/constants";
import type { PaginationParams } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  /** 기본 재고 (옵션 없는 단품용) */
  stock: number;
  /** 마진 1 가격 */
  marginPrice1: number | null;
  /** 마진 2 가격 */
  marginPrice2: number | null;
  status: ProductStatus;
  /** 필수: 대분류 */
  mainCategoryId: number;
  mainCategoryName?: string;
  /** 필수: 중분류 */
  subCategoryId: number;
  subCategoryName?: string;
  /** 옵션: 소분류 */
  detailCategoryId: number | null;
  detailCategoryName?: string;
  /** 옵션: 브랜드 */
  brandId: number | null;
  brandName?: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface ProductOption {
  id: number;
  name: string;
  type: OptionType;
  values: string[];
}

export interface ProductVariant {
  id: number;
  optionValues: Record<string, string>;
  sku: string;
  stock: number;
  additionalPrice: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  marginPrice1: number | null;
  marginPrice2: number | null;
  status: ProductStatus;
  mainCategoryId: number | null;
  subCategoryId: number | null;
  detailCategoryId: number | null;
  brandId: number | null;
  images: File[];
  options: Omit<ProductOption, "id">[];
  variants: Omit<ProductVariant, "id">[];
}

export interface ProductListParams extends PaginationParams {
  keyword?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  detailCategoryId?: number;
  brandId?: number;
  status?: ProductStatus;
}
