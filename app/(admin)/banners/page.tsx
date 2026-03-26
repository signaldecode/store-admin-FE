"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DataTable, { type Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/services/bannerService";
import type { Banner, BannerFormData } from "@/types/banner";
import type { BannerStatus, BannerPosition } from "@/lib/constants";
import { BANNER_POSITION, BANNER_STATUS } from "@/lib/constants";
import {
  banner as bannerLabels,
  common,
  BANNER_STATUS_LABEL,
  BANNER_POSITION_LABEL,
} from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

const INITIAL_FORM: BannerFormData = {
  title: "",
  position: "HERO",
  status: "ACTIVE",
  startedAt: "",
  endedAt: undefined,
  noEndDate: false,
  linkUrl: undefined,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [total_elements, setTotalElements] = useState(0);

  // Dialog CRUD
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<BannerFormData>(INITIAL_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Site filter
  const [siteId, setSiteId] = useState<number | null>(null);

  // Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // Filter
  type StatusFilter = "all" | BannerStatus;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Sort
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(total_elements / PAGE_SIZE);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await getBanners({
        keyword: debouncedKeyword || undefined,
        status,
        page,
        size: PAGE_SIZE,
      });
      setBanners(res.data.content);
      setTotalElements(res.data.total_elements);
    } catch {
      // api.ts handles common errors
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, statusFilter, siteId, page, sort, order]);

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, statusFilter, siteId]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  // ─── Form Dialog ───
  const handleCreate = () => {
    setEditTarget(null);
    setFormData(INITIAL_FORM);
    setFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditTarget(banner);
    setFormData({
      title: banner.title,
      position: banner.position,
      status: banner.status,
      startedAt: banner.startedAt.slice(0, 16),
      endedAt: banner.endedAt ? banner.endedAt.slice(0, 16) : undefined,
      noEndDate: banner.noEndDate,
      linkUrl: banner.linkUrl ?? undefined,
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.title.trim()) return;
    setFormLoading(true);
    try {
      if (editTarget) {
        await updateBanner(editTarget.id, formData);
      } else {
        await createBanner(formData);
      }
      setFormOpen(false);
      await fetchBanners();
    } catch {
      // api.ts handles common errors
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBanner(deleteTarget.id);
      await fetchBanners();
      setDeleteTarget(null);
    } catch {
      // api.ts handles common errors
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPeriod = (banner: Banner) => {
    const start = new Date(banner.startedAt).toLocaleDateString("ko-KR");
    if (banner.noEndDate || !banner.endedAt) return `${start} ~ ${bannerLabels.noEndDate}`;
    const end = new Date(banner.endedAt).toLocaleDateString("ko-KR");
    return `${start} ~ ${end}`;
  };

  const statusVariant = (status: BannerStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SCHEDULED":
        return "outline";
    }
  };

  const columns: Column<Banner>[] = [
    {
      key: "title",
      label: bannerLabels.colTitle,
      sortable: true,
      render: (banner) => banner.title,
    },
    {
      key: "position",
      label: bannerLabels.colPosition,
      render: (banner) => BANNER_POSITION_LABEL[banner.position],
    },
    {
      key: "status",
      label: bannerLabels.colStatus,
      render: (banner) => (
        <Badge variant={statusVariant(banner.status)}>
          {BANNER_STATUS_LABEL[banner.status]}
        </Badge>
      ),
    },
    {
      key: "period",
      label: bannerLabels.colPeriod,
      render: (banner) => formatPeriod(banner),
    },
    {
      key: "createdAt",
      label: bannerLabels.colCreatedAt,
      sortable: true,
      render: (banner) => new Date(banner.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (banner) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(banner)}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(banner)}
          >
            {common.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{bannerLabels.pageTitle}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {bannerLabels.addButton}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={bannerLabels.searchPlaceholder}
            className="pl-9"
            aria-label={bannerLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
          items={{
            all: common.all,
            ACTIVE: BANNER_STATUS_LABEL.ACTIVE,
            INACTIVE: BANNER_STATUS_LABEL.INACTIVE,
            SCHEDULED: BANNER_STATUS_LABEL.SCHEDULED,
          }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={bannerLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            <SelectItem value="ACTIVE">{BANNER_STATUS_LABEL.ACTIVE}</SelectItem>
            <SelectItem value="INACTIVE">{BANNER_STATUS_LABEL.INACTIVE}</SelectItem>
            <SelectItem value="SCHEDULED">{BANNER_STATUS_LABEL.SCHEDULED}</SelectItem>
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
            data={banners}
            keyExtractor={(banner) => banner.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={bannerLabels.emptyMessage}
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

      {/* Add / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? bannerLabels.editTitle : bannerLabels.createTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="banner-title">
                {bannerLabels.titleLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="banner-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={bannerLabels.titlePlaceholder}
                aria-required="true"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-position">{bannerLabels.positionLabel}</Label>
              <Select
                value={formData.position}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, position: v as BannerPosition }))
                }
                items={Object.fromEntries(
                  Object.entries(BANNER_POSITION_LABEL).map(([k, v]) => [k, v])
                )}
              >
                <SelectTrigger id="banner-position" className="w-full">
                  <SelectValue placeholder={bannerLabels.positionPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BANNER_POSITION_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-status">{bannerLabels.statusLabel}</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, status: v as BannerStatus }))
                }
                items={Object.fromEntries(
                  Object.entries(BANNER_STATUS_LABEL).map(([k, v]) => [k, v])
                )}
              >
                <SelectTrigger id="banner-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BANNER_STATUS_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-startedAt">{bannerLabels.startedAtLabel}</Label>
              <Input
                id="banner-startedAt"
                type="datetime-local"
                value={formData.startedAt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startedAt: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-endedAt">{bannerLabels.endedAtLabel}</Label>
              <Input
                id="banner-endedAt"
                type="datetime-local"
                value={formData.noEndDate ? "" : (formData.endedAt ?? "")}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endedAt: e.target.value || undefined }))
                }
                disabled={formData.noEndDate}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.noEndDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      noEndDate: e.target.checked,
                      endedAt: e.target.checked ? undefined : prev.endedAt,
                    }))
                  }
                  className="rounded border-input"
                />
                {bannerLabels.noEndDate}
              </label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="banner-linkUrl">{bannerLabels.linkUrlLabel}</Label>
              <Input
                id="banner-linkUrl"
                value={formData.linkUrl ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkUrl: e.target.value || undefined }))
                }
                placeholder={bannerLabels.linkUrlPlaceholder}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={formLoading}
            >
              {common.cancel}
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading}>
              {formLoading ? common.saving : common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={bannerLabels.deleteTitle}
        description={deleteTarget ? bannerLabels.deleteDescription(deleteTarget.title) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
