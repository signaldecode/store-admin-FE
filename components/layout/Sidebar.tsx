"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItems } from "@/data/menuData";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { layout } from "@/data/labels";

export default function Sidebar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <aside
      className={cn(
        "hidden h-screen border-r border-border bg-sidebar transition-all duration-200 md:flex md:flex-col",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        {isOpen ? (
          <span className="text-lg font-semibold text-sidebar-foreground">
            {layout.appName}
          </span>
        ) : (
          <span className="mx-auto text-lg font-semibold text-sidebar-foreground">
            {layout.appNameShort}
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2" aria-label={layout.mainMenu}>
        {menuItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={!isOpen ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
