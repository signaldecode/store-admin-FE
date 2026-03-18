import { api } from "@/lib/api";
import type { ActiveBrand, Brand, BrandFormData, BrandListParams } from "@/types/brand";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getBrands(params?: BrandListParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Brand>>(`/admin/brands${query}`);
}

export function getBrand(id: number) {
  return api<ApiResponse<Brand>>(`/admin/brands/${id}`);
}

export function createBrand(data: BrandFormData, logoImage?: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (logoImage) {
    formData.append("logoImage", logoImage);
  }
  return api<ApiResponse<Brand>>("/admin/brands", {
    method: "POST",
    body: formData,
  });
}

export function updateBrand(id: number, data: BrandFormData, logoImage?: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (logoImage) {
    formData.append("logoImage", logoImage);
  }
  return api<ApiResponse<Brand>>(`/admin/brands/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteBrand(id: number) {
  return api<void>(`/admin/brands/${id}`, { method: "DELETE" });
}

export function getActiveBrands() {
  return api<ApiResponse<ActiveBrand[]>>("/admin/brands/active");
}

export function toggleBrandStatus(id: number) {
  return api<void>(`/admin/brands/${id}/status`, {
    method: "PATCH",
  });
}
