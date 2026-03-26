import { api } from "@/lib/api";
import type { Category, CategoryFormData, CategoryUpdateNode } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export function getCategories() {
  return api<ApiResponse<Category[]>>("/admin/categories");
}

// TODO: 백엔드 CategoryController에 GET /{id} 엔드포인트 없음 (트리 구조로 전체 조회만 지원)
// export function getCategory(id: number) {
//   return api<ApiResponse<Category>>(`/admin/categories/${id}`);
// }

export function createCategory(data: CategoryFormData) {
  return api<ApiResponse<Category>>("/admin/categories", {
    method: "POST",
    body: data,
  });
}

export function updateCategories(tree: CategoryUpdateNode[]) {
  return api<void>("/admin/categories", {
    method: "PUT",
    body: tree,
  });
}

export function deleteCategories(ids: number[]) {
  return api<void>("/admin/categories", {
    method: "DELETE",
    body: { ids },
  });
}
