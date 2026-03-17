import { api } from "@/lib/api";
import type { Category, CategoryFormData, CategoryUpdateNode } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export function getCategories() {
  return api<ApiResponse<Category[]>>("/admin/categories");
}

export function getCategory(id: number) {
  return api<ApiResponse<Category>>(`/categories/${id}`);
}

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
