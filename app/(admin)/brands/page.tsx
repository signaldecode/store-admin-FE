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
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BrandFormDialog from "@/components/brands/BrandFormDialog";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brandService";
import type { Brand, BrandFormData } from "@/types/brand";
import { brand as brandLabels, common } from "@/data/labels";

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBrands({ sort: sort ? `${sort},${order}` : undefined, size: 100 });
      setBrands(res.data.content);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [sort, order]);

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
      render: (brand) =>
        brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={`${brand.name} 로고`}
            className="h-8 w-8 rounded object-contain"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
            {brand.name.charAt(0)}
          </div>
        ),
    },
    { key: "name", label: brandLabels.colName, sortable: true },
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
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(brand);
            }}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(brand);
            }}
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
        <div className="flex items-center gap-2">
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
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            {brandLabels.addButton}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={brands}
          keyExtractor={(brand) => brand.id}
          sort={sort}
          order={order}
          onSort={handleSort}
          onRowClick={(brand) => router.push(`/brands/${brand.id}`)}
          emptyMessage={brandLabels.emptyMessage}
        />
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
