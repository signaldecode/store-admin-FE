import { api } from "@/lib/api";
import type { Notice, NoticeFormData, NoticeListParams } from "@/types/notice";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getNotices(
  params?: NoticeListParams
): Promise<PaginatedResponse<Notice>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Notice>>(`/admin/notices${query}`, {
    method: "GET",
  });
}

export async function getNotice(id: number): Promise<ApiResponse<Notice>> {
  return api<ApiResponse<Notice>>(`/admin/notices/${id}`, {
    method: "GET",
  });
}

export async function createNotice(
  data: NoticeFormData
): Promise<ApiResponse<Notice>> {
  return api<ApiResponse<Notice>>("/admin/notices", {
    method: "POST",
    body: data,
  });
}

export async function updateNotice(
  id: number,
  data: NoticeFormData
): Promise<ApiResponse<Notice>> {
  return api<ApiResponse<Notice>>(`/admin/notices/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteNotice(id: number): Promise<void> {
  return api<void>(`/admin/notices/${id}`, {
    method: "DELETE",
  });
}

export async function toggleNoticeStatus(
  id: number
): Promise<ApiResponse<Notice>> {
  return api<ApiResponse<Notice>>(`/admin/notices/${id}/status`, {
    method: "PATCH",
  });
}

export async function toggleNoticePin(
  id: number
): Promise<ApiResponse<Notice>> {
  return api<ApiResponse<Notice>>(`/admin/notices/${id}/pin`, {
    method: "PATCH",
  });
}
