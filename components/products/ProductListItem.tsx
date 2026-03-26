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
import { PRODUCT_STATUS_LABEL } from "@/data/labels";
import type { ProductSummary } from "@/types/product";
import type { ProductStatus } from "@/lib/constants";
import { product as productLabels, common } from "@/data/labels";
import { fmtNum } from "@/lib/utils";

interface ProductListItemProps {
  product: ProductSummary;
  onView: (product: ProductSummary) => void;
  onDelete: (product: ProductSummary) => void;
}

const statusVariant: Record<ProductStatus, "success" | "warning" | "destructive" | "default"> = {
  ON_SALE: "success",
  SOLD_OUT: "destructive",
  DISCONTINUED: "warning",
  DRAFT: "default",
};

export default function ProductListItem({
  product,
  onView,
  onDelete,
}: ProductListItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-md border p-4">
      {product.thumbnailUrl ? (
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="h-16 w-16 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          {productLabels.noImage}
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
          {product.discountPrice != null ? (
            <>
              <span className="text-muted-foreground/60 line-through">
                {fmtNum(product.price)}{common.currency}
              </span>
              <span>{fmtNum(product.discountPrice)}{common.currency}</span>
            </>
          ) : (
            <span>{fmtNum(product.price)}{common.currency}</span>
          )}
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
          render={<Button variant="ghost" size="icon" className="h-8 w-8" aria-label={productLabels.productMenu} />}
        >
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(product)}>
            {productLabels.menuView}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(product)}
          >
            {productLabels.menuDelete}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
