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
import { getQnas } from "@/services/qnaService";
import type { QnaSummary } from "@/types/qna";
import type { QnaStatus } from "@/lib/constants";
import { qna as qnaLabels, common, QNA_STATUS_LABEL } from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

const STATUS_VARIANT: Record<QnaStatus, "default" | "secondary"> = {
  WAITING: "secondary",
  ANSWERED: "default",
};

export default function QnasPage() {
  const router = useRouter();
  const [siteId, setSiteId] = useState<number | null>(null);
  const [qnas, setQnas] = useState<QnaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  // Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // Filter
  type StatusFilter = "all" | QnaStatus;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Sort
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchQnas = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await getQnas({
        keyword: debouncedKeyword || undefined,
        status,
        page,
        size: PAGE_SIZE,
      });
      setQnas(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts handles common errors
    } finally {
      setLoading(false);
    }
  }, [siteId, debouncedKeyword, statusFilter, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [siteId, debouncedKeyword, statusFilter]);

  useEffect(() => {
    fetchQnas();
  }, [fetchQnas]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const columns: Column<QnaSummary>[] = [
    {
      key: "productName",
      label: qnaLabels.colProduct,
      render: (item) => item.productName,
    },
    {
      key: "title",
      label: qnaLabels.colTitle,
      sortable: true,
      render: (item) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/qnas/${item.id}`)}
        >
          {item.title}
        </button>
      ),
    },
    {
      key: "userName",
      label: qnaLabels.colUser,
      render: (item) => item.userName,
    },
    {
      key: "isSecret",
      label: qnaLabels.colSecret,
      className: "w-16 text-center",
      render: (item) => (item.isSecret ? "\uD83D\uDD12" : ""),
    },
    {
      key: "status",
      label: qnaLabels.colStatus,
      className: "w-24",
      render: (item) => (
        <Badge variant={STATUS_VARIANT[item.status]}>
          {QNA_STATUS_LABEL[item.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: qnaLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{qnaLabels.pageTitle}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={qnaLabels.searchPlaceholder}
            className="pl-9"
            aria-label={qnaLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => { if (v !== null) setStatusFilter(v as StatusFilter); }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={qnaLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {(Object.entries(QNA_STATUS_LABEL) as [QnaStatus, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              )
            )}
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
            data={qnas}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={qnaLabels.emptyMessage}
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
