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
import { getClaims } from "@/services/claimService";
import type { ClaimSummary } from "@/types/claim";
import type { ClaimType, ClaimStatus } from "@/lib/constants";
import {
  claim as claimLabels,
  common,
  CLAIM_TYPE_LABEL,
  CLAIM_STATUS_LABEL,
} from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

type TypeFilter = "all" | ClaimType;
type StatusFilter = "all" | ClaimStatus;

export default function ClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // 검색
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // 사이트 필터
  const [siteId, setSiteId] = useState<number | null>(null);

  // 필터
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
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
    { value: "createdAt-desc", label: claimLabels.sortNewest },
    { value: "createdAt-asc", label: claimLabels.sortOldest },
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

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const claimType = typeFilter === "all" ? undefined : typeFilter;
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await getClaims({
        keyword: debouncedKeyword || undefined,
        claimType,
        status,
        page,
        size: PAGE_SIZE,
        sort: sort ? `${sort},${order}` : undefined,
      });
      setClaims(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, typeFilter, statusFilter, siteId, page, sort, order]);

  // 검색어/필터 변경 시 페이지 1로 리셋
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, typeFilter, statusFilter, siteId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const columns: Column<ClaimSummary>[] = [
    {
      key: "id",
      label: claimLabels.colId,
      className: "w-16",
      render: (item) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/claims/${item.id}`)}
        >
          {item.id}
        </button>
      ),
    },
    {
      key: "orderNumber",
      label: claimLabels.colOrderNumber,
      render: (item) => item.orderNumber,
    },
    {
      key: "claimType",
      label: claimLabels.colType,
      render: (item) => CLAIM_TYPE_LABEL[item.claimType],
    },
    {
      key: "reasonType",
      label: claimLabels.colReason,
      render: (item) => item.reasonType,
    },
    {
      key: "status",
      label: claimLabels.colStatus,
      render: (item) => (
        <Badge variant="secondary">
          {CLAIM_STATUS_LABEL[item.status]}
        </Badge>
      ),
    },
    {
      key: "estimatedRefundAmount",
      label: claimLabels.colAmount,
      render: (item) => `${item.estimatedRefundAmount.toLocaleString("ko-KR")}${common.currency}`,
    },
    {
      key: "createdAt",
      label: claimLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{claimLabels.pageTitle}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={claimLabels.searchPlaceholder}
            className="pl-9"
            aria-label={claimLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as TypeFilter)}
          items={{
            all: common.all,
            ...CLAIM_TYPE_LABEL,
          }}
        >
          <SelectTrigger className="h-9 w-32" aria-label={claimLabels.filterType}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {Object.entries(CLAIM_TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          items={{
            all: common.all,
            ...CLAIM_STATUS_LABEL,
          }}
        >
          <SelectTrigger className="h-9 w-32" aria-label={claimLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {Object.entries(CLAIM_STATUS_LABEL).map(([value, label]) => (
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
          <SelectTrigger className="h-9 w-32" aria-label={claimLabels.sortLabel}>
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
            data={claims}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={claimLabels.emptyMessage}
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
