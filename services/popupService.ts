import { api } from "@/lib/api";
import type { Popup, PopupFormData, PopupListParams } from "@/types/popup";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getPopups(params?: PopupListParams & { tenantId?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Popup>>(`/admin/popups${query}`);
}

export function getPopup(id: number) {
  return api<ApiResponse<Popup>>(`/admin/popups/${id}`);
}

export function createPopup(data: PopupFormData) {
  return api<ApiResponse<Popup>>("/admin/popups", {
    method: "POST",
    body: data,
  });
}

export function updatePopup(id: number, data: PopupFormData) {
  return api<void>(`/admin/popups/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deletePopup(id: number) {
  return api<void>(`/admin/popups/${id}`, { method: "DELETE" });
}

export function togglePopupStatus(id: number) {
  return api<void>(`/admin/popups/${id}/status`, {
    method: "PATCH",
  });
}
