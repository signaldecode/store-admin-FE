import { api } from "@/lib/api";
import type { Admin, AdminFormData } from "@/types/admin";
import type { ApiResponse } from "@/types/api";

export function getAdmins() {
  return api<ApiResponse<Admin[]>>("/admins");
}

export function getAdmin(id: number) {
  return api<ApiResponse<Admin>>(`/admins/${id}`);
}

export function createAdmin(data: AdminFormData) {
  return api<ApiResponse<Admin>>("/admins", {
    method: "POST",
    body: data,
  });
}

export function updateAdmin(id: number, data: AdminFormData) {
  return api<ApiResponse<Admin>>(`/admins/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteAdmin(id: number) {
  return api<void>(`/admins/${id}`, { method: "DELETE" });
}
