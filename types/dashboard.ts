export interface DashboardOrderStatus {
  pending: number;
  paid: number;
  preparing: number;
  shipping: number;
  delivered: number;
}

export interface DashboardSales {
  todaySales: number;
  monthlySales: number;
}

export interface DashboardClaims {
  requestedCount: number;
  inProgressCount: number;
}

export interface DashboardRecentOrder {
  orderId: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
}

export interface DashboardData {
  orderStatus: DashboardOrderStatus;
  sales: DashboardSales;
  claims: DashboardClaims;
  recentOrders: DashboardRecentOrder[];
}
