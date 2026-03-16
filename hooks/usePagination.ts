import { useState, useCallback } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialSize = DEFAULT_PAGE_SIZE } = options;

  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / size);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    size,
    totalCount,
    totalPages,
    setSize,
    setTotalCount,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
}
