"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/common/RichTextEditor";
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
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/common/ImageUploader";
import OptionTypeSelector, {
  type OptionDraft,
} from "@/components/products/OptionTypeSelector";
import OptionCombinationTable, {
  type VariantDraft,
} from "@/components/products/OptionCombinationTable";
import OptionPriceEditor from "@/components/products/OptionPriceEditor";
import { PRODUCT_STATUS, OPTION_TYPE } from "@/lib/constants";
import type { Product, ProductFormData, ProductOptionInput, ProductSkuInput } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { ActiveBrand } from "@/types/brand";
import type { ActiveSite } from "@/types/site";
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
  sites: ActiveSite[];
  categories: Category[];
  brands: ActiveBrand[];
  onSubmit: (data: ProductFormData, thumbnail?: File) => Promise<void>;
}

const EMPTY = "";

export default function ProductForm({
  product,
  sites,
  categories,
  brands,
  onSubmit,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [marginPrice1, setMarginPrice1] = useState("");
  const [marginPrice2, setMarginPrice2] = useState("");
  const [status, setStatus] = useState<ProductStatus>(PRODUCT_STATUS.ON_SALE);
  const [isVisible, setIsVisible] = useState(true);
  const [siteId, setSiteId] = useState(EMPTY);
  const [mainCategoryId, setMainCategoryId] = useState(EMPTY);
  const [midCategoryId, setMidCategoryId] = useState(EMPTY);
  const [detailCategoryId, setDetailCategoryId] = useState(EMPTY);
  const [brandId, setBrandId] = useState(EMPTY);
  const [brandName, setBrandName] = useState("");

  // 사이트 선택 → 대분류 필터
  const siteItems = useMemo(
    () => Object.fromEntries(sites.map((s) => [s.id.toString(), s.name])),
    [sites]
  );
  const mainCategories = useMemo(() => {
    if (!siteId) return [];
    return categories.filter((c) => c.siteId?.toString() === siteId);
  }, [categories, siteId]);
  const mainCategoryItems = useMemo(
    () => Object.fromEntries(mainCategories.map((c) => [c.id.toString(), c.name])),
    [mainCategories]
  );

  // 대분류 → 중분류
  const midCategories = useMemo(() => {
    const main = mainCategories.find((c) => c.id.toString() === mainCategoryId);
    return main?.children ?? [];
  }, [mainCategories, mainCategoryId]);
  const midCategoryItems = useMemo(
    () => Object.fromEntries(midCategories.map((c) => [c.id.toString(), c.name])),
    [midCategories]
  );

  // 중분류 → 소분류
  const detailCategories = useMemo(() => {
    const mid = midCategories.find((c) => c.id.toString() === midCategoryId);
    return mid?.children ?? [];
  }, [midCategories, midCategoryId]);
  const detailCategoryItems = useMemo(
    () => Object.fromEntries(detailCategories.map((c) => [c.id.toString(), c.name])),
    [detailCategories]
  );
  const brandComboboxItems = useMemo(
    () => brands.map((b) => ({ value: b.name, label: b.name })),
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

  const [thumbnail, setThumbnail] = useState<ImageFile[]>([]);
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

  const siteSelected = !!siteId;

  // 수정 모드: 기존 데이터 채우기
  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku || "");
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setDiscountPrice(product.discountPrice?.toString() || "");
      setStock(product.stock.toString());
      setMarginPrice1(product.marginPrice1?.toString() || "");
      setMarginPrice2(product.marginPrice2?.toString() || "");
      setStatus(product.status);
      setIsVisible(product.isVisible);
      setBrandId(product.brandId?.toString() || EMPTY);
      const matchedBrand = brands.find((b) => b.id === product.brandId);
      setBrandName(matchedBrand?.name || "");
      const thumbImg = product.images.find((img) => img.isThumbnail);
      if (thumbImg) setThumbnail([{ url: thumbImg.url }]);

      // 카테고리: 트리에서 해당 categoryId 찾기 (사이트 → 대분류 → 중분류 → 소분류)
      if (product.categoryId) {
        for (const main of categories) {
          // 대분류 자체가 선택된 경우
          if (main.id === product.categoryId) {
            if (main.siteId) setSiteId(main.siteId.toString());
            setMainCategoryId(main.id.toString());
            break;
          }
          // 중분류에서 찾기
          for (const mid of main.children ?? []) {
            if (mid.id === product.categoryId) {
              if (main.siteId) setSiteId(main.siteId.toString());
              setMainCategoryId(main.id.toString());
              setMidCategoryId(mid.id.toString());
              break;
            }
            // 소분류에서 찾기
            const detail = mid.children?.find((d) => d.id === product.categoryId);
            if (detail) {
              if (main.siteId) setSiteId(main.siteId.toString());
              setMainCategoryId(main.id.toString());
              setMidCategoryId(mid.id.toString());
              setDetailCategoryId(detail.id.toString());
              break;
            }
          }
        }
      }

      if (product.options.length > 0) {
        setOptions(
          product.options.map((o) => ({
            name: o.optionName,
            type: "FIXED" as const,
            values: o.values.map((v) => v.value),
          }))
        );
      }
      if (product.skus.length > 0) {
        setVariants(
          product.skus.map((s) => ({
            optionValues: s.optionValues,
            sku: s.sku,
            stock: s.stock,
            additionalPrice: s.extraPrice,
          }))
        );
      }
    }
  }, [product, categories, brands]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = productLabels.nameRequired;
    if (!siteId) newErrors.siteId = productLabels.siteRequired;
    if (!mainCategoryId) newErrors.mainCategoryId = productLabels.mainCategoryRequired;
    if (!price || Number(price) < 0) newErrors.price = productLabels.priceRequired;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // 카테고리: 가장 하위 선택된 분류 ID 사용
      const categoryId = detailCategoryId
        ? Number(detailCategoryId)
        : midCategoryId
          ? Number(midCategoryId)
          : Number(mainCategoryId);

      const formData: ProductFormData = {
        categoryId,
        name: name.trim(),
        price: Number(price),
        status,
        isVisible,
        hasOption: hasOptions,
      };

      if (brandId) formData.brandId = Number(brandId);
      if (sku.trim()) formData.sku = sku.trim();
      if (description.trim()) formData.description = description.trim();
      if (discountPrice) formData.discountPrice = Number(discountPrice);
      if (marginPrice1) formData.marginPrice1 = Number(marginPrice1);
      if (marginPrice2) formData.marginPrice2 = Number(marginPrice2);
      if (!hasOptions && stock) formData.stock = Number(stock);

      // 옵션
      if (hasOptions) {
        const optionInputs: ProductOptionInput[] = options
          .filter((o) => o.name.trim() && o.values.length > 0)
          .map((o, i) => ({
            optionName: o.name.trim(),
            sortOrder: i + 1,
            values: o.values.map((v) => ({ value: v })),
          }));
        formData.options = optionInputs;

        if (variants.length > 0) {
          const skuInputs: ProductSkuInput[] = variants.map((v) => ({
            skuCode: v.sku || "",
            stock: v.stock,
            optionValues: Object.values(v.optionValues),
          }));
          formData.skus = skuInputs;
        }
      }

      const thumbFile = thumbnail[0]?.file;
      await onSubmit(formData, thumbFile);
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
      {/* ── 섹션 0: 사이트 선택 ── */}
      <Card>
        <CardHeader>
          <CardTitle>{productLabels.sectionSite} <span className="text-destructive">*</span></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Select
              value={siteId || null}
              onValueChange={(v) => {
                setSiteId(v ?? EMPTY);
                setMainCategoryId(EMPTY);
                setMidCategoryId(EMPTY);
                setDetailCategoryId(EMPTY);
              }}
              disabled={loading}
              items={siteItems}
            >
              <SelectTrigger
                id="product-site"
                aria-required="true"
                aria-invalid={!!errors.siteId}
                aria-describedby={
                  errors.siteId
                    ? "product-site-error"
                    : !siteSelected
                      ? "product-site-hint"
                      : undefined
                }
              >
                <SelectValue placeholder={productLabels.sitePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {sites.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.siteId && (
              <p id="product-site-error" className="text-sm text-destructive">
                {errors.siteId}
              </p>
            )}
            {!siteSelected && !errors.siteId && (
              <p id="product-site-hint" className="text-sm text-muted-foreground">
                {productLabels.sectionSiteHint}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── 섹션 1: 기본 정보 ── */}
      <Card className={!siteSelected ? "pointer-events-none opacity-50" : undefined}>
        <CardHeader>
          <CardTitle>{productLabels.sectionBasic}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 대표 이미지 */}
          <div className="space-y-2">
            <Label>{productLabels.thumbnailLabel} <span className="text-destructive">*</span></Label>
            <p className="text-xs text-muted-foreground">{productLabels.thumbnailHint}</p>
            <ImageUploader images={thumbnail} onChange={setThumbnail} maxCount={1} maxSizeMB={1} />
            {errors.thumbnail && (
              <p className="text-sm text-destructive" role="alert">
                {errors.thumbnail}
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
              disabled={loading || !siteSelected}
            />
            {errors.name && (
              <p id="product-name-error" className="text-sm text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* SKU */}
          <div className="space-y-2">
            <Label htmlFor="product-sku">SKU</Label>
            <Input
              id="product-sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU-001"
              disabled={loading || !siteSelected}
            />
          </div>

          {/* 대분류 */}
          <div className="space-y-2">
            <Label htmlFor="product-main-category">
              {productLabels.mainCategoryLabel} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={mainCategoryId || null}
              onValueChange={(v) => {
                setMainCategoryId(v ?? EMPTY);
                setMidCategoryId(EMPTY);
                setDetailCategoryId(EMPTY);
              }}
              disabled={loading || !siteSelected}
              items={mainCategoryItems}
            >
              <SelectTrigger
                id="product-main-category"
                aria-required="true"
                aria-invalid={!!errors.mainCategoryId}
                aria-describedby={errors.mainCategoryId ? "product-main-category-error" : undefined}
              >
                <SelectValue placeholder={!siteSelected ? productLabels.sectionSiteHint : productLabels.mainCategoryPlaceholder} />
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
          </div>

          {/* 중분류 */}
          {midCategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="product-mid-category">
                {productLabels.subCategoryLabel}
              </Label>
              <Select
                value={midCategoryId || null}
                onValueChange={(v) => {
                  setMidCategoryId(v ?? EMPTY);
                  setDetailCategoryId(EMPTY);
                }}
                disabled={loading || !mainCategoryId}
                items={midCategoryItems}
              >
                <SelectTrigger id="product-mid-category">
                  <SelectValue placeholder={productLabels.subCategoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {midCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 소분류 */}
          {detailCategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="product-detail-category">
                {productLabels.detailCategoryLabel}
              </Label>
              <Select
                value={detailCategoryId || null}
                onValueChange={(v) => setDetailCategoryId(v ?? EMPTY)}
                disabled={loading || !midCategoryId}
                items={detailCategoryItems}
              >
                <SelectTrigger id="product-detail-category">
                  <SelectValue placeholder={productLabels.detailCategoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {detailCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                aria-describedby={hasOptions ? "product-stock-hint" : errors.stock ? "product-stock-error" : undefined}
                disabled={loading || hasOptions}
              />
              {hasOptions && (
                <p id="product-stock-hint" className="text-sm text-muted-foreground">
                  {productLabels.stockDisabledHint}
                </p>
              )}
            </div>
          </div>

          {/* 할인가 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-discount-price">
                {productLabels.discountPriceLabel}
                {discountPrice && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    {formatKoreanUnit(discountPrice)}
                  </span>
                )}
              </Label>
              <NumberInput
                id="product-discount-price"
                value={discountPrice}
                onValueChange={setDiscountPrice}
                placeholder={productLabels.discountValuePlaceholder}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 섹션 2: 추가 정보 ── */}
      <Card className={!siteSelected ? "pointer-events-none opacity-50" : undefined}>
        <CardHeader>
          <CardTitle>{productLabels.sectionAdditional}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 브랜드 */}
          <div className="space-y-2">
            <Label htmlFor="product-brand">{productLabels.brandLabel}</Label>
            <Combobox
              value={brandName || null}
              onValueChange={(v) => {
                const selected = brands.find((b) => b.name === v);
                setBrandId(selected ? selected.id.toString() : EMPTY);
                setBrandName(v ?? "");
              }}
              onInputValueChange={(inputValue) => setBrandSearch(inputValue)}
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
                  <ComboboxItem key={b.id} value={b.name}>
                    {b.name}
                  </ComboboxItem>
                ))}
                {filteredBrands.length === 0 && (
                  <ComboboxEmpty>{productLabels.brandEmpty}</ComboboxEmpty>
                )}
              </ComboboxContent>
            </Combobox>
          </div>

          {/* 마진 */}
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

          {/* 상태 / 노출 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-status">{productLabels.statusLabel}</Label>
              <Select
                value={status}
                onValueChange={(v) => { if (v) setStatus(v as ProductStatus); }}
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
            <div className="space-y-2">
              <Label htmlFor="product-visible">{productLabels.visibleLabel}</Label>
              <div className="flex h-9 items-center">
                <Switch
                  id="product-visible"
                  checked={isVisible}
                  onCheckedChange={setIsVisible}
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  {isVisible ? "노출" : "숨김"}
                </span>
              </div>
            </div>
          </div>

          {/* 설명 (리치 텍스트 에디터) */}
          <div className="space-y-2">
            <Label className="whitespace-pre-line">{productLabels.descriptionLabel}</Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder={productLabels.descriptionPlaceholder}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── 섹션 3: 옵션 ── */}
      <Card className={!siteSelected ? "pointer-events-none opacity-50" : undefined}>
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
                      for (const [optName, optVal] of Object.entries(v.optionValues)) {
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
