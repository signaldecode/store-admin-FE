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
import type { Brand, BrandFormData } from "@/types/brand";
import type { ApiError } from "@/types/api";

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand | null;
  onSubmit: (data: BrandFormData) => Promise<void>;
}

export default function BrandFormDialog({
  open,
  onOpenChange,
  brand,
  onSubmit,
}: BrandFormDialogProps) {
  const isEdit = !!brand;

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(brand?.name || "");
      setError("");
    }
  }, [open, brand]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("브랜드명을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name: name.trim() });
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
          <DialogTitle>{isEdit ? "브랜드 수정" : "브랜드 추가"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">
              브랜드명 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="brand-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="브랜드명을 입력하세요"
              aria-required="true"
              aria-describedby={error ? "brand-name-error" : undefined}
              disabled={loading}
              autoFocus
            />
            {error && (
              <p id="brand-name-error" className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
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
