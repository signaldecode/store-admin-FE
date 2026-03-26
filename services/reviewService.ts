import { api } from "@/lib/api";
import type { Review, ReviewListParams } from "@/types/review";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getReviews(
  params?: ReviewListParams
): Promise<PaginatedResponse<Review>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Review>>(`/admin/reviews${query}`, {
    method: "GET",
  });
}

export async function getReview(id: number): Promise<ApiResponse<Review>> {
  return api<ApiResponse<Review>>(`/admin/reviews/${id}`, {
    method: "GET",
  });
}

export async function replyReview(
  id: number,
  data: { adminReply: string }
): Promise<ApiResponse<Review>> {
  return api<ApiResponse<Review>>(`/admin/reviews/${id}/reply`, {
    method: "PATCH",
    body: data,
  });
}

export async function toggleReviewVisibility(
  id: number
): Promise<ApiResponse<Review>> {
  return api<ApiResponse<Review>>(`/admin/reviews/${id}/visibility`, {
    method: "PATCH",
  });
}

export async function toggleReviewBest(
  id: number
): Promise<ApiResponse<Review>> {
  return api<ApiResponse<Review>>(`/admin/reviews/${id}/best`, {
    method: "PATCH",
  });
}
