import type { Popup, PopupFormData, PopupListParams } from "@/types/popup";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_POPUPS: Popup[] = [
  {
    id: 1,
    title: "봄 시즌 세일 안내",
    content: "<p>최대 50% 할인! 봄 시즌 특별 세일을 놓치지 마세요.</p>",
    type: "CENTER" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-01T00:00:00.000Z",
    endDate: "2026-03-31T23:59:59.000Z",
    createdAt: "2026-02-25T09:00:00.000Z",
    updatedAt: "2026-02-25T09:00:00.000Z",
  },
  {
    id: 2,
    title: "신규 회원 가입 이벤트",
    content: "<p>신규 가입 시 5,000원 할인 쿠폰을 드립니다.</p>",
    type: "CENTER" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-01T00:00:00.000Z",
    endDate: "2026-04-30T23:59:59.000Z",
    createdAt: "2026-02-20T09:00:00.000Z",
    updatedAt: "2026-02-20T09:00:00.000Z",
  },
  {
    id: 3,
    title: "배송 지연 안내",
    content: "<p>연휴 기간 배송이 1~2일 지연될 수 있습니다.</p>",
    type: "FLOATING" as const,
    status: "INACTIVE" as const,
    startDate: "2026-01-20T00:00:00.000Z",
    endDate: "2026-02-10T23:59:59.000Z",
    createdAt: "2026-01-18T09:00:00.000Z",
    updatedAt: "2026-02-11T09:00:00.000Z",
  },
  {
    id: 4,
    title: "앱 다운로드 프로모션",
    content: "<p>앱 전용 10% 추가 할인! 지금 다운로드하세요.</p>",
    type: "FLOATING" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-10T00:00:00.000Z",
    endDate: "2026-06-30T23:59:59.000Z",
    createdAt: "2026-03-08T09:00:00.000Z",
    updatedAt: "2026-03-08T09:00:00.000Z",
  },
  {
    id: 5,
    title: "개인정보처리방침 변경 안내",
    content: "<p>2026년 4월 1일부터 개인정보처리방침이 변경됩니다.</p>",
    type: "CENTER" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-15T00:00:00.000Z",
    endDate: "2026-04-15T23:59:59.000Z",
    createdAt: "2026-03-14T09:00:00.000Z",
    updatedAt: "2026-03-14T09:00:00.000Z",
  },
  {
    id: 6,
    title: "여름 신상품 출시 예고",
    content: "<p>2026 S/S 컬렉션이 곧 출시됩니다. 기대해주세요!</p>",
    type: "CENTER" as const,
    status: "INACTIVE" as const,
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-04-30T23:59:59.000Z",
    createdAt: "2026-03-20T09:00:00.000Z",
    updatedAt: "2026-03-20T09:00:00.000Z",
  },
  {
    id: 7,
    title: "포인트 적립 이벤트",
    content: "<p>리뷰 작성 시 포인트 2배 적립!</p>",
    type: "FLOATING" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-01T00:00:00.000Z",
    endDate: "2026-03-31T23:59:59.000Z",
    createdAt: "2026-02-28T09:00:00.000Z",
    updatedAt: "2026-02-28T09:00:00.000Z",
  },
  {
    id: 8,
    title: "시스템 점검 안내",
    content: "<p>3월 28일 02:00~06:00 시스템 점검이 예정되어 있습니다.</p>",
    type: "CENTER" as const,
    status: "ACTIVE" as const,
    startDate: "2026-03-25T00:00:00.000Z",
    endDate: "2026-03-28T23:59:59.000Z",
    createdAt: "2026-03-24T09:00:00.000Z",
    updatedAt: "2026-03-24T09:00:00.000Z",
  },
];

let nextId = MOCK_POPUPS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getPopups(params?: PopupListParams): Promise<PaginatedResponse<Popup>> {
  await delay();
  let filtered = [...MOCK_POPUPS];
  if (params?.status) filtered = filtered.filter((p) => p.status === params.status);
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getPopup(id: number): Promise<ApiResponse<Popup>> {
  await delay();
  const popup = MOCK_POPUPS.find((p) => p.id === id);
  if (!popup) throw new Error("팝업을 찾을 수 없습니다.");
  return { success: true, data: popup };
}

export async function createPopup(data: PopupFormData): Promise<ApiResponse<Popup>> {
  await delay();
  const popup: Popup = { ...data, id: nextId++, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  MOCK_POPUPS.unshift(popup);
  return { success: true, data: popup };
}

export async function updatePopup(id: number, data: PopupFormData): Promise<void> {
  await delay();
  const idx = MOCK_POPUPS.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("팝업을 찾을 수 없습니다.");
  MOCK_POPUPS[idx] = { ...MOCK_POPUPS[idx], ...data, updatedAt: new Date().toISOString() };
}

export async function deletePopup(id: number): Promise<void> {
  await delay();
  const idx = MOCK_POPUPS.findIndex((p) => p.id === id);
  if (idx !== -1) MOCK_POPUPS.splice(idx, 1);
}
