"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CategoryFormDialog from "@/components/categories/CategoryFormDialog";
import CategoryTree from "@/components/categories/CategoryTree";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrder,
} from "@/services/categoryService";
import type { Category, CategoryFormData } from "@/types/category";
import { category as categoryLabels, common } from "@/data/labels";

/** 플랫 배열 → 트리 구조 변환 */
function buildTree(items: Category[]): Category[] {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of map.values()) {
    if (item.parentId === null) {
      roots.push(item);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children!.push(item);
      }
    }
  }

  const sortByOrder = (list: Category[]) => {
    list.sort((a, b) => a.sortOrder - b.sortOrder);
    for (const item of list) {
      if (item.children?.length) sortByOrder(item.children);
    }
  };

  sortByOrder(roots);
  return roots;
}

/** 트리에서 플랫 리스트 추출 (부모 선택용) */
function flattenTree(tree: Category[]): Category[] {
  const result: Category[] = [];
  const walk = (items: Category[]) => {
    for (const item of items) {
      result.push(item);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(tree);
  return result;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tree, setTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
      setTree(buildTree(res.data));
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditTarget(category);
    setFormOpen(true);
  };

  const handleSubmit = async (data: CategoryFormData) => {
    if (editTarget) {
      await updateCategory(editTarget.id, data);
    } else {
      await createCategory(data);
    }
    await fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      await fetchCategories();
      setDeleteTarget(null);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReorder = async (
    _parentId: number | null,
    orderedIds: number[]
  ) => {
    try {
      await updateCategoryOrder(orderedIds);
      await fetchCategories();
    } catch {
      // api.ts에서 공통 에러 처리
    }
  };

  const deleteDescription = deleteTarget
    ? deleteTarget.children?.length
      ? categoryLabels.deleteWithChildren(deleteTarget.name)
      : categoryLabels.deleteDescription(deleteTarget.name)
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{categoryLabels.pageTitle}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {categoryLabels.addButton}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : tree.length === 0 ? (
        <EmptyState message={categoryLabels.emptyMessage} />
      ) : (
        <CategoryTree
          categories={tree}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onReorder={handleReorder}
        />
      )}

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editTarget}
        categories={flattenTree(tree)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={categoryLabels.deleteTitle}
        description={deleteDescription}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
