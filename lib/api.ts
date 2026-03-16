import { API_BASE_URL } from "./constants";
import type { ApiError } from "@/types/api";

const USE_MOCK =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_SKIP_AUTH === "true";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * fetch 래퍼
 * - 개발 모드: mock-api 핸들러 사용 (실제 서버 불필요)
 * - 프로덕션: credentials: include, 공통 에러 처리 (401 → 로그인 리다이렉트)
 */
export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // 개발 모드: Mock API
  if (USE_MOCK) {
    const { mockHandler } = await import("./mock-api");
    const method = options.method || "GET";
    const result = await mockHandler(method, endpoint, options.body);
    return result as T;
  }

  // 프로덕션: 실제 API 호출
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
    if (res.status === 401) {
      window.location.href = "/login";
      throw new Error("인증이 만료되었습니다.");
    }

    const errorData: ApiError = {
      status: res.status,
      message: "요청 처리 중 오류가 발생했습니다.",
    };

    try {
      const json = await res.json();
      errorData.message = json.message || errorData.message;
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
