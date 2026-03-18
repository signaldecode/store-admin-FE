"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, ArrowUpDown, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import CategoryFormDialog from "@/components/categories/CategoryFormDialog";
import CategoryTree from "@/components/categories/CategoryTree";
import {
  getCategories,
  createCategory,
  updateCategories,
  deleteCategories,
} from "@/services/categoryService";
import { getActiveSites } from "@/services/siteService";
import type { Category, CategoryFormData, CategoryUpdateNode } from "@/types/category";
import type { ActiveSite } from "@/types/site";
import { category as categoryLabels, common } from "@/data/labels";


/** 트리에 parentId를 보강 (API 응답은 중첩 구조만 제공하므로) */
function enrichParentIds(tree: Category[], parentId: number | null = null): Category[] {
  return tree.map((item) => ({
    ...item,
    parentId,
    children: item.children?.length
      ? enrichParentIds(item.children, item.id)
      : [],
  }));
}

/** 트리에서 플랫 리스트 추출 (부모 선택용) */
function flattenTree(tree: Category[]): Category[] {
  const result: Category[] = [];
  for (const item of tree) {
    result.push(item);
    if (item.children?.length) {
      result.push(...flattenTree(item.children));
    }
  }
  return result;
}

/** Category 트리 → API 요청용 CategoryUpdateNode 트리 변환 */
function toUpdateNodes(tree: Category[], depth = 0): CategoryUpdateNode[] {
  return tree.map((item, index) => ({
    id: item.id,
    siteId: item.siteId!,
    siteName: item.siteName!,
    name: item.name,
    depth,
    sortOrder: index,
    children: item.children?.length
      ? toUpdateNodes(item.children, depth + 1)
      : [],
  }));
}

/** 트리에서 특정 노드의 이름을 변경한 새 트리 반환 */
function updateNodeInTree(tree: Category[], id: number, name: string): Category[] {
  return tree.map((item) => {
    if (item.id === id) return { ...item, name };
    if (item.children?.length) {
      return { ...item, children: updateNodeInTree(item.children, id, name) };
    }
    return item;
  });
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

  // 사이트 필터
  const [sites, setSites] = useState<ActiveSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>();

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

  // 사이트 목록 로드
  useEffect(() => {
    getActiveSites()
      .then((res) => setSites(res.data))
      .catch(() => {});
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setTree(enrichParentIds(res.data));
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
    setDraftTree(cloneTree(filteredTree));
    originalTreeRef.current = cloneTree(filteredTree);
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
      await updateCategories(toUpdateNodes(draftTree));
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
      // 수정: 현재 트리에서 해당 카테고리의 name을 변경 후 전체 저장
      const updatedTree = updateNodeInTree(tree, editTarget.id, data.name);
      await updateCategories(toUpdateNodes(updatedTree));
    } else {
      await createCategory(data);
    }
    await fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteCategories([deleteTarget.id]);
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

  /** 사이트 필터 적용 (대분류의 siteId 기준 필터링) */
  const filteredTree = selectedSiteId
    ? tree.filter((item) => item.siteId === selectedSiteId)
    : tree;

  const displayTree = editing ? draftTree : filteredTree;

  const deleteDescription = deleteTarget
    ? deleteTarget.children?.length
      ? categoryLabels.deleteWithChildren(deleteTarget.name)
      : categoryLabels.deleteDescription(deleteTarget.name)
    : "";

  const siteItems = Object.fromEntries(
    sites.map((s) => [s.id.toString(), s.name])
  );

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
              {filteredTree.length > 0 && (
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

      {/* 사이트 필터 */}
      {!editing && sites.length > 0 && (
        <div className="flex items-center gap-2">
          <Label htmlFor="category-site-filter">{categoryLabels.siteLabel}</Label>
          <Select
            value={selectedSiteId?.toString() ?? "all"}
            onValueChange={(v) => {
              setSelectedSiteId(v === "all" ? undefined : Number(v));
            }}
            items={{ all: categoryLabels.siteAll, ...siteItems }}
          >
            <SelectTrigger id="category-site-filter" className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{categoryLabels.siteAll}</SelectItem>
              {sites.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
        categories={flattenTree(filteredTree)}
        sites={sites}
        selectedSiteId={selectedSiteId}
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
