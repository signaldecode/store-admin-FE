import type { Qna, QnaSummary, QnaListParams } from "@/types/qna";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const productNames = ["오버핏 코튼 티셔츠", "슬림핏 데님 팬츠", "캐시미어 니트", "경량 패딩 자켓", "린넨 셔츠"];
const userNames = ["김민수", "이영희", "박지훈", "최수진", "정태호", "한소연", "오준혁", "윤서아", "강도윤", "임채은"];
const titles = [
  "사이즈 추천 부탁드립니다",
  "색상이 사진과 다른가요?",
  "세탁 방법이 궁금합니다",
  "재입고 예정이 있나요?",
  "소재 혼용률이 궁금합니다",
  "기장이 어느 정도인가요?",
  "실착 사진이 있을까요?",
  "배송 전 사이즈 변경 가능한가요?",
  "품절된 사이즈 재입고 문의",
  "다른 색상도 출시 예정인가요?",
];
const contents = [
  "평소 M 사이즈를 입는데 이 제품도 M으로 주문하면 될까요?",
  "모니터마다 색상이 다르게 보일 수 있다고 하는데 실제 색상은 어떤가요?",
  "드라이클리닝만 가능한가요? 손세탁도 괜찮을까요?",
  "품절된 상품인데 재입고 예정일이 있으면 알려주세요.",
  "상품 상세에 소재 정보가 없어서 문의드립니다.",
  "키 170cm 기준 기장이 어느 정도인지 알고 싶습니다.",
  "모델 착용 사진 외에 실착 사진이 있으면 공유 부탁드립니다.",
  "주문했는데 아직 발송 전이라 사이즈를 변경하고 싶습니다.",
  "S 사이즈가 품절인데 재입고 가능할까요?",
  "블랙 외에 다른 색상도 출시 예정이 있나요?",
];

const MOCK_QNAS: Qna[] = Array.from({ length: 20 }, (_, i) => {
  const isAnswered = i % 3 !== 2;
  const isSecret = i % 4 === 0;
  return {
    id: i + 1,
    productId: (i % 5) + 1,
    productName: productNames[i % productNames.length],
    title: titles[i % titles.length],
    content: contents[i % contents.length],
    isSecret,
    status: isAnswered ? "ANSWERED" as const : "WAITING" as const,
    answer: isAnswered ? "안녕하세요, 문의 감사합니다. 해당 내용 확인 후 안내드리겠습니다. 추가 문의 사항이 있으시면 편하게 남겨주세요." : null,
    answeredAt: isAnswered ? new Date(2026, 2, 25 - i + 1).toISOString() : null,
    userName: userNames[i % userNames.length],
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

function toSummary(qna: Qna): QnaSummary {
  return {
    id: qna.id,
    productName: qna.productName,
    title: qna.title,
    userName: qna.userName,
    isSecret: qna.isSecret,
    status: qna.status,
    createdAt: qna.createdAt,
  };
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getQnas(params?: QnaListParams): Promise<PaginatedResponse<QnaSummary>> {
  await delay();
  let filtered = [...MOCK_QNAS];
  if (params?.productId) filtered = filtered.filter((q) => q.productId === params.productId);
  if (params?.status) filtered = filtered.filter((q) => q.status === params.status);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((q) => q.title.toLowerCase().includes(kw) || q.content.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size).map(toSummary), page, size, total_elements: filtered.length } };
}

export async function getQna(id: number): Promise<ApiResponse<Qna>> {
  await delay();
  const qna = MOCK_QNAS.find((q) => q.id === id);
  if (!qna) throw new Error("QnA를 찾을 수 없습니다.");
  return { success: true, data: qna };
}

export async function answerQna(id: number, answer: string): Promise<void> {
  await delay();
  const qna = MOCK_QNAS.find((q) => q.id === id);
  if (qna) {
    qna.answer = answer;
    qna.answeredAt = new Date().toISOString();
    (qna as unknown as Record<string, unknown>).status = "ANSWERED";
  }
}
