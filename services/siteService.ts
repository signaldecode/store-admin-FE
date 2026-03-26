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
  return api<PaginatedResponse<Site>>(`/admin/tenants${query}`);
}

export function getSite(id: number) {
  return api<ApiResponse<Site>>(`/admin/tenants/${id}`);
}

export function createSite(data: SiteFormData) {
  return api<ApiResponse<Site>>("/admin/tenants", {
    method: "POST",
    body: data,
  });
}

export function updateSite(id: number, data: SiteFormData) {
  return api<ApiResponse<Site>>(`/admin/tenants/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteSite(id: number) {
  return api<void>(`/admin/tenants/${id}`, { method: "DELETE" });
}

export function getActiveSites() {
  return api<ApiResponse<ActiveSite[]>>("/admin/tenants/active");
}

export function toggleSiteStatus(id: number) {
  return api<void>(`/admin/tenants/${id}/status`, {
    method: "PATCH",
  });
}
