"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/common/DataTable";
import { getCategories } from "@/services/categoryService";
import type { Category } from "@/types/category";
import { site as siteLabels, common } from "@/data/labels";

/** 트리에서 직계 하위 개수 계산 */
function countDescendants(category: Category): number {
  if (!category.children?.length) return 0;
  return category.children.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0
  );
}

export default function SitesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rootCategories = useMemo(
    () => categories.filter((c) => c.depth === 0),
    [categories]
  );

  const columns: Column<Category>[] = [
    {
      key: "name",
      label: siteLabels.colName,
      render: (c) => (
        <span className="font-medium">{c.name}</span>
      ),
    },
    {
      key: "siteUrl",
      label: siteLabels.colSiteUrl,
      render: (c) =>
        c.siteUrl ? (
          <a
            href={c.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {c.siteUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      key: "subCount",
      label: siteLabels.colSubCount,
      className: "w-32",
      render: (c) => (
        <span className="text-sm text-muted-foreground">
          {common.itemUnit(countDescendants(c))}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (c) =>
        c.tenantId ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/sites/${c.tenantId}`)}
          >
            <Settings className="mr-1.5 h-3.5 w-3.5" />
            {siteLabels.settingsButton}
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{siteLabels.pageTitle}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rootCategories}
          keyExtractor={(c) => c.id}
          emptyMessage={siteLabels.emptyMessage}
        />
      )}
    </div>
  );
}
