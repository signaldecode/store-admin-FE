"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getProduct, deleteProduct } from "@/services/productService";
import { PRODUCT_STATUS_LABEL } from "@/data/labels";
import type { Product } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import { product as productLabels, productOption, common, imageUploader } from "@/data/labels";

const statusVariant: Record<ProductStatus, "success" | "warning" | "destructive" | "default"> = {
  ON_SALE: "success",
  SOLD_OUT: "destructive",
  DISCONTINUED: "warning",
  DRAFT: "default",
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProduct(id);
        setProduct(res.data);
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProduct(id);
      router.push("/products");
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

  if (!product) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{productLabels.notFound}</p>
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
            onClick={() => router.push("/products")}
            aria-label={productLabels.backToList}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <StatusBadge
            label={PRODUCT_STATUS_LABEL[product.status]}
            variant={statusVariant[product.status]}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/products/${id}/edit`)}
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

      {/* 이미지 */}
      {product.images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {product.images.map((img, i) => (
            <img
              key={img.id}
              src={img.url}
              alt={imageUploader.altText(product.name, i)}
              className="h-32 w-32 rounded-md border object-cover"
            />
          ))}
        </div>
      )}

      {/* 상세 정보 */}
      <div className="space-y-4 rounded-md border p-4">
        <InfoRow label={productLabels.infoPrice} value={`${product.price.toLocaleString("ko-KR")}${common.currency}`} />
        {product.discountPrice != null && (
          <InfoRow label={productLabels.infoDiscountPrice} value={`${product.discountPrice.toLocaleString("ko-KR")}${common.currency}`} />
        )}
        <InfoRow label={productLabels.infoStock} value={product.stock.toLocaleString("ko-KR")} />
        {product.sku && <InfoRow label="SKU" value={product.sku} />}
        {product.marginPrice1 != null && (
          <InfoRow label={productLabels.infoMarginPrice1} value={`${product.marginPrice1.toLocaleString("ko-KR")}${common.currency}`} />
        )}
        {product.marginPrice2 != null && (
          <InfoRow label={productLabels.infoMarginPrice2} value={`${product.marginPrice2.toLocaleString("ko-KR")}${common.currency}`} />
        )}
        <InfoRow label={productLabels.infoCategory} value={product.categoryName || "-"} />
        <InfoRow label={productLabels.infoBrand} value={product.brandName || "-"} />
        {product.origin && <InfoRow label={productLabels.infoOrigin} value={product.origin} />}
        {product.material && <InfoRow label={productLabels.infoMaterial} value={product.material} />}
        {product.washingInfo && <InfoRow label={productLabels.infoWashingInfo} value={product.washingInfo} />}
        <InfoRow
          label={productLabels.infoCreatedAt}
          value={new Date(product.createdAt).toLocaleDateString("ko-KR")}
        />
        <InfoRow
          label={productLabels.infoUpdatedAt}
          value={new Date(product.updatedAt).toLocaleDateString("ko-KR")}
        />
      </div>

      {/* 설명 */}
      {product.description && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">{productLabels.descriptionHeading}</h2>
          <p className="whitespace-pre-wrap text-sm">{product.description}</p>
        </div>
      )}

      {/* 옵션 정보 */}
      {product.options.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">{productOption.detailHeading}</h2>
            {product.options.map((opt) => (
              <div key={opt.id} className="space-y-1">
                <span className="text-sm font-medium">{opt.optionName}</span>
                {opt.values.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {opt.values.map((v) => (
                      <Badge key={v.id} variant="secondary">
                        {v.value}
                        {v.extraPrice > 0 && ` +${v.extraPrice.toLocaleString("ko-KR")}${common.currency}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* SKU 테이블 */}
      {product.skus.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            {productOption.variantHeading}
          </h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{productOption.variantColCombo}</TableHead>
                  <TableHead className="w-28">{productOption.variantColSku}</TableHead>
                  <TableHead className="w-20">{productOption.variantColStock}</TableHead>
                  <TableHead className="w-28">{productOption.variantColPrice}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.skus.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {Object.entries(s.optionValues)
                        .map(([k, val]) => `${k}: ${val}`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{s.sku || "-"}</TableCell>
                    <TableCell>{s.stock}</TableCell>
                    <TableCell>
                      {s.extraPrice > 0
                        ? `+${s.extraPrice.toLocaleString("ko-KR")}${common.currency}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={productLabels.deleteTitle}
        description={productLabels.deleteDescription(product.name)}
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
