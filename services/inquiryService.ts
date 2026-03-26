import type { Inquiry, InquirySummary, InquiryListParams, InquiryType } from "@/types/inquiry";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_INQUIRY_TYPES: InquiryType[] = [
  { id: 1, name: "상품 문의" },
  { id: 2, name: "배송 문의" },
  { id: 3, name: "교환/반품" },
  { id: 4, name: "기타" },
];

const MOCK_INQUIRIES: Inquiry[] = Array.from({ length: 25 }, (_, i) => {
  const types = MOCK_INQUIRY_TYPES.map((t) => t.name);
  const titles = ["상품 재입고 문의", "배송 조회가 안 됩니다", "교환 절차 문의", "사이즈 추천 부탁드립니다", "결제 오류 문의"];
  const names = ["김민수", "이영희", "박지훈", "최수진", "정태호"];
  const isAnswered = i % 3 === 0;
  return {
    id: i + 1,
    type: types[i % types.length],
    title: titles[i % titles.length],
    content: `${titles[i % titles.length]}에 대한 상세 내용입니다. 빠른 답변 부탁드립니다.`,
    status: isAnswered ? "ANSWERED" as const : "WAITING" as const,
    answer: isAnswered ? "안녕하세요, 문의주신 내용 확인하였습니다. 해당 건은 처리 완료되었습니다." : null,
    answeredAt: isAnswered ? new Date(2026, 2, 25 - i + 1).toISOString() : null,
    userName: names[i % names.length],
    userEmail: `user${i + 1}@example.com`,
    attachments: [],
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

function toSummary(inq: Inquiry): InquirySummary {
  return { id: inq.id, type: inq.type, title: inq.title, userName: inq.userName, status: inq.status, createdAt: inq.createdAt };
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getInquiries(params?: InquiryListParams): Promise<PaginatedResponse<InquirySummary>> {
  await delay();
  let filtered = [...MOCK_INQUIRIES];
  if (params?.status) filtered = filtered.filter((inq) => inq.status === params.status);
  if (params?.type) filtered = filtered.filter((inq) => inq.type === params.type);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((inq) => inq.title.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size).map(toSummary), page, size, total_elements: filtered.length } };
}

export async function getInquiry(id: number): Promise<ApiResponse<Inquiry>> {
  await delay();
  const inq = MOCK_INQUIRIES.find((i) => i.id === id);
  if (!inq) throw new Error("문의를 찾을 수 없습니다.");
  return { success: true, data: inq };
}

export async function answerInquiry(id: number, answer: string): Promise<void> {
  await delay();
  const inq = MOCK_INQUIRIES.find((i) => i.id === id);
  if (inq) {
    inq.answer = answer;
    inq.answeredAt = new Date().toISOString();
    (inq as unknown as Record<string, unknown>).status = "ANSWERED";
  }
}

export async function deleteInquiry(id: number): Promise<void> {
  await delay();
  const idx = MOCK_INQUIRIES.findIndex((i) => i.id === id);
  if (idx !== -1) MOCK_INQUIRIES.splice(idx, 1);
}

export async function getInquiryTypes(): Promise<ApiResponse<InquiryType[]>> {
  await delay();
  return { success: true, data: MOCK_INQUIRY_TYPES };
}
