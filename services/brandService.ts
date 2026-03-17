import { api } from "@/lib/api";
import type { Brand, BrandFormData, BrandListParams } from "@/types/brand";
import type { ApiResponse } from "@/types/api";

export function getBrands(params?: BrandListParams) {
  const query = new URLSearchParams();
  if (params?.sort) query.set("sort", params.sort);
  if (params?.order) query.set("order", params.order);
  const qs = query.toString();
  return api<ApiResponse<Brand[]>>(`/brands${qs ? `?${qs}` : ""}`);
}

export function getBrand(id: number) {
  return api<ApiResponse<Brand>>(`/brands/${id}`);
}

export function createBrand(data: BrandFormData) {
  return api<ApiResponse<Brand>>("/brands", {
    method: "POST",
    body: data,
  });
}

export function updateBrand(id: number, data: BrandFormData) {
  return api<ApiResponse<Brand>>(`/brands/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteBrand(id: number) {
  return api<void>(`/brands/${id}`, { method: "DELETE" });
}
