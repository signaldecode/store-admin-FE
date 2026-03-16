import { api } from "@/lib/api";
import type { Category, CategoryFormData } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export function getCategories() {
  return api<ApiResponse<Category[]>>("/categories");
}

export function getCategory(id: number) {
  return api<ApiResponse<Category>>(`/categories/${id}`);
}

export function createCategory(data: CategoryFormData) {
  return api<ApiResponse<Category>>("/categories", {
    method: "POST",
    body: data,
  });
}

export function updateCategory(id: number, data: CategoryFormData) {
  return api<ApiResponse<Category>>(`/categories/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteCategory(id: number) {
  return api<void>(`/categories/${id}`, { method: "DELETE" });
}

export function updateCategoryOrder(orderedIds: number[]) {
  return api<void>("/categories/order", {
    method: "PUT",
    body: { orderedIds },
  });
}
