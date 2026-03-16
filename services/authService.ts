import { api } from "@/lib/api";
import type { Admin, LoginRequest } from "@/types/admin";
import type { ApiResponse } from "@/types/api";

export function login(data: LoginRequest) {
  return api<ApiResponse<Admin>>("/auth/login", {
    method: "POST",
    body: data,
  });
}

export function logout() {
  return api<void>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return api<ApiResponse<Admin>>("/auth/me");
}
