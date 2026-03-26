import { api } from "@/lib/api";
import type { Inquiry, InquirySummary, InquiryListParams } from "@/types/inquiry";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

/**
 * Inquiry service — routes to /admin/qnas backend endpoints.
 * The backend QnA controller handles all inquiry-like features.
 * Function names are preserved to avoid breaking existing pages.
 */

export function getInquiries(params?: InquiryListParams & { tenantId?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<InquirySummary>>(`/admin/qnas${query}`);
}

export function getInquiry(id: number) {
  return api<ApiResponse<Inquiry>>(`/admin/qnas/${id}`);
}

export function answerInquiry(id: number, answer: string) {
  return api<void>(`/admin/qnas/${id}/answer`, {
    method: "PATCH",
    body: { answer },
  });
}

// TODO: 백엔드 QnaController에 DELETE 엔드포인트 없음
// export function deleteInquiry(id: number) {
//   return api<void>(`/admin/qnas/${id}`, { method: "DELETE" });
// }

// TODO: 백엔드 QnaController에 /types 엔드포인트 없음
// export function getInquiryTypes() {
//   return api<ApiResponse<InquiryType[]>>("/admin/qnas/types");
// }
