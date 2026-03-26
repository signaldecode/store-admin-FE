import { api } from "@/lib/api";
import type { RefundRequest, RefundResponse } from "@/types/refund";
import type { ApiResponse } from "@/types/api";

/**
 * 환불 생성 — POST /admin/payments/{paymentId}/refunds
 * NOTE: 백엔드는 paymentId 기반이나, 프론트 주문 상세에서는 orderId만 보유.
 *       orderId를 paymentId로 전달 (백엔드에서 orderId↔paymentId 1:1 매핑 전제)
 */
export async function createRefund(
  data: RefundRequest,
): Promise<ApiResponse<RefundResponse>> {
  return api<ApiResponse<RefundResponse>>(
    `/admin/payments/${data.orderId}/refunds`,
    {
      method: "POST",
      body: { amount: data.amount, reason: data.reason },
    },
  );
}
