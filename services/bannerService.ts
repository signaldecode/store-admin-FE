import type { Banner, BannerFormData, BannerListParams } from "@/types/banner";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_BANNERS: Banner[] = Array.from({ length: 12 }, (_, i) => {
  const positions = ["HERO", "SLIDE", "HALF", "FULL"] as const;
  const statuses = ["ACTIVE", "INACTIVE", "SCHEDULED"] as const;
  return {
    id: i + 1,
    title: [`봄 신상품 출시`, `2026 S/S 컬렉션`, `회원 전용 할인`, `무료배송 이벤트`, `브랜드 위크`, `시즌 오프`][i % 6],
    position: positions[i % positions.length],
    imageUrl: `/images/banner-${i + 1}.jpg`,
    linkUrl: i % 3 === 0 ? "https://example.com/event" : null,
    sortOrder: i + 1,
    status: statuses[i % statuses.length],
    startedAt: "2026-03-01T00:00:00",
    endedAt: i % 4 === 0 ? null : "2026-04-30T23:59:59",
    noEndDate: i % 4 === 0,
    createdAt: new Date(2026, 2, 1 + i).toISOString(),
  };
});

let nextId = MOCK_BANNERS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getBanners(params?: BannerListParams): Promise<PaginatedResponse<Banner>> {
  await delay();
  let filtered = [...MOCK_BANNERS];
  if (params?.status) filtered = filtered.filter((b) => b.status === params.status);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((b) => b.title.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getBanner(id: number): Promise<ApiResponse<Banner>> {
  await delay();
  const banner = MOCK_BANNERS.find((b) => b.id === id);
  if (!banner) throw new Error("배너를 찾을 수 없습니다.");
  return { success: true, data: banner };
}

export async function createBanner(data: BannerFormData, _image?: File): Promise<ApiResponse<Banner>> {
  await delay();
  const banner: Banner = { ...data, id: nextId++, imageUrl: "/images/banner-new.jpg", endedAt: data.endedAt ?? null, linkUrl: data.linkUrl ?? null, sortOrder: data.sortOrder ?? MOCK_BANNERS.length + 1, createdAt: new Date().toISOString() };
  MOCK_BANNERS.push(banner);
  return { success: true, data: banner };
}

export async function updateBanner(id: number, data: BannerFormData, _image?: File): Promise<ApiResponse<Banner>> {
  await delay();
  const idx = MOCK_BANNERS.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("배너를 찾을 수 없습니다.");
  MOCK_BANNERS[idx] = { ...MOCK_BANNERS[idx], ...data, endedAt: data.endedAt ?? null, linkUrl: data.linkUrl ?? null };
  return { success: true, data: MOCK_BANNERS[idx] };
}

export async function deleteBanner(id: number): Promise<void> {
  await delay();
  const idx = MOCK_BANNERS.findIndex((b) => b.id === id);
  if (idx !== -1) MOCK_BANNERS.splice(idx, 1);
}
