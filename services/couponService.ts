import { api } from "@/lib/api";
import type { Coupon, CouponFormData, CouponListParams } from "@/types/coupon";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getCoupons(
  params?: CouponListParams
): Promise<PaginatedResponse<Coupon>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<Coupon>>(`/admin/coupons${query}`, {
    method: "GET",
  });
}

export async function getCoupon(id: number): Promise<ApiResponse<Coupon>> {
  return api<ApiResponse<Coupon>>(`/admin/coupons/${id}`, {
    method: "GET",
  });
}

export async function createCoupon(
  data: CouponFormData
): Promise<ApiResponse<Coupon>> {
  return api<ApiResponse<Coupon>>("/admin/coupons", {
    method: "POST",
    body: data,
  });
}

export async function updateCoupon(
  id: number,
  data: CouponFormData
): Promise<ApiResponse<Coupon>> {
  return api<ApiResponse<Coupon>>(`/admin/coupons/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteCoupon(id: number): Promise<void> {
  return api<void>(`/admin/coupons/${id}`, {
    method: "DELETE",
  });
}

export async function toggleCouponStatus(
  id: number
): Promise<ApiResponse<Coupon>> {
  return api<ApiResponse<Coupon>>(`/admin/coupons/${id}/status`, {
    method: "PATCH",
  });
}
