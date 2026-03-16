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
import { PRODUCT_STATUS_LABEL, OPTION_TYPE_LABEL } from "@/lib/constants";
import type { Product } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";

const statusVariant: Record<ProductStatus, "success" | "warning" | "destructive"> = {
  SALE: "success",
  SOLDOUT: "warning",
  HIDDEN: "destructive",
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
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/products")}
            aria-label="목록으로"
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
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            삭제
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
              alt={`${product.name} 이미지 ${i + 1}`}
              className="h-32 w-32 rounded-md border object-cover"
            />
          ))}
        </div>
      )}

      {/* 상세 정보 */}
      <div className="space-y-4 rounded-md border p-4">
        <InfoRow label="가격" value={`${product.price.toLocaleString("ko-KR")}원`} />
        <InfoRow label="카테고리" value={product.categoryName || "-"} />
        <InfoRow label="브랜드" value={product.brandName || "-"} />
        <InfoRow
          label="등록일"
          value={new Date(product.createdAt).toLocaleDateString("ko-KR")}
        />
        <InfoRow
          label="수정일"
          value={new Date(product.updatedAt).toLocaleDateString("ko-KR")}
        />
      </div>

      {/* 설명 */}
      {product.description && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">상품 설명</h2>
          <p className="whitespace-pre-wrap text-sm">{product.description}</p>
        </div>
      )}

      {/* 옵션 정보 */}
      {product.options.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">상품 옵션</h2>
            {product.options.map((opt) => (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{opt.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {OPTION_TYPE_LABEL[opt.type]}
                  </Badge>
                </div>
                {opt.values.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {opt.values.map((val) => (
                      <Badge key={val} variant="secondary">
                        {val}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Variant 테이블 */}
      {product.variants.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">
            옵션 조합별 재고/가격
          </h2>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>옵션 조합</TableHead>
                  <TableHead className="w-28">SKU</TableHead>
                  <TableHead className="w-20">재고</TableHead>
                  <TableHead className="w-28">추가금액</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      {Object.entries(v.optionValues)
                        .map(([k, val]) => `${k}: ${val}`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{v.sku || "-"}</TableCell>
                    <TableCell>{v.stock}</TableCell>
                    <TableCell>
                      {v.additionalPrice > 0
                        ? `+${v.additionalPrice.toLocaleString("ko-KR")}원`
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
        title="상품 삭제"
        description={`"${product.name}" 상품을 삭제하시겠습니까?`}
        confirmLabel="삭제"
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
