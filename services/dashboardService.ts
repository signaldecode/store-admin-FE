import type { DashboardData } from "@/types/dashboard";
import type { ApiResponse } from "@/types/api";

// ─── Mock Data (실제 API: GET /api/v1/admin/dashboard) ───
const MOCK_DASHBOARD: DashboardData = {
  orderStatus: {
    pending: 8,
    paid: 12,
    preparing: 5,
    shipping: 15,
    delivered: 42,
  },
  sales: {
    todaySales: 1580000,
    monthlySales: 42350000,
  },
  claims: {
    requestedCount: 4,
    inProgressCount: 3,
  },
  recentOrders: [
    { orderId: 1, orderNumber: "ORD-2026000001", status: "PAID", totalAmount: 89000 },
    { orderId: 2, orderNumber: "ORD-2026000002", status: "SHIPPING", totalAmount: 156000 },
    { orderId: 3, orderNumber: "ORD-2026000003", status: "PREPARING", totalAmount: 45000 },
    { orderId: 4, orderNumber: "ORD-2026000004", status: "PENDING", totalAmount: 230000 },
    { orderId: 5, orderNumber: "ORD-2026000005", status: "DELIVERED", totalAmount: 67000 },
  ],
};

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * 대시보드 데이터 조회
 * 실제 API: GET /api/v1/admin/dashboard
 */
export async function getDashboard(): Promise<ApiResponse<DashboardData>> {
  await delay();
  return { success: true, data: MOCK_DASHBOARD };
}
