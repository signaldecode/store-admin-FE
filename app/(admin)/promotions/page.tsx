"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable, { type Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { getPromotions } from "@/services/promotionService";
import type { Promotion } from "@/types/promotion";
import { promotion as promotionLabels, common, COUPON_DISCOUNT_TYPE_LABEL } from "@/data/labels";
import { useDebounce } from "@/hooks/useDebounce";
import SiteSelect from "@/components/common/SiteSelect";

const PAGE_SIZE = 10;

export default function PromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  const [siteId, setSiteId] = useState<number | null>(null);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  type ActiveFilter = "all" | "active" | "inactive";
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    try {
      const isActive =
        activeFilter === "active" ? true : activeFilter === "inactive" ? false : undefined;
      const res = await getPromotions({
        tenantId: siteId ?? undefined,
        keyword: debouncedKeyword || undefined,
        isActive,
        page,
        size: PAGE_SIZE,
      });
      setPromotions(res.data?.content ?? []);
      setTotalElements(res.data?.total_elements ?? 0);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [siteId, debouncedKeyword, activeFilter, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [siteId, debouncedKeyword, activeFilter]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const columns: Column<Promotion>[] = [
    {
      key: "name",
      label: promotionLabels.colName,
      sortable: true,
      render: (item) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/promotions/${item.id}/edit`)}
        >
          {item.name}
        </button>
      ),
    },
    {
      key: "discountType",
      label: promotionLabels.colDiscountType,
      render: (item) => COUPON_DISCOUNT_TYPE_LABEL[item.discountType],
    },
    {
      key: "discountValue",
      label: promotionLabels.colDiscountValue,
      render: (item) =>
        item.discountType === "RATE"
          ? `${item.discountValue}%`
          : `${(item.discountValue ?? 0).toLocaleString("ko-KR")}${common.currency}`,
    },
    {
      key: "period",
      label: promotionLabels.colPeriod,
      render: (item) => {
        const start = new Date(item.startedAt).toLocaleDateString("ko-KR");
        const end = item.endedAt ? new Date(item.endedAt).toLocaleDateString("ko-KR") : "-";
        return `${start} ~ ${end}`;
      },
    },
    {
      key: "isActive",
      label: promotionLabels.colStatus,
      className: "w-20",
      render: (item) => (
        <Badge variant={item.isActive ? "default" : "secondary"}>
          {item.isActive ? "활성" : "비활성"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: promotionLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{promotionLabels.pageTitle}</h1>
        <Button onClick={() => router.push("/promotions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {promotionLabels.addButton}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={promotionLabels.searchPlaceholder}
            className="pl-9"
            aria-label={promotionLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as ActiveFilter)}
        >
          <SelectTrigger className="h-9 w-36" aria-label={promotionLabels.filterActive} items={{ all: common.all, active: "활성", inactive: "비활성" }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            <SelectItem value="active">활성</SelectItem>
            <SelectItem value="inactive">비활성</SelectItem>
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
            data={promotions}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={promotionLabels.emptyMessage}
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
    </div>
  );
}
