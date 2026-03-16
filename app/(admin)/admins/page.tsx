"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable, { type Column } from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import AdminFormDialog from "@/components/admins/AdminFormDialog";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "@/services/adminService";
import { ADMIN_ROLE_LABEL } from "@/lib/constants";
import type { Admin, AdminFormData } from "@/types/admin";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // 폼 다이얼로그
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Admin | null>(null);

  // 삭제 다이얼로그
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdmins();
      setAdmins(res.data);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditTarget(admin);
    setFormOpen(true);
  };

  const handleSubmit = async (data: AdminFormData) => {
    if (editTarget) {
      await updateAdmin(editTarget.id, data);
    } else {
      await createAdmin(data);
    }
    await fetchAdmins();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAdmin(deleteTarget.id);
      await fetchAdmins();
      setDeleteTarget(null);
    } catch {
      // api.ts에서 공통 에러 처리
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: Column<Admin>[] = [
    { key: "email", label: "이메일", sortable: true },
    { key: "name", label: "이름", sortable: true },
    {
      key: "role",
      label: "역할",
      render: (admin) => (
        <StatusBadge
          label={ADMIN_ROLE_LABEL[admin.role]}
          variant={admin.role === "SUPER" ? "success" : "default"}
        />
      ),
    },
    {
      key: "createdAt",
      label: "등록일",
      render: (admin) => new Date(admin.createdAt).toLocaleDateString("ko-KR"),
    },
    {
      key: "actions",
      label: "",
      className: "w-24",
      render: (admin) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(admin);
            }}
          >
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(admin);
            }}
          >
            삭제
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">관리자 계정</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          관리자 추가
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          keyExtractor={(admin) => admin.id}
          emptyMessage="등록된 관리자가 없습니다."
        />
      )}

      <AdminFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        admin={editTarget}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="관리자 삭제"
        description={`${deleteTarget?.name}(${deleteTarget?.email}) 계정을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={handleDelete}
        loading={deleteLoading}
        destructive
      />
    </div>
  );
}
