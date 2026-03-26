"use client";

import { create } from "zustand";

/** 테넌트(사이트) — 백엔드 TenantSimpleResponse 기준 */
export interface SiteItem {
  id: number;
  name: string;
  code?: string;
}

interface SiteState {
  /** 활성 테넌트 목록 (로드 후 캐시) */
  sites: SiteItem[];
  /** 현재 선택된 테넌트 ID (null = 전체) */
  selectedSiteId: number | null;

  setSites: (sites: SiteItem[]) => void;
  selectSite: (siteId: number | null) => void;

  /** 현재 선택된 테넌트 객체 */
  selectedSite: () => SiteItem | null;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  sites: [],
  selectedSiteId: null,

  setSites: (sites) => set({ sites }),
  selectSite: (siteId) => set({ selectedSiteId: siteId }),

  selectedSite: () => {
    const { sites, selectedSiteId } = get();
    return sites.find((s) => s.id === selectedSiteId) ?? null;
  },
}));
