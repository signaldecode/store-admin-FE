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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/common/ImageUploader";
import type { Brand, BrandFormData } from "@/types/brand";
import type { ApiError } from "@/types/api";
import { brand as brandLabels, common } from "@/data/labels";

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
  const [description, setDescription] = useState("");
  const [logoImages, setLogoImages] = useState<{ file?: File; url: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(brand?.name || "");
      setDescription(brand?.description || "");
      setLogoImages(brand?.logoUrl ? [{ url: brand.logoUrl }] : []);
      setError("");
    }
  }, [open, brand]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(brandLabels.nameRequired);
      return;
    }

    setLoading(true);
    try {
      const logoUrl = logoImages.length > 0 ? logoImages[0].url : null;
      await onSubmit({ name: name.trim(), description: description.trim(), logoUrl });
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
          <DialogTitle>{isEdit ? brandLabels.editTitle : brandLabels.createTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">
              {brandLabels.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="brand-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={brandLabels.namePlaceholder}
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

          <div className="space-y-2">
            <Label htmlFor="brand-description">{brandLabels.descriptionLabel}</Label>
            <Textarea
              id="brand-description"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={brandLabels.descriptionPlaceholder}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{brandLabels.logoLabel}</Label>
            <ImageUploader
              images={logoImages}
              onChange={setLogoImages}
              maxCount={1}
              maxSizeMB={2}
            />
          </div>

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
