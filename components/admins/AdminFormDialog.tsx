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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_ROLE } from "@/lib/constants";
import type { Admin, AdminFormData, AdminUpdateData } from "@/types/admin";
import type { AdminRole } from "@/lib/constants";
import type { ApiError } from "@/types/api";
import { admin as adminLabels, common, ADMIN_ROLE_LABEL } from "@/data/labels";

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin?: Admin | null;
  onSubmit: (data: AdminFormData | AdminUpdateData) => Promise<void>;
}

export default function AdminFormDialog({
  open,
  onOpenChange,
  admin,
  onSubmit,
}: AdminFormDialogProps) {
  const isEdit = !!admin;

  // 생성용 필드
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 공용 필드
  const [name, setName] = useState("");
  const [role, setRole] = useState<AdminRole>(ADMIN_ROLE.ADMIN);

  // 수정 전용 필드
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (admin) {
        setName(admin.name);
        setRole(admin.role);
        setIsActive(admin.isActive);
      } else {
        setEmail("");
        setPassword("");
        setName("");
        setRole(ADMIN_ROLE.ADMIN);
      }
      setErrors({});
    }
  }, [open, admin]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isEdit) {
      if (!email) newErrors.email = adminLabels.emailRequired;
      if (!password) newErrors.password = adminLabels.passwordRequired;
    }
    if (!name) newErrors.name = adminLabels.nameRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit) {
        await onSubmit({ name: name.trim(), role, isActive });
      } else {
        await onSubmit({ email: email.trim(), name: name.trim(), password, role });
      }
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.errors) {
        setErrors(apiError.errors);
      } else {
        setErrors({ _form: apiError.message || common.saveFailed });
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
            {isEdit ? adminLabels.editTitle : adminLabels.createTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="admin-email">
                {adminLabels.emailLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={adminLabels.emailPlaceholder}
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
          )}

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="admin-password">
                {adminLabels.passwordLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={adminLabels.passwordPlaceholder}
                aria-required="true"
                aria-describedby={errors.password ? "admin-password-error" : undefined}
                disabled={loading}
              />
              {errors.password && (
                <p id="admin-password-error" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="admin-name">
              {adminLabels.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="admin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={adminLabels.namePlaceholder}
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
            <Label htmlFor="admin-role">
              {adminLabels.roleLabel} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(value) => {
                if (value) setRole(value as AdminRole);
              }}
              disabled={loading}
              items={ADMIN_ROLE_LABEL as Record<string, string>}
            >
              <SelectTrigger id="admin-role" aria-required="true">
                <SelectValue placeholder={adminLabels.rolePlaceholder} />
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

          {isEdit && (
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-isActive">{adminLabels.isActiveLabel}</Label>
              <Switch
                id="admin-isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={loading}
              />
            </div>
          )}

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
