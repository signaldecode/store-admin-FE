import { api } from "@/lib/api";
import type { Banner, BannerFormData, BannerListParams } from "@/types/banner";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getBanners(
  params?: BannerListParams
): Promise<PaginatedResponse<Banner>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Banner>>(`/admin/banners${query}`, {
    method: "GET",
  });
}

export async function getBanner(id: number): Promise<ApiResponse<Banner>> {
  return api<ApiResponse<Banner>>(`/admin/banners/${id}`, {
    method: "GET",
  });
}

export async function createBanner(
  data: BannerFormData
): Promise<ApiResponse<Banner>> {
  return api<ApiResponse<Banner>>("/admin/banners", {
    method: "POST",
    body: data,
  });
}

export async function updateBanner(
  id: number,
  data: BannerFormData
): Promise<ApiResponse<Banner>> {
  return api<ApiResponse<Banner>>(`/admin/banners/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteBanner(id: number): Promise<void> {
  return api<void>(`/admin/banners/${id}`, {
    method: "DELETE",
  });
}
