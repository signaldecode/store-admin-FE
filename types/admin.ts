import type { AdminRole } from "@/lib/constants";

export interface Admin {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AdminFormData {
  email: string;
  name: string;
  password?: string;
  role: AdminRole;
}

export interface AdminUpdateData {
  name: string;
  role: AdminRole;
}
