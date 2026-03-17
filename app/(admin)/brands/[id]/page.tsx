"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import BrandFormDialog from "@/components/brands/BrandFormDialog";
import { getBrand, updateBrand, deleteBrand } from "@/services/brandService";
import type { Brand, BrandFormData } from "@/types/brand";
import { brand as brandLabels, common } from "@/data/labels";

export default function BrandDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBrand(id);
        setBrand(res.data);
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (data: BrandFormData) => {
    await updateBrand(id, data);
    const res = await getBrand(id);
    setBrand(res.data);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBrand(id);
      router.push("/brands");
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{brandLabels.notFound}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/brands")}
            aria-label={brandLabels.backToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">{brand.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="mr-1 h-4 w-4" />
            {common.edit}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {common.delete}
          </Button>
        </div>
      </div>

      {/* 로고 */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          {brandLabels.infoLogo}
        </h2>
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={`${brand.name} 로고`}
            className="h-24 w-24 rounded-md border object-contain p-2"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md border bg-muted text-2xl font-semibold text-muted-foreground">
            {brand.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 상세 정보 */}
      <div className="space-y-4 rounded-md border p-4">
        <InfoRow label={brandLabels.infoName} value={brand.name} />
        <InfoRow
          label={brandLabels.infoCreatedAt}
          value={new Date(brand.createdAt).toLocaleDateString("ko-KR")}
        />
        <InfoRow
          label={brandLabels.infoUpdatedAt}
          value={new Date(brand.updatedAt).toLocaleDateString("ko-KR")}
        />
      </div>

      {/* 설명 */}
      {brand.description && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            {brandLabels.infoDescription}
          </h2>
          <p className="whitespace-pre-wrap text-sm">{brand.description}</p>
        </div>
      )}

      <BrandFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        brand={brand}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={brandLabels.deleteTitle}
        description={brandLabels.deleteDescription(brand.name)}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
