"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import ImageUploader from "@/components/common/ImageUploader";
import OptionTypeSelector, {
  type OptionDraft,
} from "@/components/products/OptionTypeSelector";
import OptionCombinationTable, {
  type VariantDraft,
} from "@/components/products/OptionCombinationTable";
import OptionPriceEditor from "@/components/products/OptionPriceEditor";
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
import NumberInput from "@/components/common/NumberInput";
import { formatKoreanUnit, formatKoreanUnitShort } from "@/lib/utils";

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

/** 미선택 상태 — 빈 문자열로 통일하여 controlled 상태 유지 */
const EMPTY = "";
/** 선택 해제용 sentinel — "선택 안 함" 클릭 시 이 값이 전달되면 EMPTY로 복원 */
const CLEAR = "__clear__";

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
  const [stock, setStock] = useState("");
  const [marginPrice1, setMarginPrice1] = useState("");
  const [marginPrice2, setMarginPrice2] = useState("");
  const [status, setStatus] = useState<ProductStatus>(PRODUCT_STATUS.SALE);
  const [mainCategoryId, setMainCategoryId] = useState(EMPTY);
  const [subCategoryId, setSubCategoryId] = useState(EMPTY);
  const [detailCategoryId, setDetailCategoryId] = useState(EMPTY);
  const [brandId, setBrandId] = useState(EMPTY);

  // 카테고리 레벨별 필터링
  const mainCategories = categories.filter((c) => c.level === 1);
  const subCategories = categories.filter(
    (c) => c.level === 2 && c.parentId === (mainCategoryId ? Number(mainCategoryId) : null)
  );
  const detailCategories = categories.filter(
    (c) => c.level === 3 && c.parentId === (subCategoryId ? Number(subCategoryId) : null)
  );

  // Select items 맵 (id → name 표시용)
  const mainCategoryItems = useMemo(
    () => Object.fromEntries(mainCategories.map((c) => [c.id.toString(), c.name])),
    [mainCategories]
  );
  const subCategoryItems = useMemo(
    () => Object.fromEntries(subCategories.map((c) => [c.id.toString(), c.name])),
    [subCategories]
  );
  const detailCategoryItems = useMemo(
    () => ({
      [CLEAR]: productLabels.noSelection,
      ...Object.fromEntries(detailCategories.map((c) => [c.id.toString(), c.name])),
    }),
    [detailCategories]
  );
  const brandComboboxItems = useMemo(
    () => brands.map((b) => ({ value: b.id.toString(), label: b.name })),
    [brands]
  );
  const [brandSearch, setBrandSearch] = useState("");
  const filteredBrands = useMemo(() => {
    if (!brandSearch) return brands;
    const query = brandSearch.toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(query));
  }, [brands, brandSearch]);
  const statusItems = useMemo(
    () => PRODUCT_STATUS_LABEL as Record<string, string>,
    []
  );

  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<OptionDraft[]>([]);
  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [optionPrices, setOptionPrices] = useState<
    Record<string, Record<string, number>>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const hasOptions = options.some(
    (o) => o.type === OPTION_TYPE.FIXED && o.values.length > 0 && o.name.trim()
  );

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setMarginPrice1(product.marginPrice1?.toString() || "");
      setMarginPrice2(product.marginPrice2?.toString() || "");
      setStatus(product.status);
      setMainCategoryId(product.mainCategoryId?.toString() || EMPTY);
      setSubCategoryId(product.subCategoryId?.toString() || EMPTY);
      setDetailCategoryId(product.detailCategoryId?.toString() || EMPTY);
      setBrandId(product.brandId?.toString() || EMPTY);
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

    if (images.length === 0) newErrors.images = productLabels.imageRequired;
    if (!name.trim()) newErrors.name = productLabels.nameRequired;
    if (!mainCategoryId) newErrors.mainCategoryId = productLabels.mainCategoryRequired;
    if (!subCategoryId) newErrors.subCategoryId = productLabels.subCategoryRequired;
    if (!price || Number(price) < 0) newErrors.price = productLabels.priceRequired;
    if (stock !== "" && Number(stock) < 0) newErrors.stock = productLabels.stockRequired;

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
      formData.append("stock", hasOptions ? "0" : stock);
      if (marginPrice1) formData.append("marginPrice1", marginPrice1);
      if (marginPrice2) formData.append("marginPrice2", marginPrice2);
      formData.append("status", status);
      if (mainCategoryId) formData.append("mainCategoryId", mainCategoryId);
      if (subCategoryId) formData.append("subCategoryId", subCategoryId);
      if (detailCategoryId) formData.append("detailCategoryId", detailCategoryId);
      if (brandId) formData.append("brandId", brandId);

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

  const mainCategorySelected = !!mainCategoryId;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── 섹션 0: 대분류 선택 (최우선) ── */}
      <Card>
        <CardHeader>
          <CardTitle>{productLabels.sectionMainCategory} <span className="text-destructive">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Select
              value={mainCategoryId || null}
              onValueChange={(v) => {
                setMainCategoryId(v ?? EMPTY);
                setSubCategoryId(EMPTY);
                setDetailCategoryId(EMPTY);
              }}
              disabled={loading}
              items={mainCategoryItems}
            >
              <SelectTrigger
                id="product-main-category"
                aria-required="true"
                aria-invalid={!!errors.mainCategoryId}
                aria-describedby={
                  errors.mainCategoryId
                    ? "product-main-category-error"
                    : !mainCategorySelected
                      ? "product-main-category-hint"
                      : undefined
                }
              >
                <SelectValue placeholder={productLabels.mainCategoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
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
            {!mainCategorySelected && !errors.mainCategoryId && (
              <p id="product-main-category-hint" className="text-sm text-muted-foreground">
                {productLabels.sectionMainCategoryHint}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── 섹션 1: 기본 정보 (필수) ── */}
      <Card className={!mainCategorySelected ? "pointer-events-none opacity-50" : undefined}>
        <CardHeader>
          <CardTitle>{productLabels.sectionBasic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이미지 */}
          <div className="space-y-2">
            <Label>
              {productLabels.imageLabel} <span className="text-destructive">*</span>
            </Label>
            <ImageUploader images={images} onChange={setImages} />
            {errors.images && (
              <p className="text-sm text-destructive" role="alert">
                {errors.images}
              </p>
            )}
          </div>

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
              disabled={loading || !mainCategorySelected}
            />
            {errors.name && (
              <p id="product-name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* 중분류 (필수) */}
          <div className="space-y-2">
            <Label htmlFor="product-sub-category">
              {productLabels.subCategoryLabel} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={subCategoryId || null}
              onValueChange={(v) => {
                setSubCategoryId(v ?? EMPTY);
                setDetailCategoryId(EMPTY);
              }}
              disabled={loading || !mainCategorySelected}
              items={subCategoryItems}
            >
              <SelectTrigger
                id="product-sub-category"
                aria-required="true"
                aria-invalid={!!errors.subCategoryId}
                aria-describedby={
                  errors.subCategoryId ? "product-sub-category-error" : undefined
                }
              >
                <SelectValue placeholder={!mainCategorySelected ? productLabels.subCategoryDisabled : productLabels.subCategoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
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

          {/* 가격 / 재고 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-price">
                {productLabels.priceLabel} <span className="text-destructive">*</span>
                {price && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    {formatKoreanUnit(price)}
                  </span>
                )}
              </Label>
              <NumberInput
                id="product-price"
                value={price}
                onValueChange={setPrice}
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
              <Label htmlFor="product-stock">
                {productLabels.stockLabel}
                {stock && !hasOptions && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    {formatKoreanUnitShort(stock)}
                  </span>
                )}
              </Label>
              <NumberInput
                id="product-stock"
                value={hasOptions ? "" : stock}
                onValueChange={setStock}
                placeholder={hasOptions ? "" : productLabels.stockPlaceholder}
                aria-describedby={
                  hasOptions
                    ? "product-stock-hint"
                    : errors.stock
                      ? "product-stock-error"
                      : undefined
                }
                aria-disabled={hasOptions}
                disabled={loading || hasOptions}
              />
              {hasOptions && (
                <p id="product-stock-hint" className="text-sm text-muted-foreground">
                  {productLabels.stockDisabledHint}
                </p>
              )}
              {errors.stock && !hasOptions && (
                <p id="product-stock-error" className="text-sm text-destructive">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 섹션 2: 추가 정보 (선택) ── */}
      <Card className={!mainCategorySelected ? "pointer-events-none opacity-50" : undefined}>
        <CardHeader>
          <CardTitle>{productLabels.sectionAdditional}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 소분류 / 브랜드 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-detail-category">{productLabels.detailCategoryLabel}</Label>
              <Select
                value={detailCategoryId || null}
                onValueChange={(v) => {
                  setDetailCategoryId(!v || v === CLEAR ? EMPTY : v);
                }}
                disabled={loading || !subCategoryId || detailCategories.length === 0}
                items={detailCategoryItems}
              >
                <SelectTrigger id="product-detail-category">
                  <SelectValue placeholder={
                    !subCategoryId
                      ? productLabels.detailCategoryDisabled
                      : detailCategories.length === 0
                        ? productLabels.detailCategoryEmpty
                        : productLabels.detailCategoryPlaceholder
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAR}>{productLabels.noSelection}</SelectItem>
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
              <Combobox
                value={brandId || null}
                onValueChange={(v) => {
                  setBrandId(v ?? EMPTY);
                }}
                onInputValueChange={(inputValue) => {
                  setBrandSearch(inputValue);
                }}
                items={brandComboboxItems}
              >
                <div className="relative">
                  <ComboboxInput
                    id="product-brand"
                    placeholder={productLabels.brandSearchPlaceholder}
                    disabled={loading}
                  />
                  <ComboboxTrigger aria-label={productLabels.brandPlaceholder} />
                </div>
                <ComboboxContent>
                  {!brandSearch && (
                    <ComboboxItem value={null}>{productLabels.noSelection}</ComboboxItem>
                  )}
                  {filteredBrands.map((b) => (
                    <ComboboxItem key={b.id} value={b.id.toString()}>
                      {b.name}
                    </ComboboxItem>
                  ))}
                  {filteredBrands.length === 0 && (
                    <ComboboxEmpty>{productLabels.brandEmpty}</ComboboxEmpty>
                  )}
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {/* 마진 1 / 마진 2 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-margin-price1">
                {productLabels.marginPrice1Label}
                {marginPrice1 && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    {formatKoreanUnit(marginPrice1)}
                  </span>
                )}
              </Label>
              <NumberInput
                id="product-margin-price1"
                value={marginPrice1}
                onValueChange={setMarginPrice1}
                placeholder={productLabels.marginPrice1Placeholder}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-margin-price2">
                {productLabels.marginPrice2Label}
                {marginPrice2 && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    {formatKoreanUnit(marginPrice2)}
                  </span>
                )}
              </Label>
              <NumberInput
                id="product-margin-price2"
                value={marginPrice2}
                onValueChange={setMarginPrice2}
                placeholder={productLabels.marginPrice2Placeholder}
                disabled={loading}
              />
            </div>
          </div>

          {/* 상태 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-status">{productLabels.statusLabel}</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  if (v) setStatus(v as ProductStatus);
                }}
                disabled={loading}
                items={statusItems}
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
        </CardContent>
      </Card>

      {/* ── 섹션 3: 사용자 정의 옵션 (선택) ── */}
      <Card className={!mainCategorySelected ? "pointer-events-none opacity-50" : undefined}>
        <CardHeader>
          <CardTitle>{productLabels.sectionOptions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <OptionTypeSelector
            options={options}
            onChange={setOptions}
            disabled={loading}
          />

          {hasOptions && (
            <>
              <OptionPriceEditor
                options={options}
                prices={optionPrices}
                onChange={(newPrices) => {
                  setOptionPrices(newPrices);
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
        </CardContent>
      </Card>

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
