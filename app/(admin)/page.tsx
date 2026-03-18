"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  FolderTree,
  Tag,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { getBrands } from "@/services/brandService";
import { PRODUCT_STATUS } from "@/lib/constants";
import { dashboard } from "@/data/labels";

interface DashboardStats {
  totalProducts: number;
  soldoutProducts: number;
  totalCategories: number;
  totalBrands: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          getProducts({ page: 1, size: 1 }),
          getCategories(),
          getBrands({ page: 1, size: 1 }),
        ]);

        const soldoutRes = await getProducts({
          page: 1,
          size: 1,
          status: PRODUCT_STATUS.SOLD_OUT,
        });

        setStats({
          totalProducts: productRes.data.total_elements,
          soldoutProducts: soldoutRes.data.total_elements,
          totalCategories: categoryRes.data.length,
          totalBrands: brandRes.data.total_elements,
        });
      } catch {
        // api.ts에서 공통 에러 처리
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      title: dashboard.totalProducts,
      value: stats?.totalProducts ?? 0,
      icon: Package,
      href: "/products",
    },
    {
      title: dashboard.soldoutProducts,
      value: stats?.soldoutProducts ?? 0,
      icon: AlertTriangle,
      href: "/products?status=SOLD_OUT",
      alert: (stats?.soldoutProducts ?? 0) > 0,
    },
    {
      title: dashboard.categories,
      value: stats?.totalCategories ?? 0,
      icon: FolderTree,
      href: "/categories",
    },
    {
      title: dashboard.brands,
      value: stats?.totalBrands ?? 0,
      icon: Tag,
      href: "/brands",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{dashboard.pageTitle}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon
                    className={`h-5 w-5 ${
                      card.alert
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p
                      className={`text-2xl font-bold ${
                        card.alert ? "text-destructive" : ""
                      }`}
                    >
                      {card.value.toLocaleString("ko-KR")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
