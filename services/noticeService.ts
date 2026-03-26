import type { Notice, NoticeFormData, NoticeListParams } from "@/types/notice";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_NOTICES: Notice[] = Array.from({ length: 15 }, (_, i) => {
  const types = ["NOTICE", "INSPECTION", "GUIDELINES", "EVENT"] as const;
  const titles = ["서비스 점검 안내", "봄맞이 이벤트 안내", "개인정보처리방침 변경", "배송 지연 안내", "신규 브랜드 입점 안내"];
  return {
    id: i + 1,
    type: types[i % types.length],
    title: titles[i % titles.length],
    content: `<p>${titles[i % titles.length]}에 대한 상세 내용입니다. 자세한 사항은 고객센터로 문의해주세요.</p>`,
    isPinned: i < 2,
    status: i % 5 === 4 ? "INACTIVE" as const : "ACTIVE" as const,
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
    updatedAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

let nextId = MOCK_NOTICES.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getNotices(params?: NoticeListParams): Promise<PaginatedResponse<Notice>> {
  await delay();
  let filtered = [...MOCK_NOTICES];
  if (params?.type) filtered = filtered.filter((n) => n.type === params.type);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((n) => n.title.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getNotice(id: number): Promise<ApiResponse<Notice>> {
  await delay();
  const notice = MOCK_NOTICES.find((n) => n.id === id);
  if (!notice) throw new Error("공지를 찾을 수 없습니다.");
  return { success: true, data: notice };
}

export async function createNotice(data: NoticeFormData): Promise<ApiResponse<Notice>> {
  await delay();
  const notice: Notice = { ...data, id: nextId++, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  MOCK_NOTICES.unshift(notice);
  return { success: true, data: notice };
}

export async function updateNotice(id: number, data: NoticeFormData): Promise<ApiResponse<Notice>> {
  await delay();
  const idx = MOCK_NOTICES.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("공지를 찾을 수 없습니다.");
  MOCK_NOTICES[idx] = { ...MOCK_NOTICES[idx], ...data, updatedAt: new Date().toISOString() };
  return { success: true, data: MOCK_NOTICES[idx] };
}

export async function deleteNotice(id: number): Promise<void> {
  await delay();
  const idx = MOCK_NOTICES.findIndex((n) => n.id === id);
  if (idx !== -1) MOCK_NOTICES.splice(idx, 1);
}
