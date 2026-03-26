"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuGroups } from "@/data/menuData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/stores/useAuthStore";
import { layout } from "@/data/labels";
import { useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
  const pathname = usePathname();
  const adminRole = useAuthStore((s) => s.admin?.role);

  const getInitialOpen = useCallback(() => {
    const map: Record<number, boolean> = {};
    menuGroups.forEach((group, gi) => {
      if (!group.label) { map[gi] = true; return; }
      const hasActive = group.items.some((item) =>
        item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/")
      );
      map[gi] = hasActive;
    });
    return map;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(getInitialOpen);

  const toggleGroup = (gi: number) => {
    setOpenGroups((prev) => ({ ...prev, [gi]: !prev[gi] }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle className="text-lg font-semibold">{layout.appName}</SheetTitle>
        </SheetHeader>

        <nav className="overflow-y-auto p-2" aria-label={layout.mobileMenu}>
          {menuGroups.map((group, gi) => {
            const visibleItems = group.items.filter(
              (item) => !item.requiredRole || item.requiredRole === adminRole
            );
            if (visibleItems.length === 0) return null;

            if (!group.label) {
              return (
                <div key={gi} className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <DrawerLink key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} onNavigate={() => onOpenChange(false)} />
                  ))}
                </div>
              );
            }

            const isGroupOpen = openGroups[gi] ?? false;

            return (
              <Collapsible key={gi} open={isGroupOpen} onOpenChange={() => toggleGroup(gi)} className="mt-1">
                <CollapsibleTrigger
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
                    "text-muted-foreground transition-colors hover:text-foreground",
                    "cursor-pointer select-none"
                  )}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isGroupOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 pt-0.5">
                  {visibleItems.map((item) => (
                    <DrawerLink key={item.href} href={item.href} label={item.label} icon={item.icon} pathname={pathname} onNavigate={() => onOpenChange(false)} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DrawerLink({ href, label, icon: Icon, pathname, onNavigate }: {
  href: string; label: string; icon: LucideIcon; pathname: string; onNavigate: () => void;
}) {
  const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
