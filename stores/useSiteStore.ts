"use client";

import { create } from "zustand";
import type { ActiveSite } from "@/types/site";

interface SiteState {
  /** 전체 사이트 목록 (로드 후 캐시) */
  sites: ActiveSite[];
  /** 현재 선택된 사이트 ID (null = 전체) */
  selectedSiteId: number | null;

  setSites: (sites: ActiveSite[]) => void;
  selectSite: (siteId: number | null) => void;

  /** 현재 선택된 사이트 객체 */
  selectedSite: () => ActiveSite | null;
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
