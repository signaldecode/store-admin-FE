import type { Claim, ClaimSummary, ClaimListParams } from "@/types/claim";
import type { ClaimType } from "@/lib/constants";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_CLAIMS: Claim[] = Array.from({ length: 20 }, (_, i) => {
  const types = ["CANCEL", "RETURN", "EXCHANGE"] as const;
  const statuses = ["REQUESTED", "APPROVED", "IN_PROGRESS", "COMPLETED", "REJECTED"] as const;
  const reasons = ["단순 변심", "상품 불량", "오배송", "사이즈 불일치", "색상 다름"];
  return {
    id: i + 1,
    orderNumber: `ORD-2026${String(i + 100).padStart(6, "0")}`,
    claimType: types[i % types.length],
    reasonType: reasons[i % reasons.length],
    reason: `${reasons[i % reasons.length]} — 상세 사유 설명입니다.`,
    status: statuses[i % statuses.length],
    items: [
      { id: i * 10 + 1, productName: "오버핏 코튼 티셔츠", optionSummary: "블랙 / M", quantity: 1, unitPrice: 29000 },
    ],
    estimatedRefundAmount: 29000 + i * 500,
    refundMethod: i % 2 === 0 ? "카드 취소" : "계좌 환불",
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
    updatedAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

function toSummary(c: Claim): ClaimSummary {
  return { id: c.id, orderNumber: c.orderNumber, claimType: c.claimType, reasonType: c.reasonType, status: c.status, estimatedRefundAmount: c.estimatedRefundAmount, createdAt: c.createdAt };
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getClaims(params?: ClaimListParams): Promise<PaginatedResponse<ClaimSummary>> {
  await delay();
  let filtered = [...MOCK_CLAIMS];
  if (params?.claimType) filtered = filtered.filter((c) => c.claimType === params.claimType);
  if (params?.status) filtered = filtered.filter((c) => c.status === params.status);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((c) => c.orderNumber.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size).map(toSummary), page, size, total_elements: filtered.length } };
}

export async function getClaim(id: number): Promise<ApiResponse<Claim>> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === id);
  if (!claim) throw new Error("클레임을 찾을 수 없습니다.");
  return { success: true, data: claim };
}

export async function approveClaim(id: number): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === id);
  if (claim) (claim as unknown as Record<string, unknown>).status = "APPROVED";
}

export async function rejectClaim(id: number): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === id);
  if (claim) (claim as unknown as Record<string, unknown>).status = "REJECTED";
}

export async function completeClaim(id: number): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === id);
  if (claim) (claim as unknown as Record<string, unknown>).status = "COMPLETED";
}

export async function returnShipping(claimId: number, carrierId: number, trackingNumber: string): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === claimId);
  if (claim) (claim as unknown as Record<string, unknown>).status = "IN_PROGRESS";
  void carrierId;
  void trackingNumber;
}

export async function receiveInspect(claimId: number, passInspection: boolean, reason?: string): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === claimId);
  if (claim) {
    (claim as unknown as Record<string, unknown>).status = passInspection ? "APPROVED" : "REJECTED";
  }
  void reason;
}

export async function exchangeComplete(claimId: number, carrierId: number, trackingNumber: string): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === claimId);
  if (claim) (claim as unknown as Record<string, unknown>).status = "COMPLETED";
  void carrierId;
  void trackingNumber;
}

export async function reship(claimId: number, carrierId: number, trackingNumber: string): Promise<void> {
  await delay();
  const claim = MOCK_CLAIMS.find((c) => c.id === claimId);
  if (claim) (claim as unknown as Record<string, unknown>).status = "IN_PROGRESS";
  void carrierId;
  void trackingNumber;
}

export async function createClaim(data: { orderItemId: number; type: string; reason: string; reasonType: string }): Promise<ApiResponse<Claim>> {
  await delay();
  const claim: Claim = {
    id: Date.now(),
    orderNumber: "ORD-2026000099",
    claimType: data.type as ClaimType,
    reasonType: data.reasonType,
    reason: data.reason,
    status: "REQUESTED",
    items: [{ id: 1, productName: "상품", optionSummary: "", quantity: 1, unitPrice: 29000 }],
    estimatedRefundAmount: 29000,
    refundMethod: "카드 취소",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_CLAIMS.unshift(claim);
  return { success: true, data: claim };
}
