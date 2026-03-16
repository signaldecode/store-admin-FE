import type { ProductStatus, OptionType } from "@/lib/constants";
import type { PaginationParams } from "./api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  categoryId: number;
  categoryName?: string;
  brandId: number;
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
  status: ProductStatus;
  categoryId: number | null;
  brandId: number | null;
  images: File[];
  options: Omit<ProductOption, "id">[];
  variants: Omit<ProductVariant, "id">[];
}

export interface ProductListParams extends PaginationParams {
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  status?: ProductStatus;
}
