"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrder } from "@/services/orderService";
import { createShipment, refreshOrderTracking } from "@/services/deliveryService";
import { createRefund } from "@/services/refundService";
import type { Order } from "@/types/order";
import { order as L, common, ORDER_STATUS_LABEL } from "@/data/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DetailShell, DetailLoading, DetailNotFound,
  Section, InfoGrid, InfoItem, SimpleTable,
} from "@/components/common/DetailPage";

export default function OrderDetailPage() {
  const id = Number(useParams().id);
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /* 배송 관리 */
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [carrierId, setCarrierId] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentLoading, setShipmentLoading] = useState(false);

  /* 환불 */
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  useEffect(() => {
    getOrder(id).then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (data) setRefundAmount(String(data.totalAmount));
  }, [data]);

  const handleCreateShipment = async () => {
    if (!data || !carrierId || !trackingNumber) return;
    setShipmentLoading(true);
    try {
      await createShipment(data.id, {
        carrierId: Number(carrierId),
        trackingNumber,
        items: data.items.map((item) => ({ orderItemId: item.id, quantity: item.quantity })),
      });
      setShowShipmentForm(false);
      setCarrierId("");
      setTrackingNumber("");
    } catch {
      /* error handled by fetch wrapper */
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleRefreshTracking = async () => {
    if (!data) return;
    setShipmentLoading(true);
    try {
      await refreshOrderTracking(data.id);
    } catch {
      /* error handled by fetch wrapper */
    } finally {
      setShipmentLoading(false);
    }
  };

  const handleCreateRefund = async () => {
    if (!data || !refundAmount || !refundReason) return;
    setRefundLoading(true);
    try {
      await createRefund({ orderId: data.id, amount: Number(refundAmount), reason: refundReason });
      setRefundReason("");
    } catch {
      /* error handled by fetch wrapper */
    } finally {
      setRefundLoading(false);
    }
  };

  if (loading) return <DetailLoading />;
  if (!data) return <DetailNotFound message={L.notFound} backHref="/orders" />;

  const showRefund = data.status === "CANCELLED" || data.status === "REFUNDED";

  return (
    <DetailShell title={`${L.detailTitle} — ${data.orderNumber}`} backHref="/orders">
      <Section title={L.sectionOrderInfo}>
        <InfoGrid>
          <InfoItem label={L.colOrderNumber} value={data.orderNumber} />
          <InfoItem label={L.colStatus} badge={{ text: ORDER_STATUS_LABEL[data.status] }} />
          <InfoItem label={L.colCustomer} value={data.customerName} />
          <InfoItem label={L.colCreatedAt} value={new Date(data.createdAt).toLocaleDateString("ko-KR")} />
        </InfoGrid>
      </Section>

      <Section title={L.sectionItems}>
        <SimpleTable
          data={data.items}
          keyExtractor={(i) => i.id}
          columns={[
            { label: "상품명", render: (i) => i.productName },
            { label: "옵션", render: (i) => <span className="text-muted-foreground">{i.optionSummary}</span> },
            { label: "수량", align: "right", render: (i) => i.quantity },
            { label: "단가", align: "right", render: (i) => `${i.unitPrice.toLocaleString("ko-KR")}${common.currency}` },
            { label: "합계", align: "right", render: (i) => <span className="font-medium">{i.totalPrice.toLocaleString("ko-KR")}{common.currency}</span> },
          ]}
        />
      </Section>

      <Section title={L.sectionShipping}>
        <InfoGrid>
          <InfoItem label={L.recipientName} value={data.shippingAddress.recipientName} />
          <InfoItem label={L.recipientPhone} value={data.shippingAddress.phone} />
          <InfoItem label={L.address} value={`(${data.shippingAddress.zipCode}) ${data.shippingAddress.address} ${data.shippingAddress.addressDetail}`} full />
          {data.shippingAddress.memo && <InfoItem label={L.shippingMemo} value={data.shippingAddress.memo} full />}
        </InfoGrid>
      </Section>

      <Section title={L.sectionPayment}>
        <InfoGrid>
          <InfoItem label={L.paymentMethod} value={data.payment.method} />
          <InfoItem label={L.colTotalAmount} value={`${data.payment.amount.toLocaleString("ko-KR")}${common.currency}`} />
          <InfoItem label={L.paidAt} value={data.payment.paidAt ? new Date(data.payment.paidAt).toLocaleDateString("ko-KR") : "-"} />
        </InfoGrid>
      </Section>

      {/* 배송 관리 */}
      <Section title={L.sectionDelivery}>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowShipmentForm((v) => !v)}>
            {L.registerInvoice}
          </Button>
          <Button size="sm" variant="outline" onClick={handleRefreshTracking} disabled={shipmentLoading}>
            {L.refreshTracking}
          </Button>
        </div>

        {showShipmentForm && (
          <div className="mt-4 flex flex-col gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="carrierId" className="text-sm font-medium">
                {L.carrierId}
              </label>
              <Input
                id="carrierId"
                type="number"
                placeholder={L.carrierIdPlaceholder}
                value={carrierId}
                onChange={(e) => setCarrierId(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="trackingNumber" className="text-sm font-medium">
                {L.trackingNumber}
              </label>
              <Input
                id="trackingNumber"
                placeholder={L.trackingNumberPlaceholder}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateShipment} disabled={shipmentLoading || !carrierId || !trackingNumber}>
                {L.submitShipment}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowShipmentForm(false)}>
                {common.cancel}
              </Button>
            </div>
          </div>
        )}
      </Section>

      {/* 환불 — 취소/환불 상태일 때만 표시 */}
      {showRefund && (
        <Section title={L.sectionRefund}>
          <div className="flex flex-col gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="refundAmount" className="text-sm font-medium">
                {L.refundAmount}
              </label>
              <Input
                id="refundAmount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="refundReason" className="text-sm font-medium">
                {L.refundReason}
              </label>
              <Textarea
                id="refundReason"
                placeholder={L.refundReasonPlaceholder}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Button size="sm" onClick={handleCreateRefund} disabled={refundLoading || !refundAmount || !refundReason}>
                {L.submitRefund}
              </Button>
            </div>
          </div>
        </Section>
      )}
    </DetailShell>
  );
}
