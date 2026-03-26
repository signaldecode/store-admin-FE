import {
  Package,
  FolderTree,
  Tag,
  ShieldCheck,
  LayoutDashboard,
  Globe,
  ShoppingCart,
  RotateCcw,
  Users,
  Crown,
  // Image,
  Megaphone,
  Ticket,
  MessageSquare,
  Star,
  Bell,
  Settings,
  CircleHelp,
  PanelTop,
  Tags,
  HelpCircle,
  // Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminRole } from "@/lib/constants";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredRole?: AdminRole;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    label: "",
    items: [
      { label: "대시보드", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "상품",
    items: [
      { label: "상품 관리", href: "/products", icon: Package },
      { label: "카테고리", href: "/categories", icon: FolderTree },
      { label: "브랜드", href: "/brands", icon: Tag },
      { label: "태그", href: "/tags", icon: Tags },
    ],
  },
  {
    label: "주문",
    items: [
      { label: "주문 관리", href: "/orders", icon: ShoppingCart },
      { label: "클레임", href: "/claims", icon: RotateCcw },
    ],
  },
  {
    label: "회원",
    items: [
      { label: "회원 관리", href: "/members", icon: Users },
      { label: "등급 관리", href: "/members/grades", icon: Crown },
    ],
  },
  {
    label: "콘텐츠",
    items: [
      // { label: "배너", href: "/banners", icon: Image },
      { label: "팝업", href: "/popups", icon: PanelTop },
      { label: "공지사항", href: "/notices", icon: Bell },
      { label: "FAQ", href: "/faqs", icon: CircleHelp },
      // { label: "전시 관리", href: "/displays", icon: Monitor },
    ],
  },
  {
    label: "마케팅",
    items: [
      { label: "프로모션", href: "/promotions", icon: Megaphone },
      { label: "쿠폰", href: "/coupons", icon: Ticket },
    ],
  },
  {
    label: "고객센터",
    items: [
      { label: "1:1 문의", href: "/inquiries", icon: MessageSquare },
      { label: "상품 Q&A", href: "/qnas", icon: HelpCircle },
      { label: "리뷰", href: "/reviews", icon: Star },
    ],
  },
  {
    label: "설정",
    items: [
      { label: "사이트", href: "/sites", icon: Globe },
      { label: "관리자", href: "/admins", icon: ShieldCheck, requiredRole: "SUPER_ADMIN" },
      { label: "설정", href: "/settings", icon: Settings },
    ],
  },
];

/** 하위 호환용 flat 리스트 */
export const menuItems: MenuItem[] = menuGroups.flatMap((g) => g.items);
