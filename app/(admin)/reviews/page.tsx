"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import DataTable, { type Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import { getReviews, toggleReviewVisibility } from "@/services/reviewService";
import type { Review } from "@/types/review";
import { review as reviewLabels, common } from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;
const MAX_CONTENT_LENGTH = 50;

export default function ReviewsPage() {
  const [siteId, setSiteId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReviews({
        tenantId: siteId ?? undefined,
        page,
        size: PAGE_SIZE,
      });
      setReviews(res.data?.content ?? []);
      setTotalElements(res.data?.total_elements ?? 0);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [siteId, debouncedKeyword, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [siteId, debouncedKeyword]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const handleToggleVisibility = async (reviewItem: Review) => {
    const prevVisible = reviewItem.isVisible;
    // 낙관적 업데이트
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewItem.id ? { ...r, isVisible: !prevVisible } : r))
    );
    try {
      await toggleReviewVisibility(reviewItem.id);
    } catch {
      // 실패 시 롤백
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewItem.id ? { ...r, isVisible: prevVisible } : r))
      );
    }
  };

  const renderRating = (rating: number) => {
    return `${rating} / 5`;
  };

  const columns: Column<Review>[] = [
    {
      key: "productId",
      label: reviewLabels.colProduct,
      render: (item) => `#${item.productId}`,
    },
    {
      key: "userId",
      label: reviewLabels.colUser,
      render: (item) => `#${item.userId}`,
    },
    {
      key: "rating",
      label: reviewLabels.colRating,
      className: "w-20",
      render: (item) => renderRating(item.rating),
    },
    {
      key: "title",
      label: reviewLabels.colContent,
      render: (item) => {
        const text = item.title || item.content || "";
        return text.length > MAX_CONTENT_LENGTH ? `${text.slice(0, MAX_CONTENT_LENGTH)}...` : text;
      },
    },
    {
      key: "isVisible",
      label: reviewLabels.colVisible,
      className: "w-20",
      render: (item) => (
        <Switch
          checked={item.isVisible}
          onCheckedChange={() => handleToggleVisibility(item)}
          aria-label={reviewLabels.visibilityToggle}
        />
      ),
    },
    {
      key: "createdAt",
      label: reviewLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{reviewLabels.pageTitle}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={reviewLabels.searchPlaceholder}
            className="pl-9"
            aria-label={reviewLabels.searchPlaceholder}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={reviews}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={reviewLabels.emptyMessage}
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
