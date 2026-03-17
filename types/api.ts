/** API 공통 응답 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    content: T[];
    page: number;
    size: number;
    total_elements: number;
  };
}

/** 페이지네이션 요청 파라미터 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

/** API 에러 */
export interface ApiError {
  status: number;
  code?: string;
  message: string;
  errors?: Record<string, string>;
}
