import { API_BASE_URL } from "./constants";
import { getApiBaseUrl } from "./apiConfig";
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

/**
 * 도메인별 API 클라이언트 생성
 *
 * 두 백엔드가 공존하는 과도기에 도메인별로 다른 base URL을 사용할 수 있다.
 * 통합 API가 완성되면 환경변수 NEXT_PUBLIC_API_UNIFIED_URL 하나로 전환.
 *
 * @example
 * // services/orderService.ts
 * import { createApiClient } from "@/lib/api";
 * const api = createApiClient("orders");
 * export const getOrders = () => api<PaginatedResponse<Order>>("/admin/orders");
 */
export function createApiClient(domain: string) {
  const baseUrl = getApiBaseUrl(domain);

  return async function domainApi<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, headers, ...rest } = options;
    const isFormData = body instanceof FormData;

    const res = await fetch(`${baseUrl}${endpoint}`, {
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

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json();
  };
}
