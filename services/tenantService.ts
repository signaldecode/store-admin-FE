import type { ApiResponse } from "@/types/api";

// ─── Types ───

export interface TenantSeo {
  title: string;
  description: string;
  keywords: string;
}

export interface TenantMaintenance {
  enabled: boolean;
  message: string;
}

export interface TenantSocial {
  instagram: string;
  youtube: string;
  blog: string;
}

export interface TenantNotification {
  orderEmail: boolean;
  claimEmail: boolean;
}

export interface TenantSecurity {
  maxLoginAttempts: number;
}

export interface Tenant {
  shopName: string;
  domain: string;
  seo: TenantSeo;
  maintenance: TenantMaintenance;
  social: TenantSocial;
  notification: TenantNotification;
  security: TenantSecurity;
}

export interface HeaderMenuItem {
  id: number;
  label: string;
  url: string;
  sortOrder: number;
}

// ─── Mock data ───

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockTenant: Tenant = {
  shopName: "MIREP 통합어드민",
  domain: "https://mirep.co.kr",
  seo: {
    title: "MIREP 통합어드민",
    description: "공식 온라인 스토어",
    keywords: "패션,의류",
  },
  maintenance: { enabled: false, message: "" },
  social: { instagram: "", youtube: "", blog: "" },
  notification: { orderEmail: true, claimEmail: true },
  security: { maxLoginAttempts: 5 },
};

const mockHeaderMenus: HeaderMenuItem[] = [
  { id: 1, label: "신상품", url: "/products?sort=new", sortOrder: 1 },
  { id: 2, label: "베스트", url: "/products?sort=best", sortOrder: 2 },
  { id: 3, label: "세일", url: "/products?tag=sale", sortOrder: 3 },
];

// ─── Service functions ───

export async function getTenant(): Promise<ApiResponse<Tenant>> {
  await delay(300);
  return { success: true, data: structuredClone(mockTenant) };
}

export async function updateTenant(
  data: Tenant,
  _logo?: File,
  _favicon?: File,
): Promise<void> {
  await delay(300);
  Object.assign(mockTenant, data);
}

export async function getHeaderMenu(): Promise<ApiResponse<HeaderMenuItem[]>> {
  await delay(300);
  return { success: true, data: structuredClone(mockHeaderMenus) };
}

export async function updateHeaderMenu(menus: HeaderMenuItem[]): Promise<void> {
  await delay(300);
  mockHeaderMenus.length = 0;
  mockHeaderMenus.push(...menus);
}
