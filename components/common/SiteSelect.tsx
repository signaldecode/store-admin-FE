"use client";

import { useEffect } from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSiteStore } from "@/stores/useSiteStore";
import { getActiveSites } from "@/services/siteService";

interface SiteSelectProps {
  value: number | null;
  onChange: (siteId: number | null) => void;
  /** "전체" 옵션 숨김 (반드시 하나 선택해야 할 때) */
  required?: boolean;
  className?: string;
}

export default function SiteSelect({ value, onChange, required, className }: SiteSelectProps) {
  const sites = useSiteStore((s) => s.sites);
  const setSites = useSiteStore((s) => s.setSites);

  useEffect(() => {
    if (sites.length === 0) {
      getActiveSites()
        .then((res) => {
          setSites(res.data.map((t) => ({ id: t.id, name: t.name, code: t.code })));
        })
        .catch(() => {});
    }
  }, [sites.length, setSites]);

  const selectedName = value !== null
    ? sites.find((s) => s.id === value)?.name ?? ""
    : "전체 사이트";

  return (
    <Select
      value={value !== null ? String(value) : "all"}
      onValueChange={(v) => { if (v !== null) onChange(v === "all" ? null : Number(v)); }}
    >
      <SelectTrigger className={className ?? "h-9 w-44"} aria-label="사이트 선택">
        <Globe className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{selectedName}</span>
      </SelectTrigger>
      <SelectContent>
        {!required && <SelectItem value="all">전체 사이트</SelectItem>}
        {sites.map((site) => (
          <SelectItem key={site.id} value={String(site.id)}>{site.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
