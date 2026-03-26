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
import { getInquiries, getInquiryTypes } from "@/services/inquiryService";
import type { InquirySummary, InquiryType } from "@/types/inquiry";
import type { InquiryStatus } from "@/lib/constants";
import { inquiry as inquiryLabels, common, INQUIRY_STATUS_LABEL } from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

const STATUS_VARIANT: Record<InquiryStatus, "default" | "secondary"> = {
  WAITING: "secondary",
  ANSWERED: "default",
};

export default function InquiriesPage() {
  const router = useRouter();
  const [siteId, setSiteId] = useState<number | null>(null);
  const [inquiries, setInquiries] = useState<InquirySummary[]>([]);
  const [inquiryTypes, setInquiryTypes] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  type StatusFilter = "all" | InquiryStatus;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const res = await getInquiryTypes();
        setInquiryTypes(res.data);
      } catch {
        // api.ts에서 공통 에러 처리
      }
    };
    loadTypes();
  }, []);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const type = typeFilter === "all" ? undefined : typeFilter;
      const res = await getInquiries({
        keyword: debouncedKeyword || undefined,
        status,
        type,
        page,
        size: PAGE_SIZE,
        sort: sort ? `${sort},${order}` : undefined,
      });
      setInquiries(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [siteId, debouncedKeyword, statusFilter, typeFilter, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [siteId, debouncedKeyword, statusFilter, typeFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const columns: Column<InquirySummary>[] = [
    {
      key: "title",
      label: inquiryLabels.colTitle,
      sortable: true,
      render: (item) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/inquiries/${item.id}`)}
        >
          {item.title}
        </button>
      ),
    },
    {
      key: "type",
      label: inquiryLabels.colType,
      render: (item) => item.type,
    },
    {
      key: "userName",
      label: inquiryLabels.colUser,
      render: (item) => item.userName,
    },
    {
      key: "status",
      label: inquiryLabels.colStatus,
      className: "w-24",
      render: (item) => (
        <Badge variant={STATUS_VARIANT[item.status]}>
          {INQUIRY_STATUS_LABEL[item.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: inquiryLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{inquiryLabels.pageTitle}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={inquiryLabels.searchPlaceholder}
            className="pl-9"
            aria-label={inquiryLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="h-9 w-36" aria-label={inquiryLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {(Object.entries(INQUIRY_STATUS_LABEL) as [InquiryStatus, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(v) => { if (v !== null) setTypeFilter(v); }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={inquiryLabels.filterType}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            {inquiryTypes.map((t) => (
              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
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
            data={inquiries}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={inquiryLabels.emptyMessage}
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
