import type { PaginationParams } from "./api";

/** 백엔드 PopupResponse 기준 */
export interface Popup {
  id: number;
  tenantId: number;
  name: string;
  status: string;
  image: string | null;
  linkUrl: string | null;
  linkTarget: string;
  closeOption: string;
  popupType: string;
  sortOrder: number;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 백엔드 PopupCreateRequest 기준 */
export interface PopupFormData {
  tenantId: number;
  name: string;
  status: string;
  linkTarget: string;
  closeOption: string;
  popupType: string;
  sortOrder: number;
  image?: string;
  linkUrl?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface PopupListParams extends PaginationParams {
  tenantId?: number;
  status?: string;
}
