import { api } from "@/lib/api";
import type { Product, ProductSummary, ProductListParams, ProductFormData } from "@/types/product";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getProducts(params?: ProductListParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<ProductSummary>>(`/products${query}`);
}

export function getProduct(id: number) {
  return api<ApiResponse<Product>>(`/products/${id}`);
}

/**
 * 상품 등록 (multipart/form-data)
 * - data: JSON 문자열 (ProductFormData) — description에 에디터 HTML 포함
 * - thumbnail: 썸네일 이미지 (optional)
 */
export function createProduct(data: ProductFormData, thumbnail?: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnail) formData.append("thumbnail", thumbnail);
  return api<ApiResponse<Product>>("/products", {
    method: "POST",
    body: formData,
  });
}

export function updateProduct(id: number, data: ProductFormData, thumbnail?: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (thumbnail) formData.append("thumbnail", thumbnail);
  return api<ApiResponse<Product>>(`/products/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteProduct(id: number) {
  return api<void>(`/products/${id}`, { method: "DELETE" });
}
