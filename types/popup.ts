import type { PaginationParams } from "./api";
import type { PopupType, PopupStatus } from "@/lib/constants";

export interface Popup {
  id: number;
  title: string;
  content: string;
  type: PopupType;
  status: PopupStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PopupFormData {
  title: string;
  content: string;
  type: PopupType;
  status: PopupStatus;
  startDate: string;
  endDate: string;
}

export interface PopupListParams extends PaginationParams {
  status?: PopupStatus;
}
