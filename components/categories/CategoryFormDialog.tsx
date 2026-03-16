"use client";

import { useState, useEffect } from "react";
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

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

const NO_PARENT = "__none__";

export default function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSubmit,
}: CategoryFormDialogProps) {
  const isEdit = !!category;

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>(NO_PARENT);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 부모 카테고리 후보: 자기 자신과 자식은 제외
  const parentOptions = categories.filter((c) => {
    if (!category) return true;
    return c.id !== category.id;
  });

  useEffect(() => {
    if (open) {
      setName(category?.name || "");
      setParentId(category?.parentId?.toString() || NO_PARENT);
      setError("");
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("카테고리명을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        parentId: parentId === NO_PARENT ? null : Number(parentId),
      });
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "카테고리 수정" : "카테고리 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">
              카테고리명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="카테고리명을 입력하세요"
              aria-required="true"
              aria-describedby={error ? "category-name-error" : undefined}
              disabled={loading}
              autoFocus
            />
            {error && (
              <p
                id="category-name-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-parent">상위 카테고리</Label>
            <Select
              value={parentId}
              onValueChange={(value) => { if (value !== null) setParentId(value); }}
              disabled={loading}
            >
              <SelectTrigger id="category-parent">
                <SelectValue placeholder="상위 카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PARENT}>없음 (최상위)</SelectItem>
                {parentOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "저장 중..." : isEdit ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
