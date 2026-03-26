import type { ApiResponse } from "@/types/api";

// ─── Types ───

export interface DisplaySection {
  id: number;
  keyword: string;
  title: string;
  isActive: boolean;
  limit: number;
}

// ─── Mock data ───

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockSections: DisplaySection[] = [
  { id: 1, keyword: "best", title: "베스트 상품", isActive: true, limit: 20 },
  { id: 2, keyword: "new", title: "신상품", isActive: true, limit: 20 },
  { id: 3, keyword: "recommend", title: "추천 상품", isActive: true, limit: 12 },
  { id: 4, keyword: "review", title: "리뷰 베스트", isActive: false, limit: 10 },
  { id: 5, keyword: "slide_banner", title: "슬라이드 배너", isActive: true, limit: 5 },
  { id: 6, keyword: "half_banner", title: "하프 배너", isActive: true, limit: 2 },
  { id: 7, keyword: "full_banner", title: "풀 배너", isActive: false, limit: 1 },
  { id: 8, keyword: "instagram", title: "인스타그램", isActive: false, limit: 9 },
  { id: 9, keyword: "category", title: "카테고리", isActive: true, limit: 8 },
];

// ─── Service functions ───

export async function getDisplaySections(): Promise<ApiResponse<DisplaySection[]>> {
  await delay(300);
  return { success: true, data: structuredClone(mockSections) };
}

export async function updateDisplaySections(
  data: DisplaySection[],
  _bannerImage?: File,
): Promise<void> {
  await delay(300);
  mockSections.length = 0;
  mockSections.push(...data);
}
