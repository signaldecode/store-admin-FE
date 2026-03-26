import { api } from "@/lib/api";
import type { Qna, QnaSummary, QnaListParams } from "@/types/qna";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getQnas(params?: QnaListParams & { tenantId?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<QnaSummary>>(`/admin/qnas${query}`);
}

export function getQna(id: number) {
  return api<ApiResponse<Qna>>(`/admin/qnas/${id}`);
}

export function answerQna(id: number, answer: string) {
  return api<void>(`/admin/qnas/${id}/answer`, {
    method: "PATCH",
    body: { answer },
  });
}

export function toggleQnaVisibility(id: number) {
  return api<void>(`/admin/qnas/${id}/visibility`, {
    method: "PATCH",
  });
}
