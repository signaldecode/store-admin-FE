import type { PaginationParams } from "./api";
import type { ClaimType, ClaimStatus } from "@/lib/constants";

export interface ClaimItem {
  id: number;
  productName: string;
  optionSummary: string;
  quantity: number;
  unitPrice: number;
}

export interface Claim {
  id: number;
  orderNumber: string;
  claimType: ClaimType;
  reasonType: string;
  reason: string;
  status: ClaimStatus;
  items: ClaimItem[];
  estimatedRefundAmount: number;
  refundMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimSummary {
  id: number;
  orderNumber: string;
  claimType: ClaimType;
  reasonType: string;
  status: ClaimStatus;
  estimatedRefundAmount: number;
  createdAt: string;
}

export interface ClaimListParams extends PaginationParams {
  claimType?: ClaimType;
  status?: ClaimStatus;
  keyword?: string;
}
