"use client";

import { Menu, LogOut, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { logout } from "@/services/authService";
import { useRouter } from "next/navigation";
import { layout } from "@/data/labels";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { isOpen, toggle } = useSidebarStore();
  const admin = useAuthStore((s) => s.admin);
  const clearAdmin = useAuthStore((s) => s.clearAdmin);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAdmin();
      router.push("/login");
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        {/* 모바일: 햄버거 메뉴 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuToggle}
          aria-label={layout.menuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 데스크톱: 사이드바 토글 */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={toggle}
          aria-label={isOpen ? layout.sidebarCollapse : layout.sidebarExpand}
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {admin && (
          <span className="text-sm text-muted-foreground">{admin.name}</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label={layout.logout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
