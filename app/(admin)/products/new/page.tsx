"use client";

import { useState, useEffect } from "react";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getBrands } from "@/services/brandService";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

export default function ProductNewPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
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

  const handleSubmit = async (data: FormData) => {
    await createProduct(data);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">상품 등록</h1>
      <ProductForm
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
