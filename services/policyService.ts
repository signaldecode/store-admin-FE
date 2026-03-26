import { api } from "@/lib/api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Types ───

/** 백엔드 PolicyResponse 기준 */
export interface Policy {
  id: number;
  tenantId: number;
  policyType: string;
  title: string;
  content: string;
  version: string;
  isRequired: boolean;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyFormData {
  tenantId: number;
  policyType: string;
  title: string;
  content: string;
  version: string;
  isRequired: boolean;
  isActive: boolean;
  publishedAt?: string;
}

export interface PolicyListParams {
  tenantId?: number;
  page?: number;
  size?: number;
}

export interface PolicyAgreement {
  id: number;
  userId: number;
  userName: string;
  agreedAt: string;
}

export interface PolicyAgreementParams {
  page?: number;
  size?: number;
}

// ─── Service functions ───

export function getPolicies(params?: PolicyListParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<Policy>>(`/admin/policies${query}`);
}

export function getPolicy(id: number) {
  return api<ApiResponse<Policy>>(`/admin/policies/${id}`);
}

export function createPolicy(data: PolicyFormData) {
  return api<ApiResponse<Policy>>("/admin/policies", {
    method: "POST",
    body: data,
  });
}

export function updatePolicy(id: number, data: PolicyFormData) {
  return api<void>(`/admin/policies/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deletePolicy(id: number) {
  return api<void>(`/admin/policies/${id}`, { method: "DELETE" });
}

export function getPolicyAgreements(id: number, params?: PolicyAgreementParams) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<PolicyAgreement>>(
    `/admin/policies/${id}/agreements${query}`
  );
}
