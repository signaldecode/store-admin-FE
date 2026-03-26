import type { PaginationParams } from "./api";
import type { OrderStatus } from "@/lib/constants";

/** 백엔드 OrderListResponse 기준 */
export interface OrderSummary {
  id: number;
  orderNumber: string;
  tenantId: number;
  userId: number;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string;
}

/** 백엔드 OrderResponse 기준 */
export interface Order {
  id: number;
  tenantId: number;
  orderNumber: string;
  userId: number;
  guestEmail: string | null;
  guestPhone: string | null;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  currency: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string | null;
  billingAddress: string | null;
  shippingAddress: string | null;
  depositorName: string | null;
  customerNote: string | null;
  adminNote: string | null;
  orderChannel: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  statusHistory: OrderStatusHistory[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  skuCode: string | null;
  optionSummary: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl: string | null;
}

export interface OrderStatusHistory {
  id: number;
  status: string;
  reason: string | null;
  createdAt: string;
}

export interface OrderListParams extends PaginationParams {
  tenantId?: number;
  status?: OrderStatus;
  orderNumber?: string;
}
