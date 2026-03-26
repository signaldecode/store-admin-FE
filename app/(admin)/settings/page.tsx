"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/common/EmptyState";
import { getActiveSites, getSiteSettings, updateSiteSettings } from "@/services/siteService";
import type { ActiveSite, TenantSettings } from "@/types/site";
import type { SiteSettings, SiteSettingsUpdate, SeoConfig } from "@/types/site";
import type { ApiError } from "@/types/api";
import { site as L, settings as s, common } from "@/data/labels";

type Tab = "basic" | "business" | "settlement" | "cs" | "social" | "notification" | "security" | "seo";

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: L.tabBasic },
  { key: "business", label: L.tabBusiness },
  { key: "settlement", label: "정산/계좌" },
  { key: "cs", label: L.tabCs },
  { key: "social", label: "소셜 미디어" },
  { key: "notification", label: "알림 설정" },
  { key: "security", label: "보안" },
  { key: "seo", label: L.tabSeo },
];

export default function SettingsPage() {
  // 테넌트(사이트) 목록
  const [tenants, setTenants] = useState<ActiveSite[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  // 사이트 설정
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("basic");
  const [error, setError] = useState("");

  // 기본 정보
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [copyrightText, setCopyrightText] = useState("");

  // 사업자 정보
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [ecommerceLicense, setEcommerceLicense] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [privacyOfficer, setPrivacyOfficer] = useState("");
  const [privacyEmail, setPrivacyEmail] = useState("");

  // CS 정보
  const [csPhone, setCsPhone] = useState("");
  const [csFax, setCsFax] = useState("");
  const [csEmail, setCsEmail] = useState("");
  const [csHours, setCsHours] = useState("");

  // SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // ─── tenant settings (카테고리별 key-value) ───
  const [tenantSettingsData, setTenantSettingsData] = useState<TenantSettings>({});

  // settlement
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankHolder, setBankHolder] = useState("");
  const [paymentDeadlineDays, setPaymentDeadlineDays] = useState("");

  // maintenance
  const [mtEnabled, setMtEnabled] = useState(false);
  const [mtMessage, setMtMessage] = useState("");
  const [mtStartAt, setMtStartAt] = useState("");
  const [mtEndAt, setMtEndAt] = useState("");

  // social
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialBlog, setSocialBlog] = useState("");
  const [socialKakao, setSocialKakao] = useState("");

  // notification
  const [notiOrderEmail, setNotiOrderEmail] = useState("");
  // const [notiClaimEmail, setNotiClaimEmail] = useState("");
  const [notiInquiryEmail, setNotiInquiryEmail] = useState("");
  const [notiOrderEnabled, setNotiOrderEnabled] = useState(false);
  // const [notiClaimEnabled, setNotiClaimEnabled] = useState(false);
  const [notiInquiryEnabled, setNotiInquiryEnabled] = useState(false);

  // security
  const [secSessionTimeout, setSecSessionTimeout] = useState("");
  const [secMaxLoginAttempts, setSecMaxLoginAttempts] = useState("");
  const [secAccountLockDuration, setSecAccountLockDuration] = useState("");
  const [secPasswordChangeRequired, setSecPasswordChangeRequired] = useState(false);
  const [secPasswordChangeCycle, setSecPasswordChangeCycle] = useState("");

  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [faviconFile, setFaviconFile] = useState<File | undefined>();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // 테넌트 목록 로드
  useEffect(() => {
    getActiveSites()
      .then((res) => {
        setTenants(res.data);
        if (res.data.length === 1) {
          setSelectedTenantId(res.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setTenantsLoading(false));
  }, []);

  const siteItems = useMemo(
    () => Object.fromEntries(tenants.map((t) => [String(t.id), t.name])),
    [tenants]
  );

  const populateForm = useCallback((data: SiteSettings) => {
    setName(data.name || "");
    setNameEn(data.nameEn || "");
    setSiteUrl(data.siteUrl || "");
    setLogoUrl(data.logoUrl || "");
    setFaviconUrl(data.faviconUrl || "");
    setCopyrightText(data.copyrightText || "");
    setBusinessNumber(data.businessNumber || "");
    setBusinessName(data.businessName || "");
    setBusinessType(data.businessType || "");
    setBusinessCategory(data.businessCategory || "");
    setEcommerceLicense(data.ecommerceLicense || "");
    setCeoName(data.ceoName || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
    setAddress(data.address || "");
    setAddressDetail(data.addressDetail || "");
    setZipCode(data.zipCode || "");
    setPrivacyOfficer(data.privacyOfficer || "");
    setPrivacyEmail(data.privacyEmail || "");
    setCsPhone(data.csPhone || "");
    setCsFax(data.csFax || "");
    setCsEmail(data.csEmail || "");
    setCsHours(data.csHours || "");
    if (data.seoConfig) {
      try {
        const seo: SeoConfig = JSON.parse(data.seoConfig);
        setMetaTitle(seo.metaTitle || "");
        setMetaDescription(seo.metaDescription || "");
        setMetaKeywords(seo.metaKeywords || "");
      } catch { /* invalid JSON */ }
    } else {
      setMetaTitle(""); setMetaDescription(""); setMetaKeywords("");
    }
  }, []);

  // tenantId 변경 시 설정 로드
  useEffect(() => {
    if (!selectedTenantId) {
      setSettings(null);
      return;
    }
    setSettingsLoading(true);
    setError("");
    getSiteSettings(selectedTenantId)
      .then((res) => {
        setSettings(res.data);
        populateForm(res.data);
        const ts = res.data.settings ?? {};
        setTenantSettingsData(ts);
        // settlement
        const stl = ts.settlement ?? {};
        setBankName(stl.bank_name ?? "");
        setBankAccount(stl.bank_account ?? "");
        setBankHolder(stl.bank_holder ?? "");
        setPaymentDeadlineDays(stl.payment_deadline_days ?? "");
        // maintenance
        const mt = ts.maintenance ?? {};
        setMtEnabled(mt.enabled === "true");
        setMtMessage(mt.message ?? "");
        setMtStartAt(mt.start_at?.slice(0, 16) ?? "");
        setMtEndAt(mt.end_at?.slice(0, 16) ?? "");
        // social
        const sc = ts.social ?? {};
        setSocialInstagram(sc.instagram ?? "");
        setSocialFacebook(sc.facebook ?? "");
        setSocialYoutube(sc.youtube ?? "");
        setSocialBlog(sc.blog ?? "");
        setSocialKakao(sc.kakao ?? "");
        // notification
        const nt = ts.notification ?? {};
        setNotiOrderEmail(nt.order_email ?? "");
        // setNotiClaimEmail(nt.claim_email ?? "");
        setNotiInquiryEmail(nt.inquiry_email ?? "");
        setNotiOrderEnabled(nt.order_enabled === "true");
        // setNotiClaimEnabled(nt.claim_enabled === "true");
        setNotiInquiryEnabled(nt.inquiry_enabled === "true");
        // security
        const sec = ts.security ?? {};
        setSecSessionTimeout(sec.session_timeout ?? "");
        setSecMaxLoginAttempts(sec.max_login_attempts ?? "");
        setSecAccountLockDuration(sec.account_lock_duration ?? "");
        setSecPasswordChangeRequired(sec.password_change_required === "true");
        setSecPasswordChangeCycle(sec.password_change_cycle ?? "");
      })
      .catch(() => setSettings(null))
      .finally(() => setSettingsLoading(false));
  }, [selectedTenantId, populateForm]);

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    urlSetter: (url: string) => void,
    fileSetter: (file: File | undefined) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileSetter(file);
    urlSetter(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedTenantId) return;
    setSaving(true);
    setError("");
    try {
      const seoConfig: SeoConfig = {};
      if (metaTitle) seoConfig.metaTitle = metaTitle;
      if (metaDescription) seoConfig.metaDescription = metaDescription;
      if (metaKeywords) seoConfig.metaKeywords = metaKeywords;

      const data: SiteSettingsUpdate = {
        name: name.trim() || undefined,
        nameEn: nameEn.trim() || undefined,
        siteUrl: siteUrl.trim() || undefined,
        copyrightText: copyrightText.trim() || undefined,
        businessNumber: businessNumber.trim() || undefined,
        businessName: businessName.trim() || undefined,
        businessType: businessType.trim() || undefined,
        businessCategory: businessCategory.trim() || undefined,
        ecommerceLicense: ecommerceLicense.trim() || undefined,
        ceoName: ceoName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        addressDetail: addressDetail.trim() || undefined,
        zipCode: zipCode.trim() || undefined,
        privacyOfficer: privacyOfficer.trim() || undefined,
        privacyEmail: privacyEmail.trim() || undefined,
        csPhone: csPhone.trim() || undefined,
        csFax: csFax.trim() || undefined,
        csEmail: csEmail.trim() || undefined,
        csHours: csHours.trim() || undefined,
        seoConfig: Object.keys(seoConfig).length > 0 ? JSON.stringify(seoConfig) : undefined,
      };

      data.settings = {
        ...tenantSettingsData,
        settlement: {
          bank_name: bankName.trim(),
          bank_account: bankAccount.trim(),
          bank_holder: bankHolder.trim(),
          payment_deadline_days: paymentDeadlineDays.trim(),
        },
        maintenance: {
          enabled: String(mtEnabled),
          message: mtMessage.trim(),
          start_at: mtStartAt,
          end_at: mtEndAt,
        },
        social: {
          instagram: socialInstagram.trim(),
          facebook: socialFacebook.trim(),
          youtube: socialYoutube.trim(),
          blog: socialBlog.trim(),
          kakao: socialKakao.trim(),
        },
        notification: {
          order_email: notiOrderEmail.trim(),
          // claim_email: notiClaimEmail.trim(),
          inquiry_email: notiInquiryEmail.trim(),
          order_enabled: String(notiOrderEnabled),
          // claim_enabled: String(notiClaimEnabled),
          inquiry_enabled: String(notiInquiryEnabled),
        },
        security: {
          session_timeout: secSessionTimeout.trim(),
          max_login_attempts: secMaxLoginAttempts.trim(),
          account_lock_duration: secAccountLockDuration.trim(),
          password_change_required: String(secPasswordChangeRequired),
          password_change_cycle: secPasswordChangeCycle.trim(),
        },
      };

      await updateSiteSettings(selectedTenantId, data, logoFile, faviconFile);
      const res = await getSiteSettings(selectedTenantId);
      setSettings(res.data);
      populateForm(res.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || common.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (tenantsLoading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 + 사이트 선택 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{s.pageTitle}</h1>
        <Select
          value={selectedTenantId !== null ? String(selectedTenantId) : null}
          onValueChange={(v) => {
            setSelectedTenantId(v ? Number(v) : null);
            setTab("basic");
          }}
        >
          <SelectTrigger className="w-52" aria-label="사이트 선택" items={siteItems}>
            <SelectValue placeholder="사이트를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 사이트 미선택 */}
      {!selectedTenantId && (
        <EmptyState message="사이트를 선택하세요" />
      )}

      {/* 로딩 */}
      {selectedTenantId && settingsLoading && (
        <div className="flex justify-center py-16">
          <p className="text-sm text-muted-foreground">{common.loading}</p>
        </div>
      )}

      {/* 설정 폼 */}
      {selectedTenantId && settings && !settingsLoading && (
        <>
          {/* 탭 */}
          <div className="flex gap-1 border-b" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 기본 정보 */}
          {tab === "basic" && (
            <Card>
              <CardHeader><CardTitle>{L.tabBasic}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-name">{L.nameLabel} <span className="text-destructive">*</span></Label>
                    <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={L.namePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-nameEn">{L.nameEnLabel}</Label>
                    <Input id="s-nameEn" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder={L.nameEnPlaceholder} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s-siteUrl">{L.siteUrlLabel}</Label>
                  <Input id="s-siteUrl" type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder={L.siteUrlPlaceholder} />
                </div>

                <Separator />

                {/* 로고 */}
                <div className="space-y-2">
                  <Label>{L.logoLabel}</Label>
                  <p className="text-xs text-muted-foreground">{L.logoHint}</p>
                  <div className="flex items-center gap-4">
                    {logoUrl && (
                      <div className="rounded-md border p-2">
                        <img src={logoUrl} alt="logo" className="h-12 object-contain" />
                      </div>
                    )}
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, setLogoUrl, setLogoFile)} />
                    <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()}>
                      <Upload className="mr-1.5 h-3.5 w-3.5" />{L.logoUpload}
                    </Button>
                  </div>
                </div>

                {/* 파비콘 */}
                <div className="space-y-2">
                  <Label>{L.faviconLabel}</Label>
                  <p className="text-xs text-muted-foreground">{L.faviconHint}</p>
                  <div className="flex items-center gap-4">
                    {faviconUrl && (
                      <div className="rounded-md border p-2">
                        <img src={faviconUrl} alt="favicon" className="h-8 w-8 object-contain" />
                      </div>
                    )}
                    <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, setFaviconUrl, setFaviconFile)} />
                    <Button type="button" variant="outline" size="sm" onClick={() => faviconInputRef.current?.click()}>
                      <Upload className="mr-1.5 h-3.5 w-3.5" />{L.faviconUpload}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="s-copyright">{L.copyrightLabel}</Label>
                  <Input id="s-copyright" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} placeholder={L.copyrightPlaceholder} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 사업자 정보 */}
          {tab === "business" && (
            <Card>
              <CardHeader><CardTitle>{L.tabBusiness}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-bizNum">{L.businessNumberLabel}</Label>
                    <Input id="s-bizNum" value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} placeholder={L.businessNumberPlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-bizName">{L.businessNameLabel}</Label>
                    <Input id="s-bizName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={L.businessNamePlaceholder} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-bizType">{L.businessTypeLabel}</Label>
                    <Input id="s-bizType" value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder={L.businessTypePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-bizCat">{L.businessCategoryLabel}</Label>
                    <Input id="s-bizCat" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} placeholder={L.businessCategoryPlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-ecomm">{L.ecommerceLicenseLabel}</Label>
                  <Input id="s-ecomm" value={ecommerceLicense} onChange={(e) => setEcommerceLicense(e.target.value)} placeholder={L.ecommerceLicensePlaceholder} />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-ceo">{L.ceoNameLabel}</Label>
                    <Input id="s-ceo" value={ceoName} onChange={(e) => setCeoName(e.target.value)} placeholder={L.ceoNamePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-phone">{L.phoneLabel}</Label>
                    <Input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={L.phonePlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-email">{L.emailLabel}</Label>
                  <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={L.emailPlaceholder} />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="s-zip">{L.zipCodeLabel}</Label>
                    <Input id="s-zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder={L.zipCodePlaceholder} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="s-addr">{L.addressLabel}</Label>
                    <Input id="s-addr" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={L.addressPlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-addrDetail">{L.addressDetailLabel}</Label>
                  <Input id="s-addrDetail" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} placeholder={L.addressDetailPlaceholder} />
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-privOfficer">{L.privacyOfficerLabel}</Label>
                    <Input id="s-privOfficer" value={privacyOfficer} onChange={(e) => setPrivacyOfficer(e.target.value)} placeholder={L.privacyOfficerPlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-privEmail">{L.privacyEmailLabel}</Label>
                    <Input id="s-privEmail" type="email" value={privacyEmail} onChange={(e) => setPrivacyEmail(e.target.value)} placeholder={L.privacyEmailPlaceholder} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 정산/계좌 */}
          {tab === "settlement" && (
            <Card>
              <CardHeader><CardTitle>정산/계좌 정보</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  무통장 입금 시 안내할 계좌 정보를 입력하세요.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="s-bankName">은행명</Label>
                  <Input
                    id="s-bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="국민은행"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-bankAccount">계좌번호</Label>
                  <Input
                    id="s-bankAccount"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="123-456-789012"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-bankHolder">예금주</Label>
                  <Input
                    id="s-bankHolder"
                    value={bankHolder}
                    onChange={(e) => setBankHolder(e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="s-paymentDeadline">입금 기한 (일)</Label>
                  <Input
                    id="s-paymentDeadline"
                    type="number"
                    value={paymentDeadlineDays}
                    onChange={(e) => setPaymentDeadlineDays(e.target.value)}
                    placeholder="3"
                  />
                  <p className="text-xs text-muted-foreground">무통장 입금 주문 시 입금 기한 (일 단위)</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 고객센터 */}
          {tab === "cs" && (
            <Card>
              <CardHeader><CardTitle>{L.tabCs}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-csPhone">{L.csPhoneLabel}</Label>
                    <Input id="s-csPhone" value={csPhone} onChange={(e) => setCsPhone(e.target.value)} placeholder={L.csPhonePlaceholder} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-csFax">{L.csFaxLabel}</Label>
                    <Input id="s-csFax" value={csFax} onChange={(e) => setCsFax(e.target.value)} placeholder={L.csFaxPlaceholder} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-csEmail">{L.csEmailLabel}</Label>
                  <Input id="s-csEmail" type="email" value={csEmail} onChange={(e) => setCsEmail(e.target.value)} placeholder={L.csEmailPlaceholder} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-csHours">{L.csHoursLabel}</Label>
                  <Input id="s-csHours" value={csHours} onChange={(e) => setCsHours(e.target.value)} placeholder={L.csHoursPlaceholder} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 소셜 미디어 */}
          {tab === "social" && (
            <Card>
              <CardHeader><CardTitle>소셜 미디어</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-instagram">Instagram</Label>
                  <Input id="s-instagram" value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} placeholder="https://instagram.com/shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-facebook">Facebook</Label>
                  <Input id="s-facebook" value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} placeholder="https://facebook.com/shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-youtube">YouTube</Label>
                  <Input id="s-youtube" value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-blog">Blog</Label>
                  <Input id="s-blog" value={socialBlog} onChange={(e) => setSocialBlog(e.target.value)} placeholder="https://blog.naver.com/shop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-kakao">Kakao</Label>
                  <Input id="s-kakao" value={socialKakao} onChange={(e) => setSocialKakao(e.target.value)} placeholder="https://pf.kakao.com/shop" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 알림 설정 */}
          {tab === "notification" && (
            <Card>
              <CardHeader><CardTitle>알림 설정</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-notiOrderEmail">주문 알림 이메일</Label>
                    <Input id="s-notiOrderEmail" type="email" value={notiOrderEmail} onChange={(e) => setNotiOrderEmail(e.target.value)} placeholder="order@shop.com" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch id="s-notiOrderEnabled" checked={notiOrderEnabled} onCheckedChange={setNotiOrderEnabled} />
                    <Label htmlFor="s-notiOrderEnabled">주문 알림 활성</Label>
                  </div>
                </div>
                {/* <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-notiClaimEmail">클레임 알림 이메일</Label>
                    <Input id="s-notiClaimEmail" type="email" value={notiClaimEmail} onChange={(e) => setNotiClaimEmail(e.target.value)} placeholder="claim@shop.com" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch id="s-notiClaimEnabled" checked={notiClaimEnabled} onCheckedChange={setNotiClaimEnabled} />
                    <Label htmlFor="s-notiClaimEnabled">클레임 알림 활성</Label>
                  </div>
                </div> */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-notiInquiryEmail">문의 알림 이메일</Label>
                    <Input id="s-notiInquiryEmail" type="email" value={notiInquiryEmail} onChange={(e) => setNotiInquiryEmail(e.target.value)} placeholder="inquiry@shop.com" />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch id="s-notiInquiryEnabled" checked={notiInquiryEnabled} onCheckedChange={setNotiInquiryEnabled} />
                    <Label htmlFor="s-notiInquiryEnabled">문의 알림 활성</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 보안 */}
          {tab === "security" && (
            <Card>
              <CardHeader><CardTitle>보안 설정</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="s-secSession">세션 타임아웃 (분)</Label>
                    <Input id="s-secSession" type="number" value={secSessionTimeout} onChange={(e) => setSecSessionTimeout(e.target.value)} placeholder="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="s-secMaxLogin">최대 로그인 시도 횟수</Label>
                    <Input id="s-secMaxLogin" type="number" value={secMaxLoginAttempts} onChange={(e) => setSecMaxLoginAttempts(e.target.value)} placeholder="5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-secLockDuration">계정 잠금 시간 (분)</Label>
                  <Input id="s-secLockDuration" type="number" value={secAccountLockDuration} onChange={(e) => setSecAccountLockDuration(e.target.value)} placeholder="30" />
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Switch id="s-secPwRequired" checked={secPasswordChangeRequired} onCheckedChange={setSecPasswordChangeRequired} />
                  <Label htmlFor="s-secPwRequired">비밀번호 변경 강제</Label>
                </div>
                {secPasswordChangeRequired && (
                  <div className="space-y-2">
                    <Label htmlFor="s-secPwCycle">비밀번호 변경 주기 (일)</Label>
                    <Input id="s-secPwCycle" type="number" value={secPasswordChangeCycle} onChange={(e) => setSecPasswordChangeCycle(e.target.value)} placeholder="90" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* SEO */}
          {tab === "seo" && (
            <Card>
              <CardHeader><CardTitle>{L.tabSeo}</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="s-metaTitle">{L.metaTitleLabel}</Label>
                  <Input id="s-metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={L.metaTitlePlaceholder} />
                  <p className="text-xs text-muted-foreground">{L.metaTitleHint(metaTitle.length)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-metaDesc">{L.metaDescriptionLabel}</Label>
                  <Textarea id="s-metaDesc" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder={L.metaDescriptionPlaceholder} rows={3} className="resize-none" />
                  <p className="text-xs text-muted-foreground">{L.metaDescriptionHint(metaDescription.length)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-metaKeywords">{L.metaKeywordsLabel}</Label>
                  <Input id="s-metaKeywords" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} placeholder={L.metaKeywordsPlaceholder} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 에러 */}
          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}

          {/* 저장 */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? common.saving : common.save}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
