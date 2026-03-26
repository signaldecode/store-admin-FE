"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
import { createPromotion } from "@/services/promotionService";
import { promotion as promotionLabels, common, COUPON_DISCOUNT_TYPE_LABEL } from "@/data/labels";
import type { CouponDiscountType } from "@/lib/constants";
import SiteSelect from "@/components/common/SiteSelect";

export default function PromotionNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [siteId, setSiteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState<CouponDiscountType>("RATE");
  const [discountValue, setDiscountValue] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [endedAt, setEndedAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!siteId) newErrors.siteId = "사이트를 선택해주세요.";
    if (!name.trim()) newErrors.name = promotionLabels.nameRequired;
    if (!discountValue || Number(discountValue) <= 0) newErrors.discountValue = promotionLabels.discountValuePlaceholder;
    if (!startedAt) newErrors.startedAt = "시작일을 선택해주세요.";
    if (!endedAt) newErrors.endedAt = "종료일을 선택해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await createPromotion({
        tenantId: siteId!,
        name: name.trim(),
        discountType,
        discountValue: Number(discountValue),
        roundingType: "ROUND",
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(endedAt).toISOString(),
        isActive,
      });
      router.push("/promotions");
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/promotions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {promotionLabels.backToList}
        </Button>
        <h1 className="text-2xl font-semibold">{promotionLabels.createTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label>사이트 <span className="text-destructive">*</span></Label>
          <SiteSelect value={siteId} onChange={setSiteId} required />
          {errors.siteId && <p className="text-sm text-destructive">{errors.siteId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="promo-name">
            {promotionLabels.nameLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="promo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={promotionLabels.namePlaceholder}
            aria-required="true"
            aria-describedby={errors.name ? "promo-name-error" : undefined}
          />
          {errors.name && (
            <p id="promo-name-error" className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="promo-discount-type">{promotionLabels.discountTypeLabel}</Label>
          <Select value={discountType} onValueChange={(v) => setDiscountType(v as CouponDiscountType)}>
            <SelectTrigger id="promo-discount-type" items={COUPON_DISCOUNT_TYPE_LABEL}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(COUPON_DISCOUNT_TYPE_LABEL) as [CouponDiscountType, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="promo-discount-value">
            {promotionLabels.discountValueLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="promo-discount-value"
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={promotionLabels.discountValuePlaceholder}
            aria-required="true"
            aria-describedby={errors.discountValue ? "promo-dv-error" : undefined}
          />
          {errors.discountValue && (
            <p id="promo-dv-error" className="text-sm text-destructive">{errors.discountValue}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="promo-started-at">
              {promotionLabels.startedAtLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="promo-started-at"
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              aria-required="true"
              aria-describedby={errors.startedAt ? "promo-start-error" : undefined}
            />
            {errors.startedAt && (
              <p id="promo-start-error" className="text-sm text-destructive">{errors.startedAt}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="promo-ended-at">
              {promotionLabels.endedAtLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="promo-ended-at"
              type="datetime-local"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              aria-required="true"
              aria-describedby={errors.endedAt ? "promo-end-error" : undefined}
            />
            {errors.endedAt && (
              <p id="promo-end-error" className="text-sm text-destructive">{errors.endedAt}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="promo-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="promo-active">{promotionLabels.isActiveLabel}</Label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? common.saving : common.create}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/promotions")}>
            {common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
