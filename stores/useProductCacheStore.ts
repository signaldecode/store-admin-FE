"use client";

import { create } from "zustand";
import type { Product } from "@/types/product";

interface ProductCacheState {
  product: Product | null;
  set: (product: Product) => void;
  clear: () => void;
}

export const useProductCacheStore = create<ProductCacheState>((set) => ({
  product: null,
  set: (product) => set({ product }),
  clear: () => set({ product: null }),
}));
