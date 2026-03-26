"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNotice } from "@/services/noticeService";
import type { NoticeFormData } from "@/types/notice";
import type { NoticeType, NoticeStatus } from "@/lib/constants";
import {
  notice as noticeLabels,
  common,
  NOTICE_TYPE_LABEL,
  NOTICE_STATUS_LABEL,
} from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";

const INITIAL_FORM: Omit<NoticeFormData, "tenantId"> = {
  title: "",
  type: "NOTICE",
  content: "",
  isPinned: false,
  status: "ACTIVE",
};

export default function NoticeNewPage() {
  const router = useRouter();
  const [siteId, setSiteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<NoticeFormData, "tenantId">>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    setSaving(true);
    try {
      await createNotice({ ...formData, tenantId: siteId ?? 0 });
      router.push("/notices");
    } catch {
      // api.ts handles common errors
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/notices")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {noticeLabels.backToList}
        </Button>
        <h1 className="text-2xl font-semibold">{noticeLabels.createTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-1.5">
          <Label>{"사이트"} <span className="text-destructive">*</span></Label>
          <SiteSelect value={siteId} onChange={setSiteId} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notice-title">
            {noticeLabels.titleLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="notice-title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder={noticeLabels.titlePlaceholder}
            aria-required="true"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notice-type">{noticeLabels.typeLabel}</Label>
          <Select
            value={formData.type}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, type: v as NoticeType }))
            }
          >
            <SelectTrigger id="notice-type" className="w-full" items={Object.fromEntries(
              Object.entries(NOTICE_TYPE_LABEL).map(([k, v]) => [k, v])
            )}>
              <SelectValue placeholder={noticeLabels.typePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NOTICE_TYPE_LABEL).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notice-content">
            {noticeLabels.contentLabel} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notice-content"
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            placeholder={noticeLabels.contentPlaceholder}
            rows={8}
            aria-required="true"
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="notice-isPinned"
            checked={formData.isPinned}
            onCheckedChange={(checked: boolean) =>
              setFormData((prev) => ({ ...prev, isPinned: checked }))
            }
          />
          <Label htmlFor="notice-isPinned">{noticeLabels.isPinnedLabel}</Label>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notice-status">{noticeLabels.statusLabel}</Label>
          <Select
            value={formData.status}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, status: v as NoticeStatus }))
            }
          >
            <SelectTrigger id="notice-status" className="w-full" items={Object.fromEntries(
              Object.entries(NOTICE_STATUS_LABEL).map(([k, v]) => [k, v])
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NOTICE_STATUS_LABEL).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? common.saving : common.create}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/notices")}
            disabled={saving}
          >
            {common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
