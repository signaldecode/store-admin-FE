"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuGroups } from "@/data/menuData";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { layout } from "@/data/labels";
import { useState, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((s) => s.isOpen);
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
    <aside
      className={cn(
        "hidden h-screen border-r border-border bg-sidebar transition-all duration-200 md:flex md:flex-col",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {isOpen ? (
          <span className="text-lg font-semibold text-sidebar-foreground">{layout.appName}</span>
        ) : (
          <span className="mx-auto text-lg font-semibold text-sidebar-foreground">{layout.appNameShort}</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label={layout.mainMenu}>
        {menuGroups.map((group, gi) => {
          const visibleItems = group.items.filter(
            (item) => !item.requiredRole || item.requiredRole === adminRole
          );
          if (visibleItems.length === 0) return null;

          if (!group.label) {
            return (
              <div key={gi} className="space-y-0.5">
                {visibleItems.map((item) => (
                  <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} isOpen={isOpen} pathname={pathname} />
                ))}
              </div>
            );
          }

          if (!isOpen) {
            return (
              <div key={gi} className="mt-2">
                <div className="mx-3 mb-1 border-t border-border" />
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} isOpen={isOpen} pathname={pathname} />
                  ))}
                </div>
              </div>
            );
          }

          const isGroupOpen = openGroups[gi] ?? false;

          return (
            <Collapsible key={gi} open={isGroupOpen} onOpenChange={() => toggleGroup(gi)} className="mt-1">
              <CollapsibleTrigger
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider",
                  "text-muted-foreground transition-colors hover:text-sidebar-foreground",
                  "cursor-pointer select-none"
                )}
              >
                <span>{group.label}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isGroupOpen && "rotate-180")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5 pt-0.5">
                {visibleItems.map((item) => (
                  <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} isOpen={isOpen} pathname={pathname} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </aside>
  );
}

function SidebarLink({ href, label, icon: Icon, isOpen, pathname }: {
  href: string; label: string; icon: LucideIcon; isOpen: boolean; pathname: string;
}) {
  const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      aria-label={!isOpen ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {isOpen && <span>{label}</span>}
    </Link>
  );
}
