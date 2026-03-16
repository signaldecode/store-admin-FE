/** API 공통 응답 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
}

/** 페이지네이션 요청 파라미터 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/** API 에러 */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
}
