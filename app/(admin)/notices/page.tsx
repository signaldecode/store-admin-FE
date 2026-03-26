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
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { getNotices, deleteNotice } from "@/services/noticeService";
import type { Notice } from "@/types/notice";
import type { NoticeType } from "@/lib/constants";
import {
  notice as noticeLabels,
  common,
  NOTICE_TYPE_LABEL,
  NOTICE_STATUS_LABEL,
} from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Site filter
  const [siteId, setSiteId] = useState<number | null>(null);

  // Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // Filter
  type TypeFilter = "all" | NoticeType;
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Sort
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const type = typeFilter === "all" ? undefined : typeFilter;
      const res = await getNotices({
        keyword: debouncedKeyword || undefined,
        type,
        page,
        size: PAGE_SIZE,
      });
      setNotices(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts handles common errors
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, typeFilter, siteId, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, typeFilter, siteId]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteNotice(deleteTarget.id);
      await fetchNotices();
      setDeleteTarget(null);
    } catch {
      // api.ts handles common errors
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusVariant = (status: string) => {
    return status === "ACTIVE" ? "default" : "secondary";
  };

  const columns: Column<Notice>[] = [
    {
      key: "title",
      label: noticeLabels.colTitle,
      sortable: true,
      render: (notice) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => router.push(`/notices/${notice.id}/edit`)}
        >
          {notice.title}
        </button>
      ),
    },
    {
      key: "type",
      label: noticeLabels.colType,
      render: (notice) => NOTICE_TYPE_LABEL[notice.type],
    },
    {
      key: "isPinned",
      label: noticeLabels.colPinned,
      className: "w-16 text-center",
      render: (notice) => (notice.isPinned ? "\uD83D\uDCCC" : ""),
    },
    {
      key: "status",
      label: noticeLabels.colStatus,
      render: (notice) => (
        <Badge variant={statusVariant(notice.status)}>
          {NOTICE_STATUS_LABEL[notice.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: noticeLabels.colCreatedAt,
      sortable: true,
      render: (notice) => new Date(notice.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-16",
      render: (notice) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteTarget(notice)}
        >
          {common.delete}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{noticeLabels.pageTitle}</h1>
        <Button onClick={() => router.push("/notices/new")}>
          <Plus className="mr-2 h-4 w-4" />
          {noticeLabels.addButton}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={noticeLabels.searchPlaceholder}
            className="pl-9"
            aria-label={noticeLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as TypeFilter)}
          items={{
            all: common.all,
            NOTICE: NOTICE_TYPE_LABEL.NOTICE,
            INSPECTION: NOTICE_TYPE_LABEL.INSPECTION,
            GUIDELINES: NOTICE_TYPE_LABEL.GUIDELINES,
            EVENT: NOTICE_TYPE_LABEL.EVENT,
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={noticeLabels.filterType}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            <SelectItem value="NOTICE">{NOTICE_TYPE_LABEL.NOTICE}</SelectItem>
            <SelectItem value="INSPECTION">{NOTICE_TYPE_LABEL.INSPECTION}</SelectItem>
            <SelectItem value="GUIDELINES">{NOTICE_TYPE_LABEL.GUIDELINES}</SelectItem>
            <SelectItem value="EVENT">{NOTICE_TYPE_LABEL.EVENT}</SelectItem>
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
            data={notices}
            keyExtractor={(notice) => notice.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={noticeLabels.emptyMessage}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={noticeLabels.deleteTitle}
        description={deleteTarget ? noticeLabels.deleteDescription(deleteTarget.title) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
