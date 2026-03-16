"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { getProduct, updateProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getBrands } from "@/services/brandService";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

export default function ProductEditPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, catRes, brandRes] = await Promise.all([
          getProduct(id),
          getCategories(),
          getBrands(),
        ]);
        setProduct(productRes.data);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data: FormData) => {
    await updateProduct(id, data);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">상품을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">상품 수정</h1>
      <ProductForm
        product={product}
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
