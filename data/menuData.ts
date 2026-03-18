import {
  Package,
  FolderTree,
  Tag,
  ShieldCheck,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminRole } from "@/lib/constants";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: AdminRole;
}

export const menuItems: MenuItem[] = [
  { label: "대시보드", href: "/", icon: LayoutDashboard },
  { label: "상품 관리", href: "/products", icon: Package },
  { label: "카테고리", href: "/categories", icon: FolderTree },
  { label: "브랜드", href: "/brands", icon: Tag },
  { label: "사이트", href: "/sites", icon: Globe },
  { label: "관리자", href: "/admins", icon: ShieldCheck, requiredRole: "SUPER_ADMIN" },
];
