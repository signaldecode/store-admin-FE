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
  PRODUCT_STATUS_LABEL,
  OPTION_TYPE,
} from "@/lib/constants";
import type { Product } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import type { ApiError } from "@/types/api";

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
  const [categoryId, setCategoryId] = useState<string>(NO_SELECT);
  const [brandId, setBrandId] = useState<string>(NO_SELECT);
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
      setCategoryId(product.categoryId?.toString() || NO_SELECT);
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

    if (!name.trim()) newErrors.name = "상품명을 입력해주세요.";
    if (!price || Number(price) < 0) newErrors.price = "올바른 가격을 입력해주세요.";
    if (categoryId === NO_SELECT) newErrors.categoryId = "카테고리를 선택해주세요.";
    if (brandId === NO_SELECT) newErrors.brandId = "브랜드를 선택해주세요.";

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
      formData.append("categoryId", categoryId);
      formData.append("brandId", brandId);

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
        setErrors({ _form: apiError.message || "저장에 실패했습니다." });
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
          상품명 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="product-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="상품명을 입력하세요"
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
        <Label htmlFor="product-description">상품 설명</Label>
        <Textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="상품 설명을 입력하세요"
          rows={5}
          disabled={loading}
        />
      </div>

      {/* 가격 / 상태 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-price">
            가격 (원) <span className="text-destructive">*</span>
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
          <Label htmlFor="product-status">상태</Label>
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

      {/* 카테고리 / 브랜드 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-category">
            카테고리 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={categoryId}
            onValueChange={(v) => {
              if (v) setCategoryId(v);
            }}
            disabled={loading}
          >
            <SelectTrigger
              id="product-category"
              aria-required="true"
              aria-invalid={!!errors.categoryId}
              aria-describedby={
                errors.categoryId ? "product-category-error" : undefined
              }
            >
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT} disabled>
                카테고리 선택
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p
              id="product-category-error"
              className="text-sm text-destructive"
            >
              {errors.categoryId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-brand">
            브랜드 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={brandId}
            onValueChange={(v) => {
              if (v) setBrandId(v);
            }}
            disabled={loading}
          >
            <SelectTrigger
              id="product-brand"
              aria-required="true"
              aria-invalid={!!errors.brandId}
              aria-describedby={
                errors.brandId ? "product-brand-error" : undefined
              }
            >
              <SelectValue placeholder="브랜드 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SELECT} disabled>
                브랜드 선택
              </SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.brandId && (
            <p id="product-brand-error" className="text-sm text-destructive">
              {errors.brandId}
            </p>
          )}
        </div>
      </div>

      {/* 이미지 */}
      <div className="space-y-2">
        <Label>상품 이미지</Label>
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
          {loading ? "저장 중..." : isEdit ? "수정" : "등록"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
          disabled={loading}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
