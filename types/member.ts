import type { PaginationParams } from "./api";
import type { MemberStatus } from "@/lib/constants";

export interface Member {
  id: number;
  email: string;
  name: string;
  phone: string;
  status: MemberStatus;
  grade: string;
  totalOrderAmount: number;
  pointBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface MemberSummary {
  id: number;
  email: string;
  name: string;
  phone: string;
  status: MemberStatus;
  grade: string;
  createdAt: string;
}

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

export interface CsMemo {
  id: number;
  content: string;
  adminName: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberListParams extends PaginationParams {
  status?: MemberStatus;
  grade?: string;
  keyword?: string;
}

export interface PointAdjustRequest {
  amount: number;
  reason: string;
}
