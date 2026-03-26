"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  getMember, getMemberPoints, getMemberMemos,
  createMemberMemo, deleteMemberMemo, adjustMemberPoints,
} from "@/services/memberService";
import { member as L, common, MEMBER_STATUS_LABEL } from "@/data/labels";
import type { Member, PointHistory, CsMemo } from "@/types/member";
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
  const [memos, setMemos] = useState<CsMemo[]>([]);

  // 포인트 조정
  const [adjAmount, setAdjAmount] = useState("");
  const [adjReason, setAdjReason] = useState("");
  const [adjLoading, setAdjLoading] = useState(false);

  // 메모
  const [memoText, setMemoText] = useState("");
  const [memoLoading, setMemoLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [m, p, me] = await Promise.all([getMember(memberId), getMemberPoints(memberId), getMemberMemos(memberId)]);
      setData(m.data); setPoints(p.data); setMemos(me.data);
    } catch {} finally { setLoading(false); }
  }, [memberId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAdjust = async () => {
    if (!adjAmount || !adjReason.trim()) return;
    setAdjLoading(true);
    try {
      await adjustMemberPoints(memberId, { amount: Number(adjAmount), reason: adjReason.trim() });
      setAdjAmount(""); setAdjReason("");
      fetchAll();
    } catch {} finally { setAdjLoading(false); }
  };

  const handleAddMemo = async () => {
    if (!memoText.trim()) return;
    setMemoLoading(true);
    try {
      await createMemberMemo(memberId, memoText.trim());
      setMemoText("");
      const res = await getMemberMemos(memberId); setMemos(res.data);
    } catch {} finally { setMemoLoading(false); }
  };

  const handleDeleteMemo = async (memoId: number) => {
    await deleteMemberMemo(memberId, memoId);
    const res = await getMemberMemos(memberId); setMemos(res.data);
  };

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/members" />;

  return (
    <DetailShell title={`${data.name} — ${L.detailTitle}`} backHref="/members">
      {/* 기본 정보 */}
      <Section title={L.sectionBasicInfo}>
        <InfoGrid columns={3}>
          <InfoItem label={L.colName} value={data.name} />
          <InfoItem label={L.colEmail} value={data.email} />
          <InfoItem label={L.colPhone} value={data.phone} />
          <InfoItem label={L.colGrade} badge={{ text: data.grade, variant: "outline" }} />
          <InfoItem label={L.colStatus} badge={{ text: MEMBER_STATUS_LABEL[data.status] }} />
          <InfoItem label={L.totalPoints} value={`${data.pointBalance.toLocaleString("ko-KR")}P`} />
          <InfoItem label={L.colCreatedAt} value={new Date(data.createdAt).toLocaleDateString("ko-KR")} />
        </InfoGrid>
      </Section>

      {/* 포인트 */}
      <Section title={L.sectionPoints}>
        <div className="mb-4 flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="adj-amount" className="text-xs">{L.adjustAmount}</Label>
            <Input id="adj-amount" type="number" value={adjAmount} onChange={(e) => setAdjAmount(e.target.value)} placeholder="1000 / -500" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="adj-reason" className="text-xs">{L.adjustReason}</Label>
            <Input id="adj-reason" value={adjReason} onChange={(e) => setAdjReason(e.target.value)} placeholder={L.adjustReasonPlaceholder} />
          </div>
          <Button size="sm" onClick={handleAdjust} disabled={adjLoading || !adjAmount || !adjReason.trim()}>
            {adjLoading ? common.processing : L.adjustPoints}
          </Button>
        </div>
        {points.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{common.noData}</p>
        ) : (
          <SimpleTable
            data={points}
            keyExtractor={(p) => p.id}
            columns={[
              { label: "유형", render: (p) => <Badge variant={p.type === "USE" ? "destructive" : "secondary"}>{POINT_TYPE_LABEL[p.type]}</Badge> },
              { label: "금액", align: "right", render: (p) => <span className={p.amount > 0 ? "text-emerald-600" : "text-red-600"}>{p.amount > 0 ? "+" : ""}{p.amount.toLocaleString("ko-KR")}</span> },
              { label: "사유", render: (p) => p.reason },
              { label: "일시", render: (p) => new Date(p.createdAt).toLocaleDateString("ko-KR") },
            ]}
          />
        )}
      </Section>

      {/* CS 메모 */}
      <Section title={L.sectionMemos}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor="memo-text" className="text-xs">{L.addMemo}</Label>
            <Textarea id="memo-text" value={memoText} onChange={(e) => setMemoText(e.target.value)} placeholder={L.memoPlaceholder} rows={2} />
          </div>
          <Button size="sm" onClick={handleAddMemo} disabled={memoLoading || !memoText.trim()}>
            {memoLoading ? common.processing : L.addMemo}
          </Button>
        </div>
        {memos.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{common.noData}</p>
        ) : (
          <ul className="space-y-2">
            {memos.map((m) => (
              <li key={m.id} className="flex items-start justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm">{m.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.adminName} · {new Date(m.createdAt).toLocaleDateString("ko-KR")}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDeleteMemo(m.id)} aria-label={common.delete}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </DetailShell>
  );
}
