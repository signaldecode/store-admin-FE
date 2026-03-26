"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, CategoryFormData } from "@/types/category";
import type { ApiError } from "@/types/api";
import { category as categoryLabels, common } from "@/data/labels";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

type Level = "1" | "2" | "3";

const LEVEL_LABELS: Record<Level, string> = {
  "1": categoryLabels.levelMain,
  "2": categoryLabels.levelSub,
  "3": categoryLabels.levelDetail,
};

export default function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSubmit,
}: CategoryFormDialogProps) {
  const isEdit = !!category;

  const [name, setName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [level, setLevel] = useState<Level>("1");
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 대분류 목록 (depth === 0)
  const mainCategories = useMemo(
    () => categories.filter((c) => c.depth === 0 && c.id !== category?.id),
    [categories, category]
  );

  // 중분류 목록 (depth === 1, 선택된 대분류 하위)
  const subCategories = useMemo(
    () =>
      categories.filter(
        (c) =>
          c.depth === 1 &&
          c.parentId === (mainCategoryId ? Number(mainCategoryId) : null) &&
          c.id !== category?.id
      ),
    [categories, mainCategoryId, category]
  );

  const mainCategoryItems = useMemo(
    () => Object.fromEntries(mainCategories.map((c) => [c.id.toString(), c.name])),
    [mainCategories]
  );
  const subCategoryItems = useMemo(
    () => Object.fromEntries(subCategories.map((c) => [c.id.toString(), c.name])),
    [subCategories]
  );

  useEffect(() => {
    if (open) {
      setError("");
      if (category) {
        setName(category.name);
        setSiteUrl(category.siteUrl || "");
        setLevel((category.depth + 1).toString() as Level);
        if (category.depth === 1) {
          setMainCategoryId(category.parentId?.toString() || "");
          setSubCategoryId("");
        } else if (category.depth === 2) {
          const parentSub = categories.find((c) => c.id === category.parentId);
          setMainCategoryId(parentSub?.parentId?.toString() || "");
          setSubCategoryId(category.parentId?.toString() || "");
        } else {
          setMainCategoryId("");
          setSubCategoryId("");
        }
      } else {
        setName("");
        setSiteUrl("");
        setLevel("1");
        setMainCategoryId("");
        setSubCategoryId("");
      }
    }
  }, [open, category, categories]);

  /** 레벨에 따라 parentId 결정 */
  function resolveParentId(): number | null {
    if (level === "2" && mainCategoryId) return Number(mainCategoryId);
    if (level === "3" && subCategoryId) return Number(subCategoryId);
    return null;
  }

  /** 레벨 → depth 변환 (대분류=0, 중분류=1, 소분류=2) */
  function resolveDepth(): number {
    return Number(level) - 1;
  }

  const validate = (): boolean => {
    if (!name.trim()) {
      setError(categoryLabels.nameRequired);
      return false;
    }
    if (level === "2" && !mainCategoryId) {
      setError(categoryLabels.parentMainRequired);
      return false;
    }
    if (level === "3" && !mainCategoryId) {
      setError(categoryLabels.parentMainRequired);
      return false;
    }
    if (level === "3" && !subCategoryId) {
      setError(categoryLabels.parentSubRequired);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        siteUrl: level === "1" && siteUrl.trim() ? siteUrl.trim() : undefined,
        parentId: resolveParentId(),
        depth: resolveDepth(),
      });
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || common.saveFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? categoryLabels.editTitle : categoryLabels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 분류 단계 */}
          <div className="space-y-2">
            <Label htmlFor="category-level">{categoryLabels.levelLabel}</Label>
            <Select
              value={level}
              onValueChange={(v) => {
                if (v) {
                  setLevel(v as Level);
                  setMainCategoryId("");
                  setSubCategoryId("");
                  setError("");
                }
              }}
              disabled={loading || isEdit}
            >
              <SelectTrigger id="category-level" items={LEVEL_LABELS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{categoryLabels.levelMain}</SelectItem>
                <SelectItem value="2">{categoryLabels.levelSub}</SelectItem>
                <SelectItem value="3">{categoryLabels.levelDetail}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 중분류일 때: 소속 대분류 선택 */}
          {(level === "2" || level === "3") && (
            <div className="space-y-2">
              <Label htmlFor="category-parent-main">
                {categoryLabels.parentMainLabel} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={mainCategoryId || null}
                onValueChange={(v) => {
                  setMainCategoryId(v ?? "");
                  setSubCategoryId("");
                  setError("");
                }}
                disabled={loading}
              >
                <SelectTrigger
                  id="category-parent-main"
                  aria-required="true"
                  items={mainCategoryItems}
                >
                  <SelectValue placeholder={categoryLabels.parentMainPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {mainCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 소분류일 때: 소속 중분류 선택 */}
          {level === "3" && (
            <div className="space-y-2">
              <Label htmlFor="category-parent-sub">
                {categoryLabels.parentSubLabel} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={subCategoryId || null}
                onValueChange={(v) => {
                  setSubCategoryId(v ?? "");
                  setError("");
                }}
                disabled={loading || !mainCategoryId}
              >
                <SelectTrigger
                  id="category-parent-sub"
                  aria-required="true"
                  items={subCategoryItems}
                >
                  <SelectValue placeholder={
                    !mainCategoryId
                      ? categoryLabels.parentMainPlaceholder
                      : categoryLabels.parentSubPlaceholder
                  } />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 카테고리명 */}
          <div className="space-y-2">
            <Label htmlFor="category-name">
              {categoryLabels.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={categoryLabels.namePlaceholder}
              aria-required="true"
              aria-describedby={error ? "category-form-error" : undefined}
              disabled={loading}
              autoFocus
            />
          </div>

          {/* 대분류일 때: 사이트 URL */}
          {level === "1" && (
            <div className="space-y-2">
              <Label htmlFor="category-site-url">
                {categoryLabels.siteUrlLabel}
              </Label>
              <Input
                id="category-site-url"
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder={categoryLabels.siteUrlPlaceholder}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <p
              id="category-form-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {common.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? common.saving : isEdit ? common.edit : common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
