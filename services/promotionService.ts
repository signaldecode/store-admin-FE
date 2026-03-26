import { api } from "@/lib/api";
import type {
  Promotion,
  PromotionFormData,
  PromotionListParams,
} from "@/types/promotion";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getPromotions(
  params?: PromotionListParams
): Promise<PaginatedResponse<Promotion>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Promotion>>(`/admin/promotions${query}`, {
    method: "GET",
  });
}

export async function getPromotion(
  id: number
): Promise<ApiResponse<Promotion>> {
  return api<ApiResponse<Promotion>>(`/admin/promotions/${id}`, {
    method: "GET",
  });
}

export async function createPromotion(
  data: PromotionFormData
): Promise<ApiResponse<Promotion>> {
  return api<ApiResponse<Promotion>>("/admin/promotions", {
    method: "POST",
    body: data,
  });
}

export async function updatePromotion(
  id: number,
  data: PromotionFormData
): Promise<ApiResponse<Promotion>> {
  return api<ApiResponse<Promotion>>(`/admin/promotions/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deletePromotion(id: number): Promise<void> {
  return api<void>(`/admin/promotions/${id}`, {
    method: "DELETE",
  });
}
