"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, ArrowUpDown, Save, X } from "lucide-react";
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

/** 트리 깊은 복사 */
function cloneTree(tree: Category[]): Category[] {
  return tree.map((item) => ({
    ...item,
    children: item.children ? cloneTree(item.children) : [],
  }));
}

/** 트리에서 특정 부모의 자식 순서 변경 */
function reorderInTree(
  tree: Category[],
  parentId: number | null,
  orderedIds: number[]
): Category[] {
  if (parentId === null) {
    const map = new Map(tree.map((item) => [item.id, item]));
    return orderedIds
      .map((id) => map.get(id))
      .filter((item): item is Category => !!item);
  }

  return tree.map((item) => {
    if (item.id === parentId && item.children) {
      const map = new Map(item.children.map((c) => [c.id, c]));
      return {
        ...item,
        children: orderedIds
          .map((id) => map.get(id))
          .filter((c): c is Category => !!c),
      };
    }
    return {
      ...item,
      children: item.children
        ? reorderInTree(item.children, parentId, orderedIds)
        : [],
    };
  });
}

export default function CategoriesPage() {
  const [tree, setTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 순서 변경 모드
  const [editing, setEditing] = useState(false);
  const [draftTree, setDraftTree] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const originalTreeRef = useRef<Category[]>([]);

  // 추가/수정 다이얼로그
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  // 삭제 확인 다이얼로그
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
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

  /* ── 순서 변경 모드 진입/취소 ── */
  const enterEditMode = () => {
    setDraftTree(cloneTree(tree));
    originalTreeRef.current = cloneTree(tree);
    setEditing(true);
  };

  const cancelEditMode = () => {
    setEditing(false);
    setDraftTree([]);
  };

  const handleDraftReorder = (
    parentId: number | null,
    orderedIds: number[]
  ) => {
    setDraftTree((prev) => reorderInTree(prev, parentId, orderedIds));
  };

  /* ── 순서 저장 ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const allOrderedIds = flattenTree(draftTree).map((c) => c.id);
      await updateCategoryOrder(allOrderedIds);

      await fetchCategories();
      setEditing(false);
      setDraftTree([]);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setSaving(false);
    }
  };

  /* ── 카테고리 추가/수정/삭제 (보기 모드) ── */
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

  /* ── 순서 변경 여부 ── */
  const hasChanges =
    editing &&
    JSON.stringify(flattenTree(draftTree).map((c) => c.id)) !==
      JSON.stringify(flattenTree(originalTreeRef.current).map((c) => c.id));

  const displayTree = editing ? draftTree : tree;

  const deleteDescription = deleteTarget
    ? deleteTarget.children?.length
      ? categoryLabels.deleteWithChildren(deleteTarget.name)
      : categoryLabels.deleteDescription(deleteTarget.name)
    : "";

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {categoryLabels.pageTitle}
        </h1>

        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <Button
                variant="outline"
                onClick={cancelEditMode}
                disabled={saving}
              >
                <X className="mr-2 h-4 w-4" />
                {categoryLabels.editModeCancel}
              </Button>
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
                <Save className="mr-2 h-4 w-4" />
                {saving
                  ? categoryLabels.editModeSaving
                  : categoryLabels.editModeSave}
              </Button>
            </>
          ) : (
            <>
              {tree.length > 0 && (
                <Button variant="outline" onClick={enterEditMode}>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {categoryLabels.reorderButton}
                </Button>
              )}
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {categoryLabels.addButton}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 순서 변경 모드 안내 */}
      {editing && hasChanges && (
        <p className="text-sm text-muted-foreground" role="status">
          {categoryLabels.editModeUnsaved}
        </p>
      )}

      {/* 카테고리 트리 */}
      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : displayTree.length === 0 ? (
        <EmptyState message={categoryLabels.emptyMessage} />
      ) : (
        <CategoryTree
          categories={displayTree}
          editing={editing}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onReorder={handleDraftReorder}
        />
      )}

      {/* 카테고리 추가/수정 다이얼로그 */}
      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editTarget}
        categories={flattenTree(tree)}
        onSubmit={handleSubmit}
      />

      {/* 삭제 확인 다이얼로그 */}
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
