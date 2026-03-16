"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/common/StatusBadge";
import { PRODUCT_STATUS_LABEL } from "@/lib/constants";
import type { Product } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";

interface ProductListItemProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const statusVariant: Record<ProductStatus, "success" | "warning" | "destructive"> = {
  SALE: "success",
  SOLDOUT: "warning",
  HIDDEN: "destructive",
};

export default function ProductListItem({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductListItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-md border p-4">
      {product.images[0] ? (
        <img
          src={product.images[0].url}
          alt={product.name}
          className="h-16 w-16 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          No IMG
        </div>
      )}

      <div className="min-w-0 flex-1">
        <button
          className="truncate text-sm font-medium hover:underline"
          onClick={() => onView(product)}
        >
          {product.name}
        </button>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{product.price.toLocaleString("ko-KR")}원</span>
          {product.categoryName && <span>{product.categoryName}</span>}
          {product.brandName && <span>{product.brandName}</span>}
        </div>
      </div>

      <StatusBadge
        label={PRODUCT_STATUS_LABEL[product.status]}
        variant={statusVariant[product.status]}
      />

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="h-8 w-8" aria-label="상품 메뉴" />}
        >
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(product)}>
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(product)}>
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(product)}
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
