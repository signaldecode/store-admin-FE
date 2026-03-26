"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClaim, approveClaim, rejectClaim, completeClaim, returnShipping } from "@/services/claimService";
import type { Claim } from "@/types/claim";
import { claim as L, common, CLAIM_TYPE_LABEL, CLAIM_STATUS_LABEL } from "@/data/labels";
import {
  DetailShell, DetailLoading, DetailNotFound,
  Section, InfoGrid, InfoItem, SimpleTable,
} from "@/components/common/DetailPage";

export default function ClaimDetailPage() {
  const id = Number(useParams().id);
  const [data, setData] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  /* 반송 정보 등록 */
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnCarrierId, setReturnCarrierId] = useState("");
  const [returnTrackingNumber, setReturnTrackingNumber] = useState("");

  const fetch = useCallback(() => {
    getClaim(id).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(fetch, [fetch]);

  const act = async (fn: () => Promise<void>) => {
    setActing(true);
    try { await fn(); fetch(); } catch {} finally { setActing(false); }
  };

  const handleReturnShipping = async () => {
    if (!returnCarrierId || !returnTrackingNumber) return;
    setActing(true);
    try {
      await returnShipping(id, Number(returnCarrierId), returnTrackingNumber);
      setShowReturnForm(false);
      setReturnCarrierId("");
      setReturnTrackingNumber("");
      fetch();
    } catch {
      /* error handled by fetch wrapper */
    } finally {
      setActing(false);
    }
  };

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/claims" />;

  const showApproveReject = data.status === "REQUESTED";
  const showComplete = data.status === "APPROVED" || data.status === "IN_PROGRESS";
  const showReturnShipping = data.status === "APPROVED";

  return (
    <DetailShell
      title={L.detailTitle}
      backHref="/claims"
      actions={
        <>
          {showApproveReject && (
            <>
              <Button size="sm" onClick={() => act(() => approveClaim(id))} disabled={acting}>{L.actionApprove}</Button>
              <Button size="sm" variant="outline" className="text-destructive" onClick={() => act(() => rejectClaim(id))} disabled={acting}>{L.actionReject}</Button>
            </>
          )}
          {showReturnShipping && (
            <Button size="sm" variant="outline" onClick={() => setShowReturnForm((v) => !v)} disabled={acting}>
              {L.actionRegisterReturn}
            </Button>
          )}
          {showComplete && (
            <Button size="sm" onClick={() => act(() => completeClaim(id))} disabled={acting}>{L.actionComplete}</Button>
          )}
        </>
      }
    >
      <Section title={L.sectionClaimInfo}>
        <InfoGrid>
          <InfoItem label={L.colOrderNumber} value={data.orderNumber} />
          <InfoItem label={L.colType} badge={{ text: CLAIM_TYPE_LABEL[data.claimType] }} />
          <InfoItem label={L.colStatus} badge={{ text: CLAIM_STATUS_LABEL[data.status] }} />
          <InfoItem label={L.colCreatedAt} value={new Date(data.createdAt).toLocaleDateString("ko-KR")} />
          <InfoItem label={L.reasonType} value={data.reasonType} />
          <InfoItem label={L.reason} value={data.reason} full />
        </InfoGrid>
      </Section>

      {/* 반송 정보 등록 인라인 폼 */}
      {showReturnForm && (
        <Section title={L.actionRegisterReturn}>
          <div className="flex flex-col gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="returnCarrierId" className="text-sm font-medium">
                {L.returnCarrierId}
              </label>
              <Input
                id="returnCarrierId"
                type="number"
                placeholder={L.returnCarrierIdPlaceholder}
                value={returnCarrierId}
                onChange={(e) => setReturnCarrierId(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="returnTrackingNumber" className="text-sm font-medium">
                {L.returnTrackingNumber}
              </label>
              <Input
                id="returnTrackingNumber"
                placeholder={L.returnTrackingNumberPlaceholder}
                value={returnTrackingNumber}
                onChange={(e) => setReturnTrackingNumber(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReturnShipping} disabled={acting || !returnCarrierId || !returnTrackingNumber}>
                {L.submitReturnShipping}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowReturnForm(false)}>
                {common.cancel}
              </Button>
            </div>
          </div>
        </Section>
      )}

      <Section title={L.sectionItems}>
        <SimpleTable
          data={data.items}
          keyExtractor={(i) => i.id}
          columns={[
            { label: "상품명", render: (i) => i.productName },
            { label: "옵션", render: (i) => <span className="text-muted-foreground">{i.optionSummary}</span> },
            { label: "수량", align: "right", render: (i) => i.quantity },
            { label: "단가", align: "right", render: (i) => `${(i.unitPrice ?? 0).toLocaleString("ko-KR")}${common.currency}` },
          ]}
        />
      </Section>

      <Section title="환불 정보">
        <InfoGrid>
          <InfoItem label={L.refundAmount} value={`${(data.estimatedRefundAmount ?? 0).toLocaleString("ko-KR")}${common.currency}`} />
          <InfoItem label={L.refundMethod} value={data.refundMethod} />
        </InfoGrid>
      </Section>
    </DetailShell>
  );
}
