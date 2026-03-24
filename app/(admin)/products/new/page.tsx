"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getActiveBrands } from "@/services/brandService";
import { getActiveSites } from "@/services/siteService";
import type { Category } from "@/types/category";
import type { ActiveBrand } from "@/types/brand";
import type { ActiveSite } from "@/types/site";
import { common, product } from "@/data/labels";

export default function ProductNewPage() {
  const [sites, setSites] = useState<ActiveSite[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<ActiveBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [siteRes, catRes, brandRes] = await Promise.all([
          getActiveSites(),
          getCategories(),
          getActiveBrands(),
        ]);
        setSites(siteRes.data);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit: React.ComponentProps<typeof ProductForm>["onSubmit"] = async (data, thumbnail) => {
    await createProduct(data, thumbnail);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">{product.createTitle}</h1>
      <ProductForm
        sites={sites}
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
