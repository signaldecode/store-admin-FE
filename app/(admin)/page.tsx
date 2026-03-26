"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Globe,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboard } from "@/services/dashboardService";
import SiteSelect from "@/components/common/SiteSelect";
import type { DashboardData } from "@/types/dashboard";
import { dashboard as L, common, ORDER_STATUS_LABEL } from "@/data/labels";
import type { OrderStatus } from "@/lib/constants";

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-amber-400",
  PAID: "bg-blue-500",
  PREPARING: "bg-indigo-500",
  SHIPPING: "bg-purple-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-gray-400",
};

export default function DashboardPage() {
  const [siteId, setSiteId] = useState<number | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 대시보드 데이터 로드 (사이트 변경 시 재호출)
  useEffect(() => {
    setLoading(true);
    getDashboard(siteId)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteId]);

  const os = data?.ordersByStatus ?? {};
  const totalOrders = data
    ? (os.PENDING ?? 0) + (os.PAID ?? 0) + (os.PREPARING ?? 0) + (os.SHIPPING ?? 0) + (os.DELIVERED ?? 0)
    : 0;

  const completionRate = totalOrders > 0
    ? Math.round(((os.DELIVERED ?? 0) / totalOrders) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{L.pageTitle}</h1>
        <SiteSelect value={siteId} onChange={setSiteId} />
      </div>

      {/* Row 1: 주문 현황 + 매출 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 주문 현황 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              {L.orderStatusTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-20 w-full" /></div>
            ) : (
              <div className="space-y-4">
                {/* 도넛 차트 — 처리율 */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeDasharray={`${completionRate} ${100 - completionRate}`}
                        strokeLinecap="round"
                        className="text-emerald-500"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {completionRate}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{L.orderCompletion}</p>
                </div>

                {/* 상태별 카운트 2×2 */}
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { label: L.orderPending, count: os.PENDING ?? 0, icon: Clock, color: "text-amber-500" },
                    { label: L.orderPaid, count: os.PAID ?? 0, icon: CreditCard, color: "text-blue-500" },
                    { label: L.orderPreparing, count: os.PREPARING ?? 0, icon: Package, color: "text-indigo-500" },
                    { label: L.orderShipping, count: os.SHIPPING ?? 0, icon: Truck, color: "text-purple-500" },
                  ] as const).map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-md border p-3">
                      <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-bold">{item.count}<span className="ml-0.5 text-xs font-normal text-muted-foreground">건</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 매출 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              {L.salesTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
            ) : (
              <div className="flex h-full flex-col justify-center gap-5">
                <div className="rounded-lg bg-primary/5 p-5 text-center">
                  <p className="text-sm text-muted-foreground">{L.todaySales}</p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    {(data!.todayRevenue ?? 0).toLocaleString("ko-KR")}
                    <span className="ml-1 text-base font-normal">{common.currency}</span>
                  </p>
                </div>
                <div className="rounded-lg border p-5 text-center">
                  <p className="text-sm text-muted-foreground">{L.monthlySales}</p>
                  <p className="mt-1 text-3xl font-bold">
                    {(data!.monthlyRevenue ?? 0).toLocaleString("ko-KR")}
                    <span className="ml-1 text-base font-normal">{common.currency}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: 최근 주문 + 클레임 현황 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* 최근 주문 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{L.recentOrdersTitle}</CardTitle>
              <Link href="/orders" className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                {L.viewAll} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : data!.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{L.recentOrdersEmpty}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th scope="col" className="pb-2 text-left text-xs font-medium text-muted-foreground">주문번호</th>
                      <th scope="col" className="pb-2 text-left text-xs font-medium text-muted-foreground">상태</th>
                      <th scope="col" className="pb-2 text-right text-xs font-medium text-muted-foreground">금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.recentOrders.map((o) => (
                      <tr key={o.id} className="border-b last:border-0">
                        <td className="py-2.5">
                          <Link href={`/orders/${o.id}`} className="hover:underline">{o.orderNumber}</Link>
                        </td>
                        <td className="py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[o.status] ?? "bg-gray-400"}`} />
                            <span className="text-xs">{ORDER_STATUS_LABEL[o.status as OrderStatus] ?? o.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-medium">
                          {(o.grandTotal ?? 0).toLocaleString("ko-KR")}{common.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 클레임 현황 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                {L.claimsTitle}
              </CardTitle>
              <Link href="/claims" className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                {L.viewAll} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center gap-8 py-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data!.claimsByStatus?.REQUESTED ?? 0}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{L.claimsRequested}</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data!.claimsByStatus?.IN_PROGRESS ?? 0}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{L.claimsInProgress}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
