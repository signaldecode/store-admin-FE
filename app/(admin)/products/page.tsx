"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List, SlidersHorizontal, X, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import type { Product, ProductListParams } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import { product, common, pagination as paginationLabels, PRODUCT_STATUS_LABEL } from "@/data/labels";

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

  // 뷰 모드
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // 필터
  const [keyword, setKeyword] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [mainCategoryFilter, setMainCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [detailCategoryFilter, setDetailCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const mainCategories = categories.filter((c) => c.level === 1);
  const selectedMainCat = mainCategories.find((c) => c.name === mainCategoryFilter);
  const subCategoriesForFilter = categories.filter(
    (c) => c.level === 2 && (!mainCategoryFilter || c.parentId === selectedMainCat?.id)
  );
  const selectedSubCat = subCategoriesForFilter.find((c) => c.name === subCategoryFilter);
  const detailCategoriesForFilter = categories.filter(
    (c) => c.level === 3 && (!subCategoryFilter || c.parentId === selectedSubCat?.id)
  );
  const selectedDetailCat = detailCategoriesForFilter.find((c) => c.name === detailCategoryFilter);
  const selectedBrand = brands.find((b) => b.name === brandFilter);
  const sortedBrands = [...brands].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const previewBrands = sortedBrands.slice(0, 10);
  const hasMoreBrands = sortedBrands.length > 10;
  const brandFilterInPreview = !brandFilter || previewBrands.some((b) => b.name === brandFilter);
  const filteredBrandsForDialog = sortedBrands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const debouncedKeyword = useDebounce(keyword);

  const activeFilterCount = [statusFilter, mainCategoryFilter, subCategoryFilter, detailCategoryFilter, brandFilter].filter(Boolean).length;

  const resetFilters = () => {
    setStatusFilter("");
    setMainCategoryFilter("");
    setSubCategoryFilter("");
    setDetailCategoryFilter("");
    setBrandFilter("");
  };

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
        status: statusFilter ? (statusFilter as ProductStatus) : undefined,
        mainCategoryId: selectedMainCat?.id,
        subCategoryId: selectedSubCat?.id,
        detailCategoryId: selectedDetailCat?.id,
        brandId: selectedBrand?.id,
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
    mainCategoryFilter,
    subCategoryFilter,
    detailCategoryFilter,
    brandFilter,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 필터 변경 시 1페이지로
  useEffect(() => {
    pagination.resetPage();
  }, [debouncedKeyword, statusFilter, mainCategoryFilter, subCategoryFilter, detailCategoryFilter, brandFilter]);

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
      key: "image",
      label: product.colImage,
      className: "w-12",
      render: (p) =>
        p.images[0] ? (
          <img
            src={p.images[0].url}
            alt={p.name}
            className="h-10 w-10 object-contain"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center bg-muted text-[10px] text-muted-foreground">
            {product.noImage}
          </div>
        ),
    },
    {
      key: "name",
      label: product.colName,
      sortable: true,
      render: (p) => (
        <span className="font-medium">{p.name}</span>
      ),
    },
    {
      key: "price",
      label: product.colPrice,
      sortable: true,
      render: (p) => `${p.price.toLocaleString("ko-KR")}${common.currency}`,
    },
    {
      key: "category",
      label: product.colCategory,
      render: (p) => (
        <span className="text-sm">
          {p.mainCategoryName} &gt; {p.subCategoryName}
          {p.detailCategoryName && ` > ${p.detailCategoryName}`}
        </span>
      ),
    },
    {
      key: "brandName",
      label: product.colBrand,
      render: (p) => <span>{p.brandName || "-"}</span>,
    },
    {
      key: "status",
      label: product.colStatus,
      render: (p) => (
        <StatusBadge
          label={PRODUCT_STATUS_LABEL[p.status]}
          variant={statusVariant[p.status]}
        />
      ),
    },
    {
      key: "createdAt",
      label: product.colCreatedAt,
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
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
          >
            {common.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{product.pageTitle}</h1>
        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-md border md:flex">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => setViewMode("list")}
              aria-label={product.listView}
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => setViewMode("card")}
              aria-label={product.cardView}
              aria-pressed={viewMode === "card"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => router.push("/products/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {product.addButton}
          </Button>
        </div>
      </div>

      {/* 검색 & 필터 토글 */}
      <SearchFilter
        value={keyword}
        onChange={setKeyword}
        placeholder={product.searchPlaceholder}
      >
        <Button
          variant={filterOpen ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-expanded={filterOpen}
          aria-label={filterOpen ? product.filterClose : product.filterOpen}
        >
          <SlidersHorizontal className="mr-1.5 h-4 w-4" />
          {product.filterToggle}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SearchFilter>

      {/* 필터 패널 */}
      {filterOpen && (
        <div className="space-y-3 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{product.filterToggle}</span>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="mr-1 h-3 w-3" />
                {product.filterReset}
              </Button>
            )}
          </div>

          {/* 상태 */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">{product.filterStatusGroup}</span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRODUCT_STATUS_LABEL).map(([value, label]) => (
                <Button
                  key={value}
                  variant={statusFilter === value ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setStatusFilter(statusFilter === value ? "" : value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* 대분류 */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">{product.filterMainCategoryGroup}</span>
            <div className="flex flex-wrap gap-1.5">
              {mainCategories.map((c) => (
                <Button
                  key={c.id}
                  variant={mainCategoryFilter === c.name ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setMainCategoryFilter(mainCategoryFilter === c.name ? "" : c.name);
                    setSubCategoryFilter("");
                    setDetailCategoryFilter("");
                  }}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          {/* 중분류 (대분류 선택 시) */}
          {mainCategoryFilter && subCategoriesForFilter.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{product.filterSubCategoryGroup}</span>
              <div className="flex flex-wrap gap-1.5">
                {subCategoriesForFilter.map((c) => (
                  <Button
                    key={c.id}
                    variant={subCategoryFilter === c.name ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setSubCategoryFilter(subCategoryFilter === c.name ? "" : c.name);
                      setDetailCategoryFilter("");
                    }}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 소분류 (중분류 선택 시) */}
          {subCategoryFilter && detailCategoriesForFilter.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{product.filterDetailCategoryGroup}</span>
              <div className="flex flex-wrap gap-1.5">
                {detailCategoriesForFilter.map((c) => (
                  <Button
                    key={c.id}
                    variant={detailCategoryFilter === c.name ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setDetailCategoryFilter(detailCategoryFilter === c.name ? "" : c.name)}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 브랜드 */}
          {brands.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">{product.filterBrandGroup}</span>
              <div className="flex flex-wrap gap-1.5">
                {!brandFilterInPreview && (
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setBrandFilter("")}
                  >
                    {brandFilter}
                    <X className="ml-1 h-3 w-3" />
                  </Button>
                )}
                {previewBrands.map((b) => (
                  <Button
                    key={b.id}
                    variant={brandFilter === b.name ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setBrandFilter(brandFilter === b.name ? "" : b.name)}
                  >
                    {b.name}
                  </Button>
                ))}
                {hasMoreBrands && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setBrandSearch("");
                      setBrandDialogOpen(true);
                    }}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {product.filterBrandMore}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <>
          {/* 데스크톱: 리스트형 */}
          {viewMode === "list" && (
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={products}
                keyExtractor={(p) => p.id}
                sort={sort}
                order={order}
                onSort={handleSort}
                onRowClick={handleView}
                emptyMessage={product.emptyMessage}
              />
            </div>
          )}

          {/* 데스크톱: 카드형 */}
          {viewMode === "card" && (
            <div className="hidden md:block">
              {products.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  {product.emptyMessage}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((p) => (
                    <ProductListItem
                      key={p.id}
                      product={p}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 모바일: 항상 카드형 */}
          <div className="space-y-2 md:hidden">
            {products.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                {product.emptyMessage}
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
        </>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{common.perPage}</span>
          <Select
            value={pagination.size.toString()}
            onValueChange={(v) => {
              if (v) {
                pagination.setSize(Number(v));
                pagination.resetPage();
              }
            }}
            items={Object.fromEntries(PAGE_SIZE_OPTIONS.map((s) => [s.toString(), common.itemUnit(s)]))}
          >
            <SelectTrigger className="h-8 w-20" aria-label={paginationLabels.pageSizeLabel}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {common.itemUnit(size)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {pagination.totalCount > 0 && (
            <span>{common.totalCount(pagination.totalCount)}</span>
          )}
        </div>
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={product.deleteTitle}
        description={deleteTarget ? product.deleteDescription(deleteTarget.name) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />

      {/* 브랜드 선택 Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={setBrandDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{product.filterBrandDialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder={product.filterBrandSearchPlaceholder}
              className="pl-9"
              autoFocus
            />
          </div>
          <ul className="max-h-64 space-y-0.5 overflow-y-auto" role="listbox" aria-label={product.filterBrandDialogTitle}>
            {filteredBrandsForDialog.length === 0 ? (
              <li className="py-6 text-center text-sm text-muted-foreground">
                {product.filterBrandEmpty}
              </li>
            ) : (
              filteredBrandsForDialog.map((b) => (
                <li key={b.id} role="option" aria-selected={brandFilter === b.name}>
                  <button
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      setBrandFilter(brandFilter === b.name ? "" : b.name);
                      setBrandDialogOpen(false);
                    }}
                  >
                    <span>{b.name}</span>
                    {brandFilter === b.name && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}