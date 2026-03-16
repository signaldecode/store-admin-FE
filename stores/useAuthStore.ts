"use client";

import { create } from "zustand";
import type { Admin } from "@/types/admin";

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  setAdmin: (admin: Admin) => void;
  clearAdmin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  setAdmin: (admin) => set({ admin, isAuthenticated: true }),
  clearAdmin: () => set({ admin: null, isAuthenticated: false }),
}));
