"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMe } from "@/services/authService";

/**
 * 인증 가드 훅
 * - /auth/me 호출로 인증 확인, 미인증 시 /login 리다이렉트
 */
export function useAuth() {
  const router = useRouter();
  const { admin, isAuthenticated, setAdmin, clearAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;

    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await getMe();
        if (!cancelled) {
          setAdmin(res.data);
        }
      } catch {
        if (!cancelled) {
          clearAdmin();
          router.replace("/login");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setAdmin, clearAdmin, router]);

  return { admin, isAuthenticated, isLoading };
}
