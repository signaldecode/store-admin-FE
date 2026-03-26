"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
import { getOrders } from "@/services/orderService";
import type { OrderSummary } from "@/types/order";
import type { OrderStatus } from "@/lib/constants";
import { order as orderLabels, common, ORDER_STATUS_LABEL } from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

type StatusFilter = "all" | OrderStatus;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // 검색
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // 사이트 필터
  const [siteId, setSiteId] = useState<number | null>(null);

  // 필터
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
    { value: "createdAt-desc", label: orderLabels.sortNewest },
    { value: "createdAt-asc", label: orderLabels.sortOldest },
  ];

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await getOrders({
        keyword: debouncedKeyword || undefined,
        status,
        page,
        size: PAGE_SIZE,
        sort: sort ? `${sort},${order}` : undefined,
      });
      setOrders(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, statusFilter, siteId, page, sort, order]);

  // 검색어/필터 변경 시 페이지 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, statusFilter, siteId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: Column<OrderSummary>[] = [
    {
      key: "orderNumber",
      label: orderLabels.colOrderNumber,
      render: (item) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/orders/${item.id}`)}
        >
          {item.orderNumber}
        </button>
      ),
    },
    {
      key: "customerName",
      label: orderLabels.colCustomer,
      render: (item) => item.customerName,
    },
    {
      key: "itemSummary",
      label: orderLabels.colItems,
      render: (item) => item.itemSummary,
    },
    {
      key: "totalAmount",
      label: orderLabels.colTotalAmount,
      render: (item) => `${item.totalAmount.toLocaleString("ko-KR")}${common.currency}`,
    },
    {
      key: "status",
      label: orderLabels.colStatus,
      render: (item) => (
        <Badge variant="secondary">
          {ORDER_STATUS_LABEL[item.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: orderLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{orderLabels.pageTitle}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={orderLabels.searchPlaceholder}
            className="pl-9"
            aria-label={orderLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          items={{
            all: common.all,
            ...ORDER_STATUS_LABEL,
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={orderLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortValue}
          onValueChange={handleSortSelect}
          items={Object.fromEntries(sortOptions.map((o) => [o.value, o.label]))}
        >
          <SelectTrigger className="h-9 w-32" aria-label={orderLabels.sortLabel}>
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
            data={orders}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={orderLabels.emptyMessage}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {common.totalCount(totalElements)}
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
