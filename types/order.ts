import type { PaginationParams } from "./api";
import type { OrderStatus } from "@/lib/constants";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  thumbnailUrl: string | null;
  optionSummary: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  memo: string;
}

export interface Payment {
  method: string;
  amount: number;
  paidAt: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: Payment;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  itemSummary: string;
  itemCount: number;
  totalAmount: number;
  createdAt: string;
}

export interface OrderListParams extends PaginationParams {
  status?: OrderStatus;
  keyword?: string;
  searchType?: "orderNumber" | "customerName";
}
