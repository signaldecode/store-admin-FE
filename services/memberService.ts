import { api } from "@/lib/api";
import type {
  Member,
  MemberSummary,
  MemberListParams,
  PointHistory,
} from "@/types/member";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

export function getMembers(params?: MemberListParams & { tenantId?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<MemberSummary>>(`/admin/users${query}`);
}

export function getMember(id: number) {
  return api<ApiResponse<Member>>(`/admin/users/${id}`);
}

export function updateMemberStatus(id: number, data: { status: string }) {
  return api<void>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: data,
  });
}

export function getMemberPoints(memberId: number, params?: { page?: number; size?: number }) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return api<PaginatedResponse<PointHistory>>(
    `/admin/users/${memberId}/points${query}`
  );
}

// TODO: 백엔드 UserController에 POST /points 엔드포인트 없음 (GET만 존재)
// export function adjustMemberPoints(memberId: number, data: PointAdjustRequest) {
//   return api<void>(`/admin/users/${memberId}/points`, { method: "POST", body: data });
// }

// TODO: 백엔드에 회원 메모 CRUD 엔드포인트 없음
// export function getMemberMemos(memberId: number) { ... }
// export function createMemberMemo(memberId: number, content: string) { ... }
// export function updateMemberMemo(memberId: number, memoId: number, content: string) { ... }
// export function deleteMemberMemo(memberId: number, memoId: number) { ... }

// TODO: 백엔드에 등급 관리 엔드포인트 없음
// export function getGrades() { ... }
// export function updateGrades(grades: Grade[]) { ... }
// export function updateGradePolicy(gradeId: number, data: {...}) { ... }
// export function bulkChangeGrade(userIds: number[], gradeId: number) { ... }
