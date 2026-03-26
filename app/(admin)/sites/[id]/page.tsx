"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSiteSettings, updateSiteSettings } from "@/services/siteService";
import type { SiteSettings, SiteSettingsUpdate, SeoConfig, TenantSettings } from "@/types/site";
import type { ApiError } from "@/types/api";
import { site as L, common } from "@/data/labels";

type Tab = "basic" | "business" | "bank" | "cs" | "seo";

const TABS: { key: Tab; label: string }[] = [
  { key: "basic", label: L.tabBasic },
  { key: "business", label: L.tabBusiness },
  { key: "bank", label: "계좌 정보" },
  { key: "cs", label: L.tabCs },
  { key: "seo", label: L.tabSeo },
];

export default function SiteSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = Number(params.id);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
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

  // 계좌 정보 (tenant settings API)
  const [tenantSettingsData, setTenantSettingsData] = useState<TenantSettings>({});
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankHolder, setBankHolder] = useState("");
  const [paymentDeadlineDays, setPaymentDeadlineDays] = useState("");

  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [faviconFile, setFaviconFile] = useState<File | undefined>();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const populateForm = useCallback((s: SiteSettings) => {
    setName(s.name || "");
    setNameEn(s.nameEn || "");
    setSiteUrl(s.siteUrl || "");
    setLogoUrl(s.logoUrl || "");
    setFaviconUrl(s.faviconUrl || "");
    setCopyrightText(s.copyrightText || "");
    setBusinessNumber(s.businessNumber || "");
    setBusinessName(s.businessName || "");
    setBusinessType(s.businessType || "");
    setBusinessCategory(s.businessCategory || "");
    setEcommerceLicense(s.ecommerceLicense || "");
    setCeoName(s.ceoName || "");
    setEmail(s.email || "");
    setPhone(s.phone || "");
    setAddress(s.address || "");
    setAddressDetail(s.addressDetail || "");
    setZipCode(s.zipCode || "");
    setPrivacyOfficer(s.privacyOfficer || "");
    setPrivacyEmail(s.privacyEmail || "");
    setCsPhone(s.csPhone || "");
    setCsFax(s.csFax || "");
    setCsEmail(s.csEmail || "");
    setCsHours(s.csHours || "");

    if (s.seoConfig) {
      try {
        const seo: SeoConfig = JSON.parse(s.seoConfig);
        setMetaTitle(seo.metaTitle || "");
        setMetaDescription(seo.metaDescription || "");
        setMetaKeywords(seo.metaKeywords || "");
      } catch { /* invalid JSON */ }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getSiteSettings(tenantId)
      .then((res) => {
        setSettings(res.data);
        populateForm(res.data);
        const ts = res.data.settings ?? {};
        setTenantSettingsData(ts);
        const stl = ts.settlement ?? {};
        setBankName(stl.bank_name ?? "");
        setBankAccount(stl.bank_account ?? "");
        setBankHolder(stl.bank_holder ?? "");
        setPaymentDeadlineDays(stl.payment_deadline_days ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tenantId, populateForm]);

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

      // settings에 계좌 정보 병합
      data.settings = {
        ...tenantSettingsData,
        settlement: {
          bank_name: bankName.trim(),
          bank_account: bankAccount.trim(),
          bank_holder: bankHolder.trim(),
          payment_deadline_days: paymentDeadlineDays.trim(),
        },
      };

      await updateSiteSettings(tenantId, data, logoFile, faviconFile);
      const res = await getSiteSettings(tenantId);
      setSettings(res.data);
      populateForm(res.data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || common.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex justify-center py-16">
        <p className="text-sm text-muted-foreground">사이트를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/sites")} aria-label="뒤로가기">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">{L.settingsTitle(settings.name)}</h1>
      </div>

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

      {/* 계좌 정보 */}
      {tab === "bank" && (
        <Card>
          <CardHeader><CardTitle>계좌 정보</CardTitle></CardHeader>
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

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      )}

      {/* 저장 버튼 */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? common.saving : common.save}
        </Button>
        <Button variant="outline" onClick={() => router.push("/sites")}>
          {common.cancel}
        </Button>
      </div>
    </div>
  );
}
