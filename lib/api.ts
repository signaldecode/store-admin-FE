import { API_BASE_URL } from "./constants";
import type { ApiError } from "@/types/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * fetch 래퍼
 * - credentials: include (HttpOnly Cookie 자동 전송)
 * - 공통 에러 처리: 에러 → ApiError throw
 * - 401 리다이렉트는 middleware + useAuth에서 처리
 */
export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body !== undefined && {
      body: isFormData ? body : JSON.stringify(body),
    }),
    ...rest,
  });

  if (!res.ok) {
    const errorData: ApiError = {
      status: res.status,
      message: "요청 처리 중 오류가 발생했습니다.",
    };

    try {
      const json = await res.json();
      if (json.error) {
        errorData.code = json.error.code;
        errorData.message = json.error.message || errorData.message;
      } else {
        errorData.message = json.message || errorData.message;
      }
      errorData.errors = json.errors;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw errorData;
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
