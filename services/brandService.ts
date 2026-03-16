import { api } from "@/lib/api";
import type { Brand, BrandFormData } from "@/types/brand";
import type { ApiResponse } from "@/types/api";

export function getBrands() {
  return api<ApiResponse<Brand[]>>("/brands");
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
