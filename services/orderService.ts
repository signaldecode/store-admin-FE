import { api } from "@/lib/api";
import type { Order, OrderSummary, OrderListParams } from "@/types/order";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

function buildQuery(params?: Record<string, unknown>): string {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

export async function getOrders(
  params?: OrderListParams
): Promise<PaginatedResponse<OrderSummary>> {
  const query = buildQuery(params as Record<string, unknown>);
  return api<PaginatedResponse<OrderSummary>>(`/admin/orders${query}`, {
    method: "GET",
  });
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
  return api<ApiResponse<Order>>(`/admin/orders/${id}`, {
    method: "GET",
  });
}

export async function updateOrderStatus(
  id: number,
  data: { status: string; reason?: string }
): Promise<ApiResponse<Order>> {
  return api<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: data,
  });
}

export async function updateOrderMemo(
  id: number,
  data: { adminNote?: string }
): Promise<void> {
  return api<void>(`/admin/orders/${id}/memo`, {
    method: "PATCH",
    body: data,
  });
}
