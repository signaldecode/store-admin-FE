import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Site, SiteFormData, SiteListParams, ActiveSite } from "@/types/site";

export function getSites(params?: SiteListParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Site>>(`/admin/sites${query}`);
}

export function getSite(id: number) {
  return api<ApiResponse<Site>>(`/admin/sites/${id}`);
}

export function createSite(data: SiteFormData) {
  return api<ApiResponse<Site>>("/admin/sites", {
    method: "POST",
    body: data,
  });
}

export function updateSite(id: number, data: SiteFormData) {
  return api<ApiResponse<Site>>(`/admin/sites/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteSite(id: number) {
  return api<void>(`/admin/sites/${id}`, { method: "DELETE" });
}

export function getActiveSites() {
  return api<ApiResponse<ActiveSite[]>>("/admin/sites/active");
}

export function toggleSiteStatus(id: number) {
  return api<void>(`/admin/sites/${id}/status`, {
    method: "PATCH",
  });
}
