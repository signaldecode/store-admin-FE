"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createCoupon } from "@/services/couponService";
import { coupon as couponLabels, common, COUPON_DISCOUNT_TYPE_LABEL, COUPON_TYPE_LABEL, COUPON_VALIDITY_TYPE_LABEL } from "@/data/labels";
import type { CouponDiscountType, CouponType, CouponValidityType } from "@/lib/constants";

export default function CouponNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [couponType, setCouponType] = useState<CouponType>("PRODUCT_DISCOUNT");
  const [discountType, setDiscountType] = useState<CouponDiscountType>("RATE");
  const [discountValue, setDiscountValue] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [validityType, setValidityType] = useState<CouponValidityType>("FIXED_PERIOD");
  const [validityDays, setValidityDays] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [allowPromotionOverlap, setAllowPromotionOverlap] = useState(false);
  const [allowDuplicateUse, setAllowDuplicateUse] = useState(false);
  const [notice, setNotice] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = couponLabels.nameRequired;
    if (!discountValue || Number(discountValue) <= 0) newErrors.discountValue = couponLabels.discountValuePlaceholder;
    if (!minOrderAmount || Number(minOrderAmount) < 0) newErrors.minOrderAmount = couponLabels.minOrderPlaceholder;
    if (!totalQuantity || Number(totalQuantity) <= 0) newErrors.totalQuantity = couponLabels.totalQuantityPlaceholder;
    if (!validFrom) newErrors.validFrom = "유효 시작일을 선택해주세요.";
    if (!validTo) newErrors.validTo = "유효 종료일을 선택해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await createCoupon({
        name: name.trim(),
        description: description.trim(),
        couponType,
        discountType,
        discountValue: Number(discountValue),
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
        minOrderAmount: Number(minOrderAmount),
        totalQuantity: Number(totalQuantity),
        validityType,
        validityDays: validityDays ? Number(validityDays) : undefined,
        validFrom: new Date(validFrom).toISOString(),
        validTo: new Date(validTo).toISOString(),
        allowPromotionOverlap,
        allowDuplicateUse,
        notice: notice.trim(),
      });
      router.push("/coupons");
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/coupons")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {couponLabels.backToList}
        </Button>
        <h1 className="text-2xl font-semibold">{couponLabels.createTitle}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coupon-name">
            {couponLabels.nameLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coupon-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={couponLabels.namePlaceholder}
            aria-required="true"
            aria-describedby={errors.name ? "coupon-name-error" : undefined}
          />
          {errors.name && (
            <p id="coupon-name-error" className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-type">쿠폰 유형</Label>
          <Select value={couponType} onValueChange={(v) => { if (v) setCouponType(v as CouponType); }}>
            <SelectTrigger id="coupon-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(COUPON_TYPE_LABEL) as [CouponType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-description">{couponLabels.descriptionLabel}</Label>
          <Textarea
            id="coupon-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={couponLabels.descriptionPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-discount-type">{couponLabels.discountTypeLabel}</Label>
          <Select value={discountType} onValueChange={(v) => setDiscountType(v as CouponDiscountType)}>
            <SelectTrigger id="coupon-discount-type">
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
          <Label htmlFor="coupon-discount-value">
            {couponLabels.discountValueLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coupon-discount-value"
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder={couponLabels.discountValuePlaceholder}
            aria-required="true"
            aria-describedby={errors.discountValue ? "coupon-dv-error" : undefined}
          />
          {errors.discountValue && (
            <p id="coupon-dv-error" className="text-sm text-destructive">{errors.discountValue}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-max-discount">{couponLabels.maxDiscountLabel}</Label>
          <Input
            id="coupon-max-discount"
            type="number"
            value={maxDiscountAmount}
            onChange={(e) => setMaxDiscountAmount(e.target.value)}
            placeholder={couponLabels.maxDiscountPlaceholder}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-min-order">
            {couponLabels.minOrderLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coupon-min-order"
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            placeholder={couponLabels.minOrderPlaceholder}
            aria-required="true"
            aria-describedby={errors.minOrderAmount ? "coupon-mo-error" : undefined}
          />
          {errors.minOrderAmount && (
            <p id="coupon-mo-error" className="text-sm text-destructive">{errors.minOrderAmount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-total-qty">
            {couponLabels.totalQuantityLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="coupon-total-qty"
            type="number"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(e.target.value)}
            placeholder={couponLabels.totalQuantityPlaceholder}
            aria-required="true"
            aria-describedby={errors.totalQuantity ? "coupon-qty-error" : undefined}
          />
          {errors.totalQuantity && (
            <p id="coupon-qty-error" className="text-sm text-destructive">{errors.totalQuantity}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-validity-type">유효기간 유형</Label>
          <Select value={validityType} onValueChange={(v) => { if (v) setValidityType(v as CouponValidityType); }}>
            <SelectTrigger id="coupon-validity-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.entries(COUPON_VALIDITY_TYPE_LABEL) as [CouponValidityType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {validityType === "DAYS_FROM_DOWNLOAD" && (
          <div className="space-y-2">
            <Label htmlFor="coupon-validity-days">유효 일수</Label>
            <Input id="coupon-validity-days" type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} placeholder="30" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-valid-from">
              {couponLabels.validFromLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="coupon-valid-from"
              type="datetime-local"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              aria-required="true"
              aria-describedby={errors.validFrom ? "coupon-vf-error" : undefined}
            />
            {errors.validFrom && (
              <p id="coupon-vf-error" className="text-sm text-destructive">{errors.validFrom}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-valid-to">
              {couponLabels.validToLabel} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="coupon-valid-to"
              type="datetime-local"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              aria-required="true"
              aria-describedby={errors.validTo ? "coupon-vt-error" : undefined}
            />
            {errors.validTo && (
              <p id="coupon-vt-error" className="text-sm text-destructive">{errors.validTo}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="allow-overlap" checked={allowPromotionOverlap} onCheckedChange={setAllowPromotionOverlap} />
          <Label htmlFor="allow-overlap">프로모션 중복 허용</Label>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="allow-duplicate" checked={allowDuplicateUse} onCheckedChange={setAllowDuplicateUse} />
          <Label htmlFor="allow-duplicate">중복 사용 허용</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-notice">쿠폰 안내</Label>
          <Textarea id="coupon-notice" value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="쿠폰 사용 안내 문구" rows={2} />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? common.saving : common.create}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/coupons")}>
            {common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
