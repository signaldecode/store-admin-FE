import type { Coupon, CouponFormData, CouponListParams } from "@/types/coupon";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_COUPONS: Coupon[] = Array.from({ length: 15 }, (_, i) => {
  const statuses = ["REGISTERED", "ACTIVE", "STOPPED", "ENDED", "RECALLED"] as const;
  const couponTypes = ["PRODUCT_DISCOUNT", "FREE_SHIPPING"] as const;
  const validityTypes = ["DAYS_FROM_DOWNLOAD", "FIXED_PERIOD"] as const;
  return {
    id: i + 1,
    name: [`신규가입 쿠폰`, `VIP 전용 쿠폰`, `생일 축하 쿠폰`, `리뷰 작성 쿠폰`, `시즌 특별 쿠폰`][i % 5],
    description: "할인 쿠폰입니다.",
    couponType: couponTypes[i % couponTypes.length] as typeof couponTypes[number],
    discountType: i % 2 === 0 ? "RATE" as const : "AMOUNT" as const,
    discountValue: i % 2 === 0 ? 10 + (i % 20) : 3000 + i * 500,
    maxDiscountAmount: i % 2 === 0 ? 10000 : null,
    minOrderAmount: 30000 + i * 5000,
    totalQuantity: 100 + i * 50,
    issuedCount: 10 + i * 5,
    validityType: validityTypes[i % validityTypes.length] as typeof validityTypes[number],
    validityDays: i % 2 === 0 ? 30 : null,
    validFrom: "2026-03-01T00:00:00",
    validTo: "2026-06-30T23:59:59",
    allowPromotionOverlap: i % 3 === 0,
    allowDuplicateUse: i % 4 === 0,
    notice: i % 2 === 0 ? "다른 쿠폰과 중복 사용이 불가합니다." : "",
    status: statuses[i % statuses.length],
    createdAt: new Date(2026, 2, 20 - i).toISOString(),
  };
});

let nextId = MOCK_COUPONS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getCoupons(params?: CouponListParams): Promise<PaginatedResponse<Coupon>> {
  await delay();
  let filtered = [...MOCK_COUPONS];
  if (params?.status) filtered = filtered.filter((c) => c.status === params.status);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getCoupon(id: number): Promise<ApiResponse<Coupon>> {
  await delay();
  const coupon = MOCK_COUPONS.find((c) => c.id === id);
  if (!coupon) throw new Error("쿠폰을 찾을 수 없습니다.");
  return { success: true, data: coupon };
}

export async function createCoupon(data: CouponFormData): Promise<ApiResponse<Coupon>> {
  await delay();
  const coupon: Coupon = { ...data, id: nextId++, issuedCount: 0, status: "REGISTERED", maxDiscountAmount: data.maxDiscountAmount ?? null, validityDays: data.validityDays ?? null, createdAt: new Date().toISOString() };
  MOCK_COUPONS.unshift(coupon);
  return { success: true, data: coupon };
}

export async function updateCoupon(id: number, data: CouponFormData): Promise<ApiResponse<Coupon>> {
  await delay();
  const idx = MOCK_COUPONS.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("쿠폰을 찾을 수 없습니다.");
  MOCK_COUPONS[idx] = { ...MOCK_COUPONS[idx], ...data, maxDiscountAmount: data.maxDiscountAmount ?? null, validityDays: data.validityDays ?? null };
  return { success: true, data: MOCK_COUPONS[idx] };
}

export async function deleteCoupon(id: number): Promise<void> {
  await delay();
  const idx = MOCK_COUPONS.findIndex((c) => c.id === id);
  if (idx !== -1) MOCK_COUPONS.splice(idx, 1);
}

export async function toggleCouponVisibility(id: number): Promise<ApiResponse<Coupon>> {
  await delay();
  const coupon = MOCK_COUPONS.find((c) => c.id === id);
  if (!coupon) throw new Error("쿠폰을 찾을 수 없습니다.");
  return { success: true, data: coupon };
}

export async function updateCouponStatus(id: number, status: string): Promise<ApiResponse<Coupon>> {
  await delay();
  const coupon = MOCK_COUPONS.find((c) => c.id === id);
  if (!coupon) throw new Error("쿠폰을 찾을 수 없습니다.");
  (coupon as unknown as Record<string, unknown>).status = status;
  return { success: true, data: coupon };
}

export async function recallCoupon(id: number): Promise<ApiResponse<Coupon>> {
  await delay();
  const coupon = MOCK_COUPONS.find((c) => c.id === id);
  if (!coupon) throw new Error("쿠폰을 찾을 수 없습니다.");
  (coupon as unknown as Record<string, unknown>).status = "RECALLED";
  return { success: true, data: coupon };
}
