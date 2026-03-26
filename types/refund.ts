export interface RefundRequest {
  orderId: number;
  amount: number;
  reason: string;
}

export interface RefundResponse {
  id: number;
  orderId: number;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}
