import type { Review, ReviewListParams } from "@/types/review";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_REVIEWS: Review[] = Array.from({ length: 30 }, (_, i) => {
  const products = ["오버핏 코튼 티셔츠", "슬림핏 데님 팬츠", "울 블렌드 코트", "캐시미어 니트", "리넨 셔츠"];
  const names = ["김민수", "이영희", "박지훈", "최수진", "정태호"];
  const contents = [
    "핏이 너무 좋아요! 재구매 의사 있습니다.",
    "색상이 사진과 조금 달라요. 그래도 만족합니다.",
    "배송이 빠르고 포장도 꼼꼼했습니다.",
    "사이즈가 약간 작아요. 한 사이즈 업 추천합니다.",
    "가격 대비 품질이 좋습니다. 추천해요!",
  ];
  return {
    id: i + 1,
    rating: 3 + (i % 3),
    content: contents[i % contents.length],
    images: i % 4 === 0 ? [`/images/review-${i + 1}.jpg`] : [],
    isVisible: i % 7 !== 0,
    userName: names[i % names.length],
    productId: (i % 5) + 1,
    productName: products[i % products.length],
    createdAt: new Date(2026, 2, 25 - i).toISOString(),
  };
});

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getReviews(params?: ReviewListParams): Promise<PaginatedResponse<Review>> {
  await delay();
  let filtered = [...MOCK_REVIEWS];
  if (params?.isVisible !== undefined) filtered = filtered.filter((r) => r.isVisible === params.isVisible);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((r) => r.productName.toLowerCase().includes(kw) || r.userName.toLowerCase().includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size), page, size, total_elements: filtered.length } };
}

export async function getReview(id: number): Promise<ApiResponse<Review>> {
  await delay();
  const review = MOCK_REVIEWS.find((r) => r.id === id);
  if (!review) throw new Error("리뷰를 찾을 수 없습니다.");
  return { success: true, data: review };
}

export async function toggleReviewVisibility(ids: number[]): Promise<void> {
  await delay();
  ids.forEach((id) => {
    const review = MOCK_REVIEWS.find((r) => r.id === id);
    if (review) review.isVisible = !review.isVisible;
  });
}
