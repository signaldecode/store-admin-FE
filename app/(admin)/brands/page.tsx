"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBrands();
      setBrands(res.data);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleSubmit = async (data: BrandFormData) => {
    if (editTarget) {
      await updateBrand(editTarget.id, data);
    } else {
      await createBrand(data);
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
    { key: "name", label: "브랜드명", sortable: true },
    {
      key: "createdAt",
      label: "등록일",
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
            수정
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
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">브랜드 관리</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          브랜드 추가
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={brands}
          keyExtractor={(brand) => brand.id}
          emptyMessage="등록된 브랜드가 없습니다."
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
        title="브랜드 삭제"
        description={`"${deleteTarget?.name}" 브랜드를 삭제하시겠습니까? 해당 브랜드를 사용 중인 상품이 있을 수 있습니다.`}
        confirmLabel="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
