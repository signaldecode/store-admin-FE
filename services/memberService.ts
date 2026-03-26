import type { Member, MemberSummary, MemberListParams, Grade, PointHistory, CsMemo, PointAdjustRequest } from "@/types/member";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

// ─── Mock Data ───
const MOCK_GRADES: Grade[] = [
  { id: 1, name: "일반", minAmount: 0, iconUrl: null, couponIds: [] },
  { id: 2, name: "실버", minAmount: 100000, iconUrl: null, couponIds: [1] },
  { id: 3, name: "골드", minAmount: 300000, iconUrl: null, couponIds: [1, 2] },
  { id: 4, name: "VIP", minAmount: 500000, iconUrl: null, couponIds: [1, 2, 3] },
];

const MOCK_MEMBERS: Member[] = Array.from({ length: 40 }, (_, i) => {
  const names = ["김민수", "이영희", "박지훈", "최수진", "정태호", "한소영", "오준혁", "장미래"];
  const statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "DORMANT", "WITHDRAWN"] as const;
  return {
    id: i + 1,
    email: `user${i + 1}@example.com`,
    name: names[i % names.length],
    phone: `010-${String(1000 + i).slice(0, 4)}-${String(5000 + i).slice(0, 4)}`,
    status: statuses[i % statuses.length],
    grade: MOCK_GRADES[i % MOCK_GRADES.length].name,
    totalOrderAmount: 50000 * (i + 1),
    pointBalance: 1000 * (i % 10),
    createdAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
    updatedAt: new Date(2026, 2, 25).toISOString(),
  };
});

const MOCK_MEMOS: Record<number, CsMemo[]> = {
  1: [
    { id: 1, content: "배송 지연 관련 문의 — 택배사 연락 완료", adminName: "관리자1", createdAt: "2026-03-20T09:00:00", updatedAt: "2026-03-20T09:00:00" },
  ],
};

function toSummary(m: Member): MemberSummary {
  return { id: m.id, email: m.email, name: m.name, phone: m.phone, status: m.status, grade: m.grade, createdAt: m.createdAt };
}

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getMembers(params?: MemberListParams): Promise<PaginatedResponse<MemberSummary>> {
  await delay();
  let filtered = [...MOCK_MEMBERS];
  if (params?.status) filtered = filtered.filter((m) => m.status === params.status);
  if (params?.grade) filtered = filtered.filter((m) => m.grade === params.grade);
  if (params?.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((m) => m.name.includes(kw) || m.email.includes(kw));
  }
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;
  const start = (page - 1) * size;
  return { success: true, data: { content: filtered.slice(start, start + size).map(toSummary), page, size, total_elements: filtered.length } };
}

export async function getMember(id: number): Promise<ApiResponse<Member>> {
  await delay();
  const member = MOCK_MEMBERS.find((m) => m.id === id);
  if (!member) throw new Error("회원을 찾을 수 없습니다.");
  return { success: true, data: member };
}

export async function getMemberPoints(memberId: number): Promise<ApiResponse<PointHistory[]>> {
  await delay();
  const histories: PointHistory[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    type: (["EARN", "USE", "ADJUST"] as const)[i % 3],
    amount: i % 3 === 1 ? -500 * (i + 1) : 1000 * (i + 1),
    reason: ["상품 구매 적립", "상품 구매 사용", "관리자 조정", "리뷰 작성 적립", "이벤트 적립"][i],
    createdAt: new Date(2026, 2, 20 - i).toISOString(),
  }));
  return { success: true, data: histories };
}

export async function adjustMemberPoints(memberId: number, data: PointAdjustRequest): Promise<void> {
  await delay();
  const member = MOCK_MEMBERS.find((m) => m.id === memberId);
  if (member) member.pointBalance += data.amount;
}

export async function getMemberMemos(memberId: number): Promise<ApiResponse<CsMemo[]>> {
  await delay();
  return { success: true, data: MOCK_MEMOS[memberId] ?? [] };
}

export async function createMemberMemo(memberId: number, content: string): Promise<ApiResponse<CsMemo>> {
  await delay();
  const memo: CsMemo = { id: Date.now(), content, adminName: "현재 관리자", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  if (!MOCK_MEMOS[memberId]) MOCK_MEMOS[memberId] = [];
  MOCK_MEMOS[memberId].push(memo);
  return { success: true, data: memo };
}

export async function deleteMemberMemo(memberId: number, memoId: number): Promise<void> {
  await delay();
  if (MOCK_MEMOS[memberId]) {
    MOCK_MEMOS[memberId] = MOCK_MEMOS[memberId].filter((m) => m.id !== memoId);
  }
}

export async function getGrades(): Promise<ApiResponse<Grade[]>> {
  await delay();
  return { success: true, data: MOCK_GRADES };
}

export async function updateGrades(grades: Grade[]): Promise<void> {
  await delay();
  grades.forEach((g, i) => { MOCK_GRADES[i] = g; });
}

export async function updateGradePolicy(gradeId: number, data: { name: string; minAmount: number; iconUrl?: string; couponIds: number[] }): Promise<void> {
  await delay();
  const grade = MOCK_GRADES.find((g) => g.id === gradeId);
  if (grade) {
    grade.name = data.name;
    grade.minAmount = data.minAmount;
    if (data.iconUrl) grade.iconUrl = data.iconUrl;
    grade.couponIds = data.couponIds;
  }
}

export async function bulkChangeGrade(userIds: number[], gradeId: number): Promise<void> {
  await delay();
  // Mock: no-op
}

export async function updateMemberMemo(memberId: number, memoId: number, content: string): Promise<ApiResponse<CsMemo>> {
  await delay();
  if (MOCK_MEMOS[memberId]) {
    const memo = MOCK_MEMOS[memberId].find((m) => m.id === memoId);
    if (memo) {
      memo.content = content;
      memo.updatedAt = new Date().toISOString();
      return { success: true, data: memo };
    }
  }
  throw new Error("메모를 찾을 수 없습니다.");
}
