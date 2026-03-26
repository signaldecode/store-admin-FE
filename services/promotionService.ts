import type { Promotion, PromotionFormData, PromotionListParams } from "@/types/promotion";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_PROMOTIONS: Promotion[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: [`봄맞이 10% 할인`, `신규회원 5천원 할인`, `브랜드위크 20%`, `주말 특가`, `시즌오프 30%`][i % 5],
  isActive: i % 3 !== 2,
  discountType: i % 2 === 0 ? "RATE" as const : "AMOUNT" as const,
  discountValue: i % 2 === 0 ? 10 + i : 3000 + i * 1000,
  applicableCategories: [1, 2],
  startedAt: "2026-03-01T00:00:00",
  endedAt: "2026-04-30T23:59:59",
  createdAt: new Date(2026, 2, 20 - i).toISOString(),
}));

let nextId = MOCK_PROMOTIONS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getPromotions(params?: PromotionListParams): Promise<PaginatedResponse<Promotion>> {
  await delay();
  let filtered = [...MOCK_PROMOTIONS];
  if (params?.isActive !== undefined) filtered = filtered.filter((p) => p.isActive === params.isActive);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getPromotion(id: number): Promise<ApiResponse<Promotion>> {
  await delay();
  const promo = MOCK_PROMOTIONS.find((p) => p.id === id);
  if (!promo) throw new Error("프로모션을 찾을 수 없습니다.");
  return { success: true, data: promo };
}

export async function createPromotion(data: PromotionFormData): Promise<ApiResponse<Promotion>> {
  await delay();
  const promo: Promotion = { ...data, id: nextId++, createdAt: new Date().toISOString() };
  MOCK_PROMOTIONS.unshift(promo);
  return { success: true, data: promo };
}

export async function updatePromotion(id: number, data: PromotionFormData): Promise<ApiResponse<Promotion>> {
  await delay();
  const idx = MOCK_PROMOTIONS.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("프로모션을 찾을 수 없습니다.");
  MOCK_PROMOTIONS[idx] = { ...MOCK_PROMOTIONS[idx], ...data };
  return { success: true, data: MOCK_PROMOTIONS[idx] };
}
