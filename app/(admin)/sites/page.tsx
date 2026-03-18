"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DataTable, { type Column } from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SiteFormDialog from "@/components/sites/SiteFormDialog";
import {
  getSites,
  createSite,
  updateSite,
  deleteSite,
  toggleSiteStatus,
} from "@/services/siteService";
import type { Site, SiteFormData } from "@/types/site";
import { site as siteLabels, common } from "@/data/labels";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Site | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSites();
      setSites(res.data.content);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (s: Site) => {
    setEditTarget(s);
    setFormOpen(true);
  };

  const handleSubmit = async (data: SiteFormData) => {
    if (editTarget) {
      await updateSite(editTarget.id, data);
    } else {
      await createSite(data);
    }
    await fetchSites();
  };

  const handleToggleStatus = async (s: Site) => {
    const prevIsActive = s.isActive;
    setSites((prev) =>
      prev.map((item) => (item.id === s.id ? { ...item, isActive: !prevIsActive } : item))
    );
    try {
      await toggleSiteStatus(s.id);
    } catch {
      setSites((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, isActive: prevIsActive } : item))
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteSite(deleteTarget.id);
      await fetchSites();
      setDeleteTarget(null);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Site>[] = [
    {
      key: "code",
      label: siteLabels.colCode,
      className: "w-28",
      render: (s) => (
        <span className="font-mono text-sm">{s.code}</span>
      ),
    },
    {
      key: "name",
      label: siteLabels.colName,
      render: (s) => (
        <button
          className="cursor-pointer text-left hover:underline"
          onClick={() => handleEdit(s)}
        >
          {s.name}
        </button>
      ),
    },
    {
      key: "domain",
      label: siteLabels.colDomain,
      render: (s) =>
        s.domain ? (
          <a
            href={s.domain.startsWith("http") ? s.domain : `https://${s.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {s.domain}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      key: "isActive",
      label: siteLabels.colStatus,
      className: "w-20",
      render: (s) => (
        <Switch
          checked={s.isActive}
          onCheckedChange={() => handleToggleStatus(s)}
          aria-label={siteLabels.statusToggleLabel(s.name)}
        />
      ),
    },
    {
      key: "createdAt",
      label: siteLabels.colCreatedAt,
      render: (s) => new Date(s.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (s) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(s)}
          >
            {common.edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(s)}
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
        <h1 className="text-2xl font-semibold">{siteLabels.pageTitle}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {siteLabels.addButton}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sites}
          keyExtractor={(s) => s.id}
          emptyMessage={siteLabels.emptyMessage}
        />
      )}

      <SiteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        site={editTarget}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={siteLabels.deleteTitle}
        description={deleteTarget ? siteLabels.deleteDescription(deleteTarget.name) : ""}
        confirmLabel={common.delete}
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
