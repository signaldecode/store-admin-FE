"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable, { type Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BrandFormDialog from "@/components/brands/BrandFormDialog";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
} from "@/services/brandService";
import type { Brand, BrandFormData } from "@/types/brand";
import { brand as brandLabels, common } from "@/data/labels";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 검색
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // 필터
  type StatusFilter = "all" | "active" | "inactive";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // 페이지네이션
  const [page, setPage] = useState(1);

  // 정렬
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const sortValue = `${sort}-${order}`;
  const handleSortSelect = (value: string | null) => {
    if (!value) return;
    const [newSort, newOrder] = value.split("-") as [string, "asc" | "desc"];
    setSort(newSort);
    setOrder(newOrder);
  };

  const sortOptions = [
    { value: "createdAt-desc", label: brandLabels.sortNewest },
    { value: "createdAt-asc", label: brandLabels.sortOldest },
    { value: "name-asc", label: brandLabels.sortNameAsc },
    { value: "name-desc", label: brandLabels.sortNameDesc },
  ];

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const isActive =
        statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined;
      const res = await getBrands({
        keyword: debouncedKeyword || undefined,
        isActive,
        page,
        size: PAGE_SIZE,
        sort: sort ? `${sort},${order}` : undefined,
      });
      setBrands(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, statusFilter, page, sort, order]);

  // 검색어/필터 변경 시 페이지 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, statusFilter]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditTarget(brand);
    setFormOpen(true);
  };

  const handleSubmit = async (data: BrandFormData, logoImage?: File) => {
    if (editTarget) {
      await updateBrand(editTarget.id, data, logoImage);
    } else {
      await createBrand(data, logoImage);
    }
    await fetchBrands();
  };

  const handleToggleStatus = async (brand: Brand) => {
    const prevIsActive = brand.isActive;
    // 낙관적 업데이트
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, isActive: !prevIsActive } : b))
    );
    try {
      await toggleBrandStatus(brand.id);
    } catch {
      // 실패 시 롤백
      setBrands((prev) =>
        prev.map((b) => (b.id === brand.id ? { ...b, isActive: prevIsActive } : b))
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBrand(deleteTarget.id);
      await fetchBrands();
      setDeleteTarget(null);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Brand>[] = [
    {
      key: "logo",
      label: brandLabels.colLogo,
      className: "w-12",
      render: (brand) => (
        <button
          className="cursor-pointer"
          onClick={() => router.push(`/brands/${brand.id}`)}
        >
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={`${brand.name} 로고`}
              className="h-8 w-8 rounded object-contain"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
              {brand.name.charAt(0)}
            </div>
          )}
        </button>
      ),
    },
    {
      key: "name",
      label: brandLabels.colName,
      sortable: true,
      render: (brand) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/brands/${brand.id}`)}
        >
          {brand.name}
        </button>
      ),
    },
    {
      key: "isActive",
      label: brandLabels.colStatus,
      className: "w-20",
      render: (brand) => (
        <Switch
          checked={brand.isActive}
          onCheckedChange={() => handleToggleStatus(brand)}
          aria-label={brandLabels.statusToggleLabel(brand.name)}
        />
      ),
    },
    {
      key: "createdAt",
      label: brandLabels.colCreatedAt,
      sortable: true,
      render: (brand) => new Date(brand.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (brand) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(brand)}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(brand)}
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
        <h1 className="text-2xl font-semibold">{brandLabels.pageTitle}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {brandLabels.addButton}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={brandLabels.searchPlaceholder}
            className="pl-9"
            aria-label={brandLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          items={{
            all: brandLabels.filterAll,
            active: brandLabels.statusActive,
            inactive: brandLabels.statusInactive,
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={brandLabels.filterLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{brandLabels.filterAll}</SelectItem>
            <SelectItem value="active">{brandLabels.statusActive}</SelectItem>
            <SelectItem value="inactive">{brandLabels.statusInactive}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortValue}
          onValueChange={handleSortSelect}
          items={Object.fromEntries(sortOptions.map((o) => [o.value, o.label]))}
        >
          <SelectTrigger className="h-9 w-32" aria-label={brandLabels.sortLabel}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={brands}
            keyExtractor={(brand) => brand.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={brandLabels.emptyMessage}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {common.totalCount(total_elements)}
            </p>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <BrandFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        brand={editTarget}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={brandLabels.deleteTitle}
        description={deleteTarget ? brandLabels.deleteDescription(deleteTarget.name) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
