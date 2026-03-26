import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Site, SiteFormData, SiteListParams, ActiveSite, SiteSettings, SiteSettingsUpdate } from "@/types/site";

/** 사이트 목록 (GET /admin/tenants) */
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

/** 사이트 단건 조회 (GET /admin/tenants/{id}) */
export function getSite(id: number) {
  return api<ApiResponse<Site>>(`/admin/tenants/${id}`);
}

/** 사이트 등록 (POST /admin/tenants) */
export function createSite(data: SiteFormData) {
  return api<ApiResponse<Site>>("/admin/tenants", {
    method: "POST",
    body: data,
  });
}

/** 사이트 기본정보 수정 (PUT /admin/tenants/{id}) — JSON body */
export function updateSite(id: number, data: SiteSettingsUpdate) {
  return api<ApiResponse<void>>(`/admin/tenants/${id}`, {
    method: "PUT",
    body: data,
  });
}

/** 사이트 삭제 (DELETE /admin/tenants/{id}) */
export function deleteSite(id: number) {
  return api<void>(`/admin/tenants/${id}`, { method: "DELETE" });
}

/** 활성 사이트 목록 (GET /admin/tenants/active) */
export function getActiveSites() {
  return api<ApiResponse<ActiveSite[]>>("/admin/tenants/active");
}

/** 사이트 상태 토글 (PATCH /admin/tenants/{id}/status) */
export function toggleSiteStatus(id: number) {
  return api<void>(`/admin/tenants/${id}/status`, { method: "PATCH" });
}

// ─── Settings API (GET/PUT /admin/settings/{tenantId}) ───

/** 테넌트 전체 설정 조회 — 기본정보 + 커스텀 설정 포함 */
export function getSiteSettings(tenantId: number) {
  return api<ApiResponse<SiteSettings>>(`/admin/settings/${tenantId}`);
}

/**
 * 테넌트 전체 설정 저장 (Multipart)
 * - data: JSON 문자열 (TenantUpdateRequest — settings 포함)
 * - logo: 로고 이미지 (선택)
 * - favicon: 파비콘 이미지 (선택)
 */
export function updateSiteSettings(
  tenantId: number,
  data: SiteSettingsUpdate,
  logo?: File,
  favicon?: File,
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  if (logo) formData.append("logo", logo);
  if (favicon) formData.append("favicon", favicon);
  return api<ApiResponse<void>>(`/admin/settings/${tenantId}`, {
    method: "PUT",
    body: formData,
  });
}
