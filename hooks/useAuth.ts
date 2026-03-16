"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { getMe } from "@/services/authService";
import type { Admin } from "@/types/admin";

const IS_DEV = process.env.NODE_ENV === "development";

/** 개발용 더미 관리자 */
const DEV_ADMIN: Admin = {
  id: 1,
  email: "dev@admin.com",
  name: "이드니형",
  role: "SUPER",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * 인증 가드 훅
 * - 개발 모드: 항상 로그인 상태 유지 (API 호출 없음)
 * - 프로덕션: /api/auth/me 호출로 인증 확인, 미인증 시 /login 리다이렉트
 */
export function useAuth() {
  const router = useRouter();
  const { admin, isAuthenticated, setAdmin, clearAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) return;

    // 개발 모드: 더미 관리자로 즉시 인증
    if (IS_DEV) {
      setAdmin(DEV_ADMIN);
      setIsLoading(false);
      return;
    }

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
