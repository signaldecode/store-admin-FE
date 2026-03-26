"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getMember, getMemberPoints,
} from "@/services/memberService";
import { member as L, common, MEMBER_STATUS_LABEL } from "@/data/labels";
import type { Member, PointHistory } from "@/types/member";
import {
  DetailShell, DetailLoading, DetailNotFound,
  Section, InfoGrid, InfoItem, SimpleTable,
} from "@/components/common/DetailPage";

const POINT_TYPE_LABEL: Record<PointHistory["type"], string> = { EARN: "적립", USE: "사용", ADJUST: "조정" };

export default function MemberDetailPage() {
  const memberId = Number(useParams().id);
  const [data, setData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<PointHistory[]>([]);
  // TODO: 백엔드에 메모/포인트조정 API 없음 — 기능 비활성화

  const fetchAll = useCallback(async () => {
    try {
      const [m, p] = await Promise.all([getMember(memberId), getMemberPoints(memberId)]);
      setData(m.data); setPoints(p.data.content);
    } catch {} finally { setLoading(false); }
  }, [memberId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/members" />;

  const u = data.user;

  return (
    <DetailShell title={`${u.name} — ${L.detailTitle}`} backHref="/members">
      {/* 기본 정보 */}
      <Section title={L.sectionBasicInfo}>
        <InfoGrid columns={3}>
          <InfoItem label={L.colName} value={u.name} />
          <InfoItem label={L.colEmail} value={u.email} />
          <InfoItem label={L.colPhone} value={u.phone ?? "-"} />
          <InfoItem label={L.colStatus} badge={{ text: MEMBER_STATUS_LABEL[u.status as keyof typeof MEMBER_STATUS_LABEL] ?? u.status }} />
          <InfoItem label={L.totalPoints} value={data.point ? `${(data.point.currentPoints ?? 0).toLocaleString("ko-KR")}P` : "-"} />
          <InfoItem label={L.colCreatedAt} value={new Date(u.createdAt).toLocaleDateString("ko-KR")} />
        </InfoGrid>
      </Section>

      {/* 포인트 */}
      <Section title={L.sectionPoints}>
        {/* TODO: 백엔드에 포인트 조정 API 없음 */}
        {points.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{common.noData}</p>
        ) : (
          <SimpleTable
            data={points}
            keyExtractor={(p) => p.id}
            columns={[
              { label: "유형", render: (p) => <Badge variant={p.type === "USE" ? "destructive" : "secondary"}>{POINT_TYPE_LABEL[p.type]}</Badge> },
              { label: "금액", align: "right", render: (p) => <span className={p.amount > 0 ? "text-emerald-600" : "text-red-600"}>{p.amount > 0 ? "+" : ""}{(p.amount ?? 0).toLocaleString("ko-KR")}</span> },
              { label: "사유", render: (p) => p.reason },
              { label: "일시", render: (p) => new Date(p.createdAt).toLocaleDateString("ko-KR") },
            ]}
          />
        )}
      </Section>

      {/* TODO: 백엔드에 CS 메모 CRUD API 없음 — 메모 섹션 비활성화 */}
    </DetailShell>
  );
}
