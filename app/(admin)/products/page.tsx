"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchFilter from "@/components/common/SearchFilter";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ProductListItem from "@/components/products/ProductListItem";
import { getProducts, deleteProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getBrands } from "@/services/brandService";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import {
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABEL,
} from "@/lib/constants";
import type { Product, ProductListParams } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";

const ALL_VALUE = "__all__";

const statusVariant: Record<ProductStatus, "success" | "warning" | "destructive"> = {
  SALE: "success",
  SOLDOUT: "warning",
  HIDDEN: "destructive",
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // 필터
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_VALUE);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL_VALUE);
  const [brandFilter, setBrandFilter] = useState<string>(ALL_VALUE);
  const debouncedKeyword = useDebounce(keyword);

  // 정렬
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // 페이지네이션
  const pagination = usePagination();

  // 삭제
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 카테고리/브랜드 목록 로드
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch {
        // api.ts에서 공통 에러 처리
      }
    };
    loadFilters();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: ProductListParams = {
        page: pagination.page,
        size: pagination.size,
        sort,
        order,
        keyword: debouncedKeyword || undefined,
        status:
          statusFilter !== ALL_VALUE
            ? (statusFilter as ProductStatus)
            : undefined,
        categoryId:
          categoryFilter !== ALL_VALUE ? Number(categoryFilter) : undefined,
        brandId:
          brandFilter !== ALL_VALUE ? Number(brandFilter) : undefined,
      };
      const res = await getProducts(params);
      setProducts(res.data);
      pagination.setTotalCount(res.pagination.totalCount);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.size,
    sort,
    order,
    debouncedKeyword,
    statusFilter,
    categoryFilter,
    brandFilter,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 필터 변경 시 1페이지로
  useEffect(() => {
    pagination.resetPage();
  }, [debouncedKeyword, statusFilter, categoryFilter, brandFilter]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      await fetchProducts();
      setDeleteTarget(null);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleView = (product: Product) =>
    router.push(`/products/${product.id}`);
  const handleEdit = (product: Product) =>
    router.push(`/products/${product.id}/edit`);

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "상품명",
      sortable: true,
      render: (p) => (
        <span className="font-medium">{p.name}</span>
      ),
    },
    {
      key: "price",
      label: "가격",
      sortable: true,
      render: (p) => `${p.price.toLocaleString("ko-KR")}원`,
    },
    {
      key: "categoryName",
      label: "카테고리",
    },
    {
      key: "brandName",
      label: "브랜드",
    },
    {
      key: "status",
      label: "상태",
      sortable: true,
      render: (p) => (
        <StatusBadge
          label={PRODUCT_STATUS_LABEL[p.status]}
          variant={statusVariant[p.status]}
        />
      ),
    },
    {
      key: "createdAt",
      label: "등록일",
      sortable: true,
      render: (p) => new Date(p.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-28",
      render: (p) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">상품 관리</h1>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          상품 등록
        </Button>
      </div>

      {/* 검색 & 필터 */}
      <SearchFilter
        value={keyword}
        onChange={setKeyword}
        placeholder="상품명으로 검색"
      >
        <Select value={statusFilter} onValueChange={(v) => { if (v) setStatusFilter(v); }}>
          <SelectTrigger className="w-32" aria-label="상태 필터">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>전체 상태</SelectItem>
            {Object.entries(PRODUCT_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={(v) => { if (v) setCategoryFilter(v); }}>
          <SelectTrigger className="w-36" aria-label="카테고리 필터">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>전체 카테고리</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={brandFilter} onValueChange={(v) => { if (v) setBrandFilter(v); }}>
          <SelectTrigger className="w-32" aria-label="브랜드 필터">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>전체 브랜드</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id.toString()}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchFilter>

      {/* 데스크톱: 테이블 */}
      <div className="hidden md:block">
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={products}
            keyExtractor={(p) => p.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            onRowClick={handleView}
            emptyMessage="등록된 상품이 없습니다."
          />
        )}
      </div>

      {/* 모바일: 카드 리스트 */}
      <div className="space-y-2 md:hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-muted-foreground">불러오는 중...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            등록된 상품이 없습니다.
          </p>
        ) : (
          products.map((p) => (
            <ProductListItem
              key={p.id}
              product={p}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.goToPage}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="상품 삭제"
        description={`"${deleteTarget?.name}" 상품을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
