"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { getProduct, updateProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getActiveBrands } from "@/services/brandService";
import { useProductCacheStore } from "@/stores/useProductCacheStore";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import type { ActiveBrand } from "@/types/brand";
import { common, product as productLabels } from "@/data/labels";

export default function ProductEditPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<ActiveBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 상세 페이지에서 넘긴 캐시가 있으면 API 재호출 없이 사용
        const cached = useProductCacheStore.getState().product;
        const productData =
          cached && cached.id === id
            ? cached
            : (await getProduct(id)).data;

        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getActiveBrands(),
        ]);

        setProduct(productData);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        useProductCacheStore.getState().clear();
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit: React.ComponentProps<typeof ProductForm>["onSubmit"] = async (data, thumbnail) => {
    await updateProduct(id, data, thumbnail);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{productLabels.notFound}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{productLabels.editTitle}</h1>
      <ProductForm
        product={product}
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
