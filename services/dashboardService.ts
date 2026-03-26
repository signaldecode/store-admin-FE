import { api } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";
import type { ApiResponse } from "@/types/api";

/** 대시보드 데이터 조회 — GET /admin/dashboard */
export async function getDashboard(
  tenantId?: number | null,
): Promise<ApiResponse<DashboardData>> {
  const query = tenantId ? `?tenantId=${tenantId}` : "";
  return api<ApiResponse<DashboardData>>(`/admin/dashboard${query}`);
}
