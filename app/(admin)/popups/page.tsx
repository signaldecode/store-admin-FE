"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  getPopups,
  createPopup,
  updatePopup,
  deletePopup,
} from "@/services/popupService";
import type { Popup, PopupFormData } from "@/types/popup";
import type { PopupStatus, PopupType } from "@/lib/constants";
import {
  popup as popupLabels,
  common,
  POPUP_TYPE_LABEL,
  POPUP_STATUS_LABEL,
} from "@/data/labels";
import SiteSelect from "@/components/common/SiteSelect";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 10;

const INITIAL_FORM: PopupFormData = {
  title: "",
  content: "",
  type: "CENTER",
  status: "ACTIVE",
  startDate: "",
  endDate: "",
};

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog CRUD
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Popup | null>(null);
  const [formData, setFormData] = useState<PopupFormData>(INITIAL_FORM);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Popup | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Site filter
  const [siteId, setSiteId] = useState<number | null>(null);

  // Search
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  // Filter
  type StatusFilter = "all" | PopupStatus;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Pagination
  const [page, setPage] = useState(1);

  // Sort
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  const fetchPopups = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      const res = await getPopups({
        status,
        page,
        size: PAGE_SIZE,
      });
      setPopups(res.data.content);
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
    fetchPopups();
  }, [fetchPopups]);

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

  const handleEdit = (item: Popup) => {
    setEditTarget(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      status: item.status,
      startDate: item.startDate.slice(0, 16),
      endDate: item.endDate.slice(0, 16),
    });
    setFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.title.trim()) return;
    setFormLoading(true);
    try {
      if (editTarget) {
        await updatePopup(editTarget.id, formData);
      } else {
        await createPopup(formData);
      }
      setFormOpen(false);
      await fetchPopups();
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
      await deletePopup(deleteTarget.id);
      await fetchPopups();
      setDeleteTarget(null);
    } catch {
      // api.ts handles common errors
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPeriod = (item: Popup) => {
    const start = new Date(item.startDate).toLocaleDateString("ko-KR");
    const end = new Date(item.endDate).toLocaleDateString("ko-KR");
    return `${start} ~ ${end}`;
  };

  const statusVariant = (status: PopupStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
    }
  };

  const columns: Column<Popup>[] = [
    {
      key: "title",
      label: popupLabels.colTitle,
      sortable: true,
      render: (item) => item.title,
    },
    {
      key: "type",
      label: popupLabels.colType,
      render: (item) => POPUP_TYPE_LABEL[item.type],
    },
    {
      key: "status",
      label: popupLabels.colStatus,
      render: (item) => (
        <Badge variant={statusVariant(item.status)}>
          {POPUP_STATUS_LABEL[item.status]}
        </Badge>
      ),
    },
    {
      key: "period",
      label: popupLabels.colPeriod,
      render: (item) => formatPeriod(item),
    },
    {
      key: "createdAt",
      label: popupLabels.colCreatedAt,
      sortable: true,
      render: (item) => new Date(item.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(item)}
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
        <h1 className="text-2xl font-semibold">{popupLabels.pageTitle}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {popupLabels.addButton}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={popupLabels.searchPlaceholder}
            className="pl-9"
            aria-label={popupLabels.searchPlaceholder}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => { if (v !== null) setStatusFilter(v as StatusFilter); }}
        >
          <SelectTrigger className="h-9 w-36" aria-label={popupLabels.filterStatus}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{common.all}</SelectItem>
            <SelectItem value="ACTIVE">{POPUP_STATUS_LABEL.ACTIVE}</SelectItem>
            <SelectItem value="INACTIVE">{POPUP_STATUS_LABEL.INACTIVE}</SelectItem>
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
            data={popups}
            keyExtractor={(item) => item.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            emptyMessage={popupLabels.emptyMessage}
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

      {/* Add / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTarget ? popupLabels.editTitle : popupLabels.createTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="popup-title">
                {popupLabels.titleLabel} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="popup-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={popupLabels.titlePlaceholder}
                aria-required="true"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-content">{popupLabels.contentLabel}</Label>
              <Textarea
                id="popup-content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder={popupLabels.contentPlaceholder}
                rows={5}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-type">{popupLabels.typeLabel}</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => {
                  if (v !== null) setFormData((prev) => ({ ...prev, type: v as PopupType }));
                }}
              >
                <SelectTrigger id="popup-type" className="w-full">
                  <SelectValue placeholder={popupLabels.typePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(POPUP_TYPE_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-status">{popupLabels.statusLabel}</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => {
                  if (v !== null) setFormData((prev) => ({ ...prev, status: v as PopupStatus }));
                }}
              >
                <SelectTrigger id="popup-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(POPUP_STATUS_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-startDate">{popupLabels.startDateLabel}</Label>
              <Input
                id="popup-startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-endDate">{popupLabels.endDateLabel}</Label>
              <Input
                id="popup-endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
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
        title={popupLabels.deleteTitle}
        description={deleteTarget ? popupLabels.deleteDescription(deleteTarget.title) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
