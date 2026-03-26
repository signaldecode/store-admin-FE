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

export async function getBanners(params?: BannerListParams) {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Banner>>(`/admin/banners${query}`);
}

export async function getBanner(id: number) {
  return api<ApiResponse<Banner>>(`/admin/banners/${id}`);
}

/** 배너 등록 (Multipart: data JSON + image 파일 필수) */
export async function createBanner(data: BannerFormData, image: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  formData.append("image", image);
  return api<ApiResponse<void>>("/admin/banners", {
    method: "POST",
    body: formData,
  });
}

/** 배너 수정 (Multipart: data JSON + image 파일 선택) */
export async function updateBanner(data: BannerFormData, id: number, image?: File) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (image) formData.append("image", image);
  return api<ApiResponse<void>>(`/admin/banners/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteBanner(id: number) {
  return api<void>(`/admin/banners/${id}`, { method: "DELETE" });
}
