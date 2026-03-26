import type { RefundRequest, RefundResponse } from "@/types/refund";
import type { ApiResponse } from "@/types/api";

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function createRefund(
  data: RefundRequest,
): Promise<ApiResponse<RefundResponse>> {
  await delay();
  const refund: RefundResponse = {
    id: Date.now(),
    orderId: data.orderId,
    amount: data.amount,
    reason: data.reason,
    status: "REFUNDED",
    createdAt: new Date().toISOString(),
  };
  return { success: true, data: refund };
}
