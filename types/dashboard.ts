/** 백엔드 DashboardResponse 기준 */
export interface DashboardData {
  /** 주문 상태별 건수 (e.g. { PENDING: 8, PAID: 12, ... }) */
  ordersByStatus: Record<string, number>;
  /** 최근 주문 목록 (최대 5건) */
  recentOrders: DashboardRecentOrder[];
  /** 오늘 매출액 */
  todayRevenue: number;
  /** 이번 달 매출액 */
  monthlyRevenue: number;
  /** 클레임 상태별 건수 (e.g. { REQUESTED: 4, IN_PROGRESS: 3 }) */
  claimsByStatus: Record<string, number>;
}

export interface DashboardRecentOrder {
  id: number;
  orderNumber: string;
  grandTotal: number;
  status: string;
  createdAt: string;
}
