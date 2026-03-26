"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { settings as s, common } from "@/data/labels";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  getTenant,
  updateTenant,
  getHeaderMenu,
  updateHeaderMenu,
  type Tenant,
  type HeaderMenuItem,
} from "@/services/tenantService";
import { getPolicy, updatePolicy, type Policy } from "@/services/policyService";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [headerMenus, setHeaderMenus] = useState<HeaderMenuItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [tenantRes, policyRes, menuRes] = await Promise.all([
          getTenant(),
          getPolicy(),
          getHeaderMenu(),
        ]);
        setTenant(tenantRes.data);
        setPolicy(policyRes.data);
        setHeaderMenus(menuRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveTenant = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      await updateTenant(tenant);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePolicy = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      await updatePolicy(policy);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeaderMenu = async () => {
    setSaving(true);
    try {
      await updateHeaderMenu(headerMenus);
    } finally {
      setSaving(false);
    }
  };

  const addMenuItem = () => {
    const nextId =
      headerMenus.length > 0
        ? Math.max(...headerMenus.map((m) => m.id)) + 1
        : 1;
    const nextOrder =
      headerMenus.length > 0
        ? Math.max(...headerMenus.map((m) => m.sortOrder)) + 1
        : 1;
    setHeaderMenus([
      ...headerMenus,
      { id: nextId, label: "", url: "", sortOrder: nextOrder },
    ]);
  };

  const removeMenuItem = (id: number) => {
    setHeaderMenus(headerMenus.filter((m) => m.id !== id));
  };

  const updateMenuItem = (
    id: number,
    field: keyof HeaderMenuItem,
    value: string | number,
  ) => {
    setHeaderMenus(
      headerMenus.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" aria-busy="true">
        <p className="text-muted-foreground">{common.loading}</p>
      </div>
    );
  }

  if (!tenant || !policy) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{s.pageTitle}</h1>

      {/* 테넌트 기본 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>{s.sectionTenant}</CardTitle>
          <CardDescription>사이트 기본 정보 및 SEO 설정을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">{s.tenantName}</Label>
              <Input
                id="tenant-name"
                value={tenant.shopName}
                onChange={(e) =>
                  setTenant({ ...tenant, shopName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-domain">{s.tenantDomain}</Label>
              <Input
                id="tenant-domain"
                value={tenant.domain}
                onChange={(e) =>
                  setTenant({ ...tenant, domain: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-title">{s.tenantSeoTitle}</Label>
            <Input
              id="seo-title"
              value={tenant.seo.title}
              onChange={(e) =>
                setTenant({
                  ...tenant,
                  seo: { ...tenant.seo, title: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-desc">{s.tenantSeoDescription}</Label>
            <Textarea
              id="seo-desc"
              value={tenant.seo.description}
              onChange={(e) =>
                setTenant({
                  ...tenant,
                  seo: { ...tenant.seo, description: e.target.value },
                })
              }
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-keywords">{s.tenantSeoKeywords}</Label>
            <Input
              id="seo-keywords"
              value={tenant.seo.keywords}
              onChange={(e) =>
                setTenant({
                  ...tenant,
                  seo: { ...tenant.seo, keywords: e.target.value },
                })
              }
              placeholder="쉼표로 구분"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="maintenance"
              checked={tenant.maintenance.enabled}
              onCheckedChange={(checked) =>
                setTenant({
                  ...tenant,
                  maintenance: { ...tenant.maintenance, enabled: checked },
                })
              }
            />
            <Label htmlFor="maintenance">{s.tenantMaintenance}</Label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveTenant} disabled={saving}>
              {saving ? common.saving : common.save}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 약관/정책 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>{s.sectionPolicy}</CardTitle>
          <CardDescription>주문, 배송, 상품, 반품/교환 정책을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy-order">{s.policyOrder}</Label>
            <Textarea
              id="policy-order"
              value={policy.order}
              onChange={(e) =>
                setPolicy({ ...policy, order: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-delivery">{s.policyDelivery}</Label>
            <Textarea
              id="policy-delivery"
              value={policy.delivery}
              onChange={(e) =>
                setPolicy({ ...policy, delivery: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-product">{s.policyProduct}</Label>
            <Textarea
              id="policy-product"
              value={policy.product}
              onChange={(e) =>
                setPolicy({ ...policy, product: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-returns">{s.policyReturns}</Label>
            <Textarea
              id="policy-returns"
              value={policy.returns}
              onChange={(e) =>
                setPolicy({ ...policy, returns: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePolicy} disabled={saving}>
              {saving ? common.saving : common.save}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 헤더 메뉴 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>{s.sectionHeaderMenu}</CardTitle>
          <CardDescription>프론트 사이트 헤더에 표시되는 메뉴를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {headerMenus.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {s.headerMenuEmpty}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="pb-2 text-left font-medium">
                      {s.headerMenuLabel}
                    </th>
                    <th scope="col" className="pb-2 text-left font-medium">
                      {s.headerMenuUrl}
                    </th>
                    <th scope="col" className="pb-2 text-left font-medium w-24">
                      {s.headerMenuSortOrder}
                    </th>
                    <th scope="col" className="pb-2 w-12">
                      <span className="sr-only">{common.delete}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {headerMenus.map((menu) => (
                    <tr key={menu.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-2">
                        <Input
                          value={menu.label}
                          onChange={(e) =>
                            updateMenuItem(menu.id, "label", e.target.value)
                          }
                          aria-label={`${s.headerMenuLabel} ${menu.sortOrder}`}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Input
                          value={menu.url}
                          onChange={(e) =>
                            updateMenuItem(menu.id, "url", e.target.value)
                          }
                          aria-label={`${s.headerMenuUrl} ${menu.sortOrder}`}
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Input
                          type="number"
                          min={1}
                          value={menu.sortOrder}
                          onChange={(e) =>
                            updateMenuItem(
                              menu.id,
                              "sortOrder",
                              Number(e.target.value),
                            )
                          }
                          aria-label={`${s.headerMenuSortOrder} ${menu.sortOrder}`}
                        />
                      </td>
                      <td className="py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMenuItem(menu.id)}
                          aria-label={`${s.headerMenuRemove} ${menu.label}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={addMenuItem}>
              <Plus className="mr-1 h-4 w-4" />
              {s.headerMenuAdd}
            </Button>
            <Button onClick={handleSaveHeaderMenu} disabled={saving}>
              {saving ? common.saving : common.save}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
