import type { PaginationParams } from "./api";

/** 백엔드 TenantSimpleResponse (드롭다운용) */
export interface ActiveSite {
  id: number;
  code: string;
  name: string;
}

/** 백엔드 TenantCreateRequest */
export interface SiteFormData {
  code: string;
  name: string;
  nameEn?: string;
}

export interface SiteListParams extends PaginationParams {
  keyword?: string;
  isActive?: boolean;
}

/** 백엔드 TenantResponse 기준 (목록 + 단건 조회) */
export interface Site {
  id: number;
  code: string;
  name: string;
  nameEn: string | null;
  siteUrl: string | null;
  businessNumber: string | null;
  ceoName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  addressDetail: string | null;
  zipCode: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  businessName: string | null;
  businessType: string | null;
  businessCategory: string | null;
  ecommerceLicense: string | null;
  csPhone: string | null;
  csFax: string | null;
  csEmail: string | null;
  csHours: string | null;
  privacyOfficer: string | null;
  privacyEmail: string | null;
  copyrightText: string | null;
  themeConfig: string | null;
  seoConfig: string | null;
  planType: string | null;
  planExpiredAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  settings: TenantSettings | null;
}

/** 백엔드 TenantSettingsResponse (GET /admin/settings/{tenantId}) — Site와 동일 구조 */
export type SiteSettings = Site;

/** 백엔드 TenantUpdateRequest (PUT /admin/settings/{tenantId} 의 data 파트) */
export interface SiteSettingsUpdate {
  name?: string;
  nameEn?: string;
  siteUrl?: string;
  businessNumber?: string;
  ceoName?: string;
  email?: string;
  phone?: string;
  address?: string;
  addressDetail?: string;
  zipCode?: string;
  businessName?: string;
  businessType?: string;
  businessCategory?: string;
  ecommerceLicense?: string;
  csPhone?: string;
  csFax?: string;
  csEmail?: string;
  csHours?: string;
  privacyOfficer?: string;
  privacyEmail?: string;
  copyrightText?: string;
  themeConfig?: string;
  seoConfig?: string;
  planType?: string;
  settings?: TenantSettings;
}

/** 테넌트 커스텀 설정 (카테고리별 key-value) */
export type TenantSettings = Record<string, Record<string, string>>;

/** SEO 설정 (seoConfig JSON 파싱용) */
export interface SeoConfig {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  robotsTxt?: string;
}
