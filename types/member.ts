import type { PaginationParams } from "./api";
import type { MemberStatus } from "@/lib/constants";

/** 백엔드 UserResponse 기준 */
export interface MemberSummary {
  id: number;
  tenantId: number;
  email: string;
  name: string;
  phone: string | null;
  gender: string | null;
  userType: string | null;
  status: string;
  provider: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

/** 백엔드 UserDetailResponse 기준 */
export interface Member {
  user: MemberSummary;
  addresses: MemberAddress[];
  point: MemberPoint | null;
}

export interface MemberAddress {
  id: number;
  label: string | null;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string | null;
  isDefault: boolean;
}

export interface MemberPoint {
  currentPoints: number;
}

/** 백엔드에 등급 API 없음 — 프론트 전용 */
export interface Grade {
  id: number;
  name: string;
  minAmount: number;
  iconUrl: string | null;
  couponIds: number[];
}

export interface PointHistory {
  id: number;
  type: "EARN" | "USE" | "ADJUST";
  amount: number;
  reason: string;
  createdAt: string;
}

export interface MemberListParams extends PaginationParams {
  status?: MemberStatus;
  keyword?: string;
}

export interface PointAdjustRequest {
  amount: number;
  reason: string;
}
