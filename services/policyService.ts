import type { ApiResponse } from "@/types/api";

// ─── Types ───

export interface Policy {
  order: string;
  delivery: string;
  product: string;
  returns: string;
}

// ─── Mock data ───

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockPolicy: Policy = {
  order: "주문 후 결제 확인까지 최대 1영업일이 소요됩니다.",
  delivery: "배송은 결제 확인 후 1~3 영업일 이내 출고됩니다.",
  product: "상품 이미지는 실제와 다를 수 있습니다.",
  returns: "수령 후 7일 이내 반품/교환 가능합니다.",
};

// ─── Service functions ───

export async function getPolicy(): Promise<ApiResponse<Policy>> {
  await delay(300);
  return { success: true, data: structuredClone(mockPolicy) };
}

export async function updatePolicy(data: Policy): Promise<void> {
  await delay(300);
  Object.assign(mockPolicy, data);
}
