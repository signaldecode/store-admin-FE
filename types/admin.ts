import type { AdminRole } from "@/lib/constants";

export interface Admin {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
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
