import { api } from "@/lib/api";
import type { Faq, FaqCategory, FaqFormData, FaqListParams } from "@/types/faq";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── FAQ API ───

export function getFaqs(params?: FaqListParams & { tenantId?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Faq>>(`/admin/faqs${query}`);
}

export function getFaq(id: number) {
  return api<ApiResponse<Faq>>(`/admin/faqs/${id}`);
}

export function createFaq(data: FaqFormData) {
  return api<ApiResponse<Faq>>("/admin/faqs", {
    method: "POST",
    body: data,
  });
}

export function updateFaq(id: number, data: FaqFormData) {
  return api<void>(`/admin/faqs/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteFaq(id: number) {
  return api<void>(`/admin/faqs/${id}`, { method: "DELETE" });
}

// ─── FAQ Category API ───

export function getFaqCategories(tenantId: number) {
  return api<ApiResponse<FaqCategory[]>>(
    `/admin/faq-categories?tenantId=${tenantId}`
  );
}

export function createFaqCategory(data: { name: string; tenantId: number }) {
  return api<ApiResponse<FaqCategory>>("/admin/faq-categories", {
    method: "POST",
    body: data,
  });
}

export function updateFaqCategory(id: number, data: { name: string }) {
  return api<void>(`/admin/faq-categories/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteFaqCategory(id: number) {
  return api<void>(`/admin/faq-categories/${id}`, { method: "DELETE" });
}
