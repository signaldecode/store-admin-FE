import type { Tag } from "@/types/tag";
import type { ApiResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_TAGS: Tag[] = [
  { id: 1, name: "신상품", createdAt: "2026-01-10T09:00:00.000Z" },
  { id: 2, name: "베스트", createdAt: "2026-01-10T09:00:00.000Z" },
  { id: 3, name: "세일", createdAt: "2026-01-15T09:00:00.000Z" },
  { id: 4, name: "한정판", createdAt: "2026-01-20T09:00:00.000Z" },
  { id: 5, name: "추천", createdAt: "2026-02-01T09:00:00.000Z" },
  { id: 6, name: "인기", createdAt: "2026-02-05T09:00:00.000Z" },
  { id: 7, name: "시즌오프", createdAt: "2026-02-10T09:00:00.000Z" },
  { id: 8, name: "단독", createdAt: "2026-02-15T09:00:00.000Z" },
  { id: 9, name: "무료배송", createdAt: "2026-03-01T09:00:00.000Z" },
  { id: 10, name: "사은품", createdAt: "2026-03-10T09:00:00.000Z" },
];

let nextId = MOCK_TAGS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getTags(): Promise<ApiResponse<Tag[]>> {
  await delay();
  return { success: true, data: [...MOCK_TAGS] };
}

export async function createTag(name: string): Promise<ApiResponse<Tag>> {
  await delay();
  const tag: Tag = { id: nextId++, name, createdAt: new Date().toISOString() };
  MOCK_TAGS.push(tag);
  return { success: true, data: tag };
}
