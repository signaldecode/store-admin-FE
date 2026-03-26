import type { Faq, FaqCategory, FaqFormData, FaqListParams } from "@/types/faq";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_FAQ_CATEGORIES: FaqCategory[] = [
  { id: 1, name: "상품" },
  { id: 2, name: "배송" },
  { id: 3, name: "교환/반품" },
];

let nextCategoryId = MOCK_FAQ_CATEGORIES.length + 1;

const questions: Record<number, string[]> = {
  1: ["상품 품질은 어떻게 보증되나요?", "상품 사이즈는 어떻게 확인하나요?", "상품 재입고 알림을 받을 수 있나요?", "상품 리뷰는 어떻게 작성하나요?", "상품 상세 정보는 어디서 확인하나요?"],
  2: ["배송은 얼마나 걸리나요?", "배송비는 얼마인가요?", "해외 배송이 가능한가요?", "배송 추적은 어떻게 하나요?", "배송지 변경이 가능한가요?"],
  3: ["교환/반품 절차는 어떻게 되나요?", "교환/반품 시 배송비는 누가 부담하나요?", "반품 후 환불은 언제 되나요?", "교환 가능 기간은 얼마인가요?", "불량 상품은 어떻게 처리하나요?"],
};

const answers: Record<number, string[]> = {
  1: [
    "모든 상품은 입고 시 품질 검수를 거치며, 불량 발견 시 즉시 교환/환불 처리됩니다.",
    "각 상품 상세 페이지에 사이즈 가이드가 제공됩니다. 실측 사이즈를 참고해주세요.",
    "상품 상세 페이지에서 '재입고 알림' 버튼을 클릭하시면 알림을 받으실 수 있습니다.",
    "주문 완료 후 마이페이지 > 주문내역에서 리뷰 작성이 가능합니다.",
    "상품 상세 페이지에서 소재, 사이즈, 세탁 방법 등 상세 정보를 확인하실 수 있습니다.",
  ],
  2: [
    "일반 배송은 결제 완료 후 2~3 영업일 이내에 도착합니다.",
    "50,000원 이상 구매 시 무료배송이며, 미만 시 3,000원의 배송비가 부과됩니다.",
    "현재 해외 배송은 지원하지 않습니다. 추후 서비스 확대 예정입니다.",
    "마이페이지 > 주문내역에서 운송장 번호를 확인하시고, 택배사 홈페이지에서 추적 가능합니다.",
    "상품 발송 전까지 배송지 변경이 가능합니다. 고객센터로 문의해주세요.",
  ],
  3: [
    "마이페이지 > 주문내역에서 교환/반품 신청이 가능합니다. 신청 후 택배 기사가 수거 방문합니다.",
    "단순 변심의 경우 고객 부담이며, 상품 불량의 경우 무료로 처리됩니다.",
    "반품 상품 수거 확인 후 2~3 영업일 이내에 환불 처리됩니다.",
    "상품 수령일로부터 7일 이내에 교환 신청이 가능합니다.",
    "불량 상품은 사진과 함께 고객센터로 접수해주시면 무상 교환/환불 처리됩니다.",
  ],
};

const MOCK_FAQS: Faq[] = Array.from({ length: 15 }, (_, i) => {
  const categoryId = (i % 3) + 1;
  const category = MOCK_FAQ_CATEGORIES.find((c) => c.id === categoryId)!;
  const qIdx = Math.floor(i / 3);
  return {
    id: i + 1,
    categoryId,
    categoryName: category.name,
    question: questions[categoryId][qIdx],
    answer: answers[categoryId][qIdx],
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
    updatedAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

let nextFaqId = MOCK_FAQS.length + 1;

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Category API ───

export async function getFaqCategories(): Promise<ApiResponse<FaqCategory[]>> {
  await delay();
  return { success: true, data: [...MOCK_FAQ_CATEGORIES] };
}

export async function createFaqCategory(name: string): Promise<ApiResponse<FaqCategory>> {
  await delay();
  const category: FaqCategory = { id: nextCategoryId++, name };
  MOCK_FAQ_CATEGORIES.push(category);
  return { success: true, data: category };
}

export async function updateFaqCategory(id: number, name: string): Promise<void> {
  await delay();
  const cat = MOCK_FAQ_CATEGORIES.find((c) => c.id === id);
  if (cat) cat.name = name;
}

export async function deleteFaqCategory(id: number): Promise<void> {
  await delay();
  const idx = MOCK_FAQ_CATEGORIES.findIndex((c) => c.id === id);
  if (idx !== -1) MOCK_FAQ_CATEGORIES.splice(idx, 1);
}

// ─── FAQ API ───

export async function getFaqs(params?: FaqListParams): Promise<PaginatedResponse<Faq>> {
  await delay();
  let filtered = [...MOCK_FAQS];
  if (params?.categoryId) filtered = filtered.filter((f) => f.categoryId === params.categoryId);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((f) => f.question.toLowerCase().includes(kw) || f.answer.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getFaq(id: number): Promise<ApiResponse<Faq>> {
  await delay();
  const faq = MOCK_FAQS.find((f) => f.id === id);
  if (!faq) throw new Error("FAQ를 찾을 수 없습니다.");
  return { success: true, data: faq };
}

export async function createFaq(data: FaqFormData): Promise<ApiResponse<Faq>> {
  await delay();
  const category = MOCK_FAQ_CATEGORIES.find((c) => c.id === data.categoryId);
  const faq: Faq = {
    ...data,
    id: nextFaqId++,
    categoryName: category?.name ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  MOCK_FAQS.unshift(faq);
  return { success: true, data: faq };
}

export async function updateFaq(id: number, data: FaqFormData): Promise<void> {
  await delay();
  const idx = MOCK_FAQS.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("FAQ를 찾을 수 없습니다.");
  const category = MOCK_FAQ_CATEGORIES.find((c) => c.id === data.categoryId);
  MOCK_FAQS[idx] = { ...MOCK_FAQS[idx], ...data, categoryName: category?.name ?? "", updatedAt: new Date().toISOString() };
}

export async function deleteFaq(id: number): Promise<void> {
  await delay();
  const idx = MOCK_FAQS.findIndex((f) => f.id === id);
  if (idx !== -1) MOCK_FAQS.splice(idx, 1);
}
