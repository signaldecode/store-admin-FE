"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { common } from "@/data/labels";

// ─── 페이지 셸 ───
interface DetailShellProps {
  title: string;
  backHref: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DetailShell({ title, backHref, actions, children }: DetailShellProps) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(backHref)}
            aria-label={common.goToDashboard}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── 로딩 / 에러 ───
export function DetailLoading() {
  return (
    <div className="flex justify-center py-20">
      <p className="text-sm text-muted-foreground">{common.loading}</p>
    </div>
  );
}

export function DetailNotFound({ message, backHref }: { message: string; backHref: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={() => router.push(backHref)}>
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        {common.goToDashboard}
      </Button>
    </div>
  );
}

// ─── 섹션 카드 ───
interface SectionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Section({ title, children, actions }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {actions}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── 정보 그리드 ───
interface InfoGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function InfoGrid({ children, columns = 2 }: InfoGridProps) {
  return (
    <dl
      className={`grid gap-x-6 gap-y-3 ${
        columns === 3
          ? "sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2"
      }`}
    >
      {children}
    </dl>
  );
}

// ─── 정보 항목 ───
interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
  badge?: { text: string; variant?: "default" | "secondary" | "destructive" | "outline" };
  full?: boolean;
}

export function InfoItem({ label, value, badge, full }: InfoItemProps) {
  return (
    <div className={full ? "sm:col-span-full" : undefined}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">
        {badge ? (
          <Badge variant={badge.variant ?? "secondary"}>{badge.text}</Badge>
        ) : (
          value ?? "-"
        )}
      </dd>
    </div>
  );
}

// ─── 간단한 테이블 ───
interface SimpleTableColumn<T> {
  label: string;
  align?: "left" | "right";
  render: (item: T) => React.ReactNode;
}

interface SimpleTableProps<T> {
  columns: SimpleTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
}

export function SimpleTable<T>({ columns, data, keyExtractor }: SimpleTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`pb-2 text-xs font-medium text-muted-foreground ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="border-b last:border-0">
              {columns.map((col, i) => (
                <td
                  key={i}
                  className={`py-2 ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
