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
import type { Site, SiteFormData } from "@/types/site";
import type { ApiError } from "@/types/api";
import { site as siteLabels, common } from "@/data/labels";

interface SiteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  site?: Site | null;
  onSubmit: (data: SiteFormData) => Promise<void>;
}

export default function SiteFormDialog({
  open,
  onOpenChange,
  site,
  onSubmit,
}: SiteFormDialogProps) {
  const isEdit = !!site;

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCode(site?.code || "");
      setName(site?.name || "");
      setDomain(site?.domain || "");
      setDescription(site?.description || "");
      setError("");
    }
  }, [open, site]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code.trim()) {
      setError(siteLabels.codeRequired);
      return;
    }
    if (!name.trim()) {
      setError(siteLabels.nameRequired);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        code: code.trim(),
        name: name.trim(),
        domain: domain.trim(),
        description: description.trim(),
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
          <DialogTitle>{isEdit ? siteLabels.editTitle : siteLabels.createTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-code">
              {siteLabels.codeLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="site-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={siteLabels.codePlaceholder}
              aria-required="true"
              disabled={loading || isEdit}
              autoFocus={!isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-name">
              {siteLabels.nameLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="site-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={siteLabels.namePlaceholder}
              aria-required="true"
              aria-describedby={error ? "site-form-error" : undefined}
              disabled={loading}
              autoFocus={isEdit}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-domain">{siteLabels.domainLabel}</Label>
            <Input
              id="site-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={siteLabels.domainPlaceholder}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">{siteLabels.descriptionLabel}</Label>
            <Textarea
              id="site-description"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={siteLabels.descriptionPlaceholder}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && (
            <p id="site-form-error" className="text-sm text-destructive" role="alert">
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
