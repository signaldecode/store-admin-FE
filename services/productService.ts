import { api } from "@/lib/api";
import type { Product, ProductListParams } from "@/types/product";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getProducts(params?: ProductListParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Product>>(`/products${query}`);
}

export function getProduct(id: number) {
  return api<ApiResponse<Product>>(`/products/${id}`);
}

export function createProduct(data: FormData) {
  return api<ApiResponse<Product>>("/products", {
    method: "POST",
    body: data,
  });
}

export function updateProduct(id: number, data: FormData) {
  return api<ApiResponse<Product>>(`/products/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteProduct(id: number) {
  return api<void>(`/products/${id}`, { method: "DELETE" });
}
