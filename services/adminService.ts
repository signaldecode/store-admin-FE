import { api } from "@/lib/api";
import type { Admin, AdminFormData, AdminUpdateData } from "@/types/admin";
import type { ApiResponse } from "@/types/api";

export function getAdmins() {
  return api<ApiResponse<Admin[]>>("/admins");
}

export function createAdmin(data: AdminFormData) {
  return api<ApiResponse<Admin>>("/admins", {
    method: "POST",
    body: data,
  });
}

export function updateAdmin(id: number, data: AdminUpdateData) {
  return api<ApiResponse<Admin>>(`/admins/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deactivateAdmin(id: number) {
  return api<void>(`/admins/${id}`, { method: "DELETE" });
}
