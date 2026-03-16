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
import { ADMIN_ROLE, ADMIN_ROLE_LABEL } from "@/lib/constants";
import type { Admin, AdminFormData } from "@/types/admin";
import type { AdminRole } from "@/lib/constants";
import type { ApiError } from "@/types/api";

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: Admin | null;
  onSubmit: (data: AdminFormData) => Promise<void>;
}

export default function AdminFormDialog({
  open,
  onOpenChange,
  admin,
  onSubmit,
}: AdminFormDialogProps) {
  const isEdit = !!admin;

  const [formData, setFormData] = useState<AdminFormData>({
    email: "",
    name: "",
    password: "",
    role: ADMIN_ROLE.MANAGER,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (admin) {
        setFormData({
          email: admin.email,
          name: admin.name,
          password: "",
          role: admin.role,
        });
      } else {
        setFormData({
          email: "",
          name: "",
          password: "",
          role: ADMIN_ROLE.MANAGER,
        });
      }
      setErrors({});
    }
  }, [open, admin]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "이메일을 입력해주세요.";
    if (!formData.name) newErrors.name = "이름을 입력해주세요.";
    if (!isEdit && !formData.password)
      newErrors.password = "비밀번호를 입력해주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }
      await onSubmit(submitData);
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.errors) {
        setErrors(apiError.errors);
      } else {
        setErrors({ _form: apiError.message || "저장에 실패했습니다." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "관리자 수정" : "관리자 추가"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">
              이메일 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="admin@example.com"
              aria-required="true"
              aria-describedby={errors.email ? "admin-email-error" : undefined}
              disabled={loading}
            />
            {errors.email && (
              <p id="admin-email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-name">
              이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="관리자 이름"
              aria-required="true"
              aria-describedby={errors.name ? "admin-name-error" : undefined}
              disabled={loading}
            />
            {errors.name && (
              <p id="admin-name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">
              비밀번호{" "}
              {!isEdit && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="admin-password"
              type="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder={
                isEdit ? "변경 시에만 입력" : "비밀번호를 입력하세요"
              }
              aria-required={!isEdit ? "true" : undefined}
              aria-describedby={
                errors.password ? "admin-password-error" : undefined
              }
              disabled={loading}
            />
            {errors.password && (
              <p
                id="admin-password-error"
                className="text-sm text-destructive"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-role">
              역할 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => {
                if (value) setFormData((prev) => ({ ...prev, role: value as AdminRole }));
              }}
              disabled={loading}
            >
              <SelectTrigger id="admin-role" aria-required="true">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ADMIN_ROLE_LABEL).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errors._form && (
            <p className="text-sm text-destructive" role="alert">
              {errors._form}
            </p>
          )}

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
