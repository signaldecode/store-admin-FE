"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable, { type Column } from "@/components/common/DataTable";
import SearchFilter from "@/components/common/SearchFilter";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SiteSelect from "@/components/common/SiteSelect";
import { getMembers } from "@/services/memberService";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { member, common, MEMBER_STATUS_LABEL } from "@/data/labels";
import type { MemberSummary, MemberListParams, Grade } from "@/types/member";
import type { MemberStatus } from "@/lib/constants";

const statusVariant: Record<MemberStatus, "success" | "warning" | "destructive" | "default"> = {
  ACTIVE: "success",
  DORMANT: "warning",
  WITHDRAWN: "destructive",
};

export default function MembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // 사이트
  const [siteId, setSiteId] = useState<number | null>(null);

  // 필터
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedKeyword = useDebounce(keyword);

  // 정렬
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // 페이지네이션
  const pagination = usePagination();

  // 체크박스 선택
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 등급 일괄 변경 (TODO: 백엔드 미구현)
  const [bulkGradeId, setBulkGradeId] = useState<string>("");
  const bulkLoading = false;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params: MemberListParams & { tenantId?: number } = {
        tenantId: siteId ?? undefined,
        page: pagination.page,
        size: pagination.size,
        keyword: debouncedKeyword || undefined,
        status: statusFilter ? (statusFilter as MemberStatus) : undefined,
      };
      const res = await getMembers(params);
      setMembers(res.data?.content ?? []);
      pagination.setTotalCount(res.data?.total_elements ?? 0);
    } catch {
      // 공통 에러 처리
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, debouncedKeyword, statusFilter, siteId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // TODO: 백엔드에 등급 API 없음 — 등급 기능 비활성화
  const grades: Grade[] = [];

  useEffect(() => {
    pagination.resetPage();
    setSelectedIds(new Set());
  }, [debouncedKeyword, statusFilter, siteId]);

  const handleSort = (key: string) => {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  };

  const handleView = (m: MemberSummary) => router.push(`/members/${m.id}`);

  // 체크박스
  const allSelected = members.length > 0 && members.every((m) => selectedIds.has(m.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(members.map((m) => m.id)));
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // TODO: 백엔드에 등급 일괄 변경 API 없음
  const handleBulkGradeChange = async () => {
    if (!bulkGradeId || selectedIds.size === 0) return;
    // bulkChangeGrade 미구현
  };

  const columns: Column<MemberSummary>[] = [
    {
      key: "select",
      label: "",
      className: "w-10",
      render: (m) => (
        <Checkbox
          checked={selectedIds.has(m.id)}
          onCheckedChange={() => toggleOne(m.id)}
          aria-label={`${m.name} 선택`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "name",
      label: member.colName,
      sortable: true,
      render: (m) => <span className="font-medium">{m.name}</span>,
    },
    {
      key: "email",
      label: member.colEmail,
      render: (m) => <span className="text-sm">{m.email}</span>,
    },
    {
      key: "phone",
      label: member.colPhone,
      render: (m) => <span className="text-sm">{m.phone}</span>,
    },
    {
      key: "status",
      label: member.colStatus,
      render: (m) => (
        <StatusBadge
          label={MEMBER_STATUS_LABEL[m.status as MemberStatus] ?? m.status}
          variant={statusVariant[m.status as MemberStatus] ?? "default"}
        />
      ),
    },
    {
      key: "createdAt",
      label: member.colCreatedAt,
      sortable: true,
      render: (m) => new Date(m.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{member.pageTitle}</h1>
      </div>

      {/* 검색 & 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <SiteSelect value={siteId} onChange={setSiteId} />
      </div>
      <SearchFilter
        value={keyword}
        onChange={setKeyword}
        placeholder={member.searchPlaceholder}
      >
        <Select
          value={statusFilter || "__none__"}
          onValueChange={(v) => { if (v !== null) setStatusFilter(v === "__none__" ? "" : v); }}
        >
          <SelectTrigger className="h-9 w-28" aria-label={member.filterStatus} items={Object.fromEntries([
            ["__none__", common.all],
            ...Object.entries(MEMBER_STATUS_LABEL).map(([value, label]) => [value, label]),
          ])}>
            <SelectValue placeholder={common.all} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">{common.all}</SelectItem>
            {Object.entries(MEMBER_STATUS_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SearchFilter>

      {/* 등급 일괄 변경 바 */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 p-3">
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="전체 선택" />
          <span className="text-sm font-medium">{selectedIds.size}명 선택</span>
          <Select value={bulkGradeId} onValueChange={(v) => { if (v !== null) setBulkGradeId(v); }}>
            <SelectTrigger className="h-8 w-32" aria-label="등급 선택" items={Object.fromEntries(grades.map((g) => [String(g.id), g.name]))}>
              <SelectValue placeholder="등급 선택" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleBulkGradeChange} disabled={bulkLoading || !bulkGradeId}>
            {bulkLoading ? common.processing : "등급 변경"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
            {common.cancel}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      ) : (
        <>
          {/* 헤더 전체 선택 체크박스 */}
          <DataTable
            columns={columns}
            data={members}
            keyExtractor={(m) => m.id}
            sort={sort}
            order={order}
            onSort={handleSort}
            onRowClick={handleView}
            emptyMessage={member.emptyMessage}
          />
        </>
      )}

      <div className="flex items-center justify-between">
        {pagination.totalCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {common.totalCount(pagination.totalCount)}
          </span>
        )}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      </div>
    </div>
  );
}
