"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import ImageUploader from "@/components/common/ImageUploader";
import OptionTypeSelector, {
  type OptionDraft,
} from "@/components/products/OptionTypeSelector";
import OptionCombinationTable, {
  type VariantDraft,
} from "@/components/products/OptionCombinationTable";
import OptionPriceEditor from "@/components/products/OptionPriceEditor";
import { Separator } from "@/components/ui/separator";
import {
  PRODUCT_STATUS,
  OPTION_TYPE,
} from "@/lib/constants";
import type { Product } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import type { ApiError } from "@/types/api";
import { product as productLabels, common, PRODUCT_STATUS_LABEL } from "@/data/labels";

interface ImageFile {
  file?: File;
  url: string;
}

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: FormData) => Promise<void>;
}

const NO_SELECT = "__none__";

export default function ProductForm({
  product,
  categories,
  brands,
  onSubmit,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ProductStatus>(PRODUCT_STATUS.SALE);
  const [mainCategoryId, setMainCategoryId] = useState<string>(NO_SELECT);
  const [subCategoryId, setSubCategoryId] = useState<string>(NO_SELECT);
  const [detailCategoryId, setDetailCategoryId] = useState<string>(NO_SELECT);
  const [brandId, setBrandId] = useState<string>(NO_SELECT);

  // 카테고리 레벨별 필터링
  const mainCategories = categories.filter((c) => c.level === 1);
  const subCategories = categories.filter(
    (c) => c.level === 2 && c.parentId === (mainCategoryId !== NO_SELECT ? Number(mainCategoryId) : null)
  );
  const detailCategories = categories.filter(
    (c) => c.level === 3 && c.parentId === (subCategoryId !== NO_SELECT ? Number(subCategoryId) : null)
  );
  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<OptionDraft[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [optionPrices, setOptionPrices] = useState<
    Record<string, Record<string, number>>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStatus(product.status);
      setMainCategoryId(product.mainCategoryId?.toString() || NO_SELECT);
      setSubCategoryId(product.subCategoryId?.toString() || NO_SELECT);
      setDetailCategoryId(product.detailCategoryId?.toString() || NO_SELECT);
      setBrandId(product.brandId?.toString() || NO_SELECT);
      setImages(
        product.images.map((img) => ({ url: img.url }))
      );
      if (product.options.length > 0) {
        setOptions(
          product.options.map((o) => ({
            name: o.name,
            type: o.type,
            values: o.values,
          }))
        );
      }
      if (product.variants.length > 0) {
        setVariants(
          product.variants.map((v) => ({
            optionValues: v.optionValues,
            sku: v.sku,
            stock: v.stock,
            additionalPrice: v.additionalPrice,
          }))
        );
      }
    }
  }, [product]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = productLabels.nameRequired;
    if (!price || Number(price) < 0) newErrors.price = productLabels.priceRequired;
    if (mainCategoryId === NO_SELECT) newErrors.mainCategoryId = productLabels.mainCategoryRequired;
    if (subCategoryId === NO_SELECT) newErrors.subCategoryId = productLabels.subCategoryRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("status", status);
      formData.append("mainCategoryId", mainCategoryId);
      formData.append("subCategoryId", subCategoryId);
      if (detailCategoryId !== NO_SELECT) {
        formData.append("detailCategoryId", detailCategoryId);
      }
      if (brandId !== NO_SELECT) {
        formData.append("brandId", brandId);
      }

      for (const img of images) {
        if (img.file) {
          formData.append("images", img.file);
        } else {
          formData.append("existingImages", img.url);
        }
      }

      // 옵션 & variant
      if (options.length > 0) {
        const validOptions = options.filter((o) => o.name.trim());
        formData.append("options", JSON.stringify(validOptions));

        if (variants.length > 0) {
          formData.append("variants", JSON.stringify(variants));
        }
      }

      await onSubmit(formData);
      router.push("/products");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 상품명 */}
      <div className="space-y-2">
        <Label htmlFor="product-name">
          {productLabels.nameLabel} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={productLabels.namePlaceholder}
          aria-required="true"
          aria-describedby={errors.name ? "product-name-error" : undefined}
          disabled={loading}
        />
        {errors.name && (
          <p id="product-name-error" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      {/* 설명 */}
      <div className="space-y-2">
        <Label htmlFor="product-description">{productLabels.descriptionLabel}</Label>
        <Textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={productLabels.descriptionPlaceholder}
          rows={5}
          disabled={loading}
        />
      </div>

      {/* 가격 / 상태 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-price">
            {productLabels.priceLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="product-price"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            aria-required="true"
            aria-describedby={errors.price ? "product-price-error" : undefined}
            disabled={loading}
          />
          {errors.price && (
            <p id="product-price-error" className="text-sm text-destructive">
              {errors.price}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-status">{productLabels.statusLabel}</Label>
          <Select
            value={status}
            onValueChange={(v) => {
              if (v) setStatus(v as ProductStatus);
            }}
            disabled={loading}
          >
            <SelectTrigger id="product-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRODUCT_STATUS_LABEL).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 대분류 / 중분류 (필수) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-main-category">
            {productLabels.mainCategoryLabel} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={mainCategoryId}
            onValueChange={(v) => {
              if (v) {
                setMainCategoryId(v);
                setSubCategoryId(NO_SELECT);
                setDetailCategoryId(NO_SELECT);
              }
            }}
            disabled={loading}
          >
            <SelectTrigger
              id="product-main-category"
              aria-required="true"
              aria-invalid={!!errors.mainCategoryId}
              aria-describedby={
                errors.mainCategoryId ? "product-main-category-error" : undefined
              }
            >
              <SelectValue placeholder={productLabels.mainCategoryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT} disabled>
                {productLabels.mainCategoryPlaceholder}
              </SelectItem>
              {mainCategories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mainCategoryId && (
            <p id="product-main-category-error" className="text-sm text-destructive">
              {errors.mainCategoryId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-sub-category">
            {productLabels.subCategoryLabel} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={subCategoryId}
            onValueChange={(v) => {
              if (v) {
                setSubCategoryId(v);
                setDetailCategoryId(NO_SELECT);
              }
            }}
            disabled={loading || mainCategoryId === NO_SELECT}
          >
            <SelectTrigger
              id="product-sub-category"
              aria-required="true"
              aria-invalid={!!errors.subCategoryId}
              aria-describedby={
                errors.subCategoryId ? "product-sub-category-error" : undefined
              }
            >
              <SelectValue placeholder={mainCategoryId === NO_SELECT ? productLabels.subCategoryDisabled : productLabels.subCategoryPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT} disabled>
                {productLabels.subCategoryPlaceholder}
              </SelectItem>
              {subCategories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subCategoryId && (
            <p id="product-sub-category-error" className="text-sm text-destructive">
              {errors.subCategoryId}
            </p>
          )}
        </div>
      </div>

      {/* 소분류 / 브랜드 (옵션) */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-detail-category">{productLabels.detailCategoryLabel}</Label>
          <Select
            value={detailCategoryId}
            onValueChange={(v) => {
              if (v) setDetailCategoryId(v);
            }}
            disabled={loading || subCategoryId === NO_SELECT || detailCategories.length === 0}
          >
            <SelectTrigger id="product-detail-category">
              <SelectValue placeholder={
                subCategoryId === NO_SELECT
                  ? productLabels.detailCategoryDisabled
                  : detailCategories.length === 0
                    ? productLabels.detailCategoryEmpty
                    : productLabels.detailCategoryPlaceholder
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT}>{productLabels.noSelection}</SelectItem>
              {detailCategories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-brand">{productLabels.brandLabel}</Label>
          <Select
            value={brandId}
            onValueChange={(v) => {
              if (v) setBrandId(v);
            }}
            disabled={loading}
          >
            <SelectTrigger id="product-brand">
              <SelectValue placeholder={productLabels.brandPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT}>{productLabels.noSelection}</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 이미지 */}
      <div className="space-y-2">
        <Label>{productLabels.imageLabel}</Label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* 옵션 섹션 */}
      <Separator />

      <OptionTypeSelector
        options={options}
        onChange={setOptions}
        disabled={loading}
      />

      {options.some(
        (o) =>
          o.type === OPTION_TYPE.FIXED &&
          o.values.length > 0 &&
          o.name.trim()
      ) && (
        <>
          <OptionPriceEditor
            options={options}
            prices={optionPrices}
            onChange={(newPrices) => {
              setOptionPrices(newPrices);
              // 추가금액을 variants에 자동 반영
              setVariants((prev) =>
                prev.map((v) => {
                  let totalAdditional = 0;
                  for (const [optName, optVal] of Object.entries(
                    v.optionValues
                  )) {
                    totalAdditional += newPrices[optName]?.[optVal] || 0;
                  }
                  return { ...v, additionalPrice: totalAdditional };
                })
              );
            }}
            disabled={loading}
          />

          <OptionCombinationTable
            options={options}
            variants={variants}
            onChange={setVariants}
            disabled={loading}
          />
        </>
      )}

      {errors._form && (
        <p className="text-sm text-destructive" role="alert">
          {errors._form}
        </p>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? common.saving : isEdit ? common.edit : common.create}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
          disabled={loading}
        >
          {common.cancel}
        </Button>
      </div>
    </form>
  );
}
