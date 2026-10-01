import {
  BellRing,
  Boxes,
  ClipboardList,
  FileText,
  Headphones,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Percent,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

/** Single source of truth for the desktop sidebar and the mobile drawer. */
export const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", icon: ClipboardList },
      { href: "/admin/products", label: "Products", icon: ShoppingBag },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/admin/catalog", label: "Catalog", icon: Boxes },
      { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
      { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
      { href: "/admin/discounts", label: "Discounts", icon: Percent },
      { href: "/admin/reviews", label: "Reviews", icon: FileText },
      { href: "/admin/abandoned-carts", label: "Abandoned Carts", icon: ShoppingCart },
      { href: "/admin/stock-alerts", label: "Stock Alerts", icon: BellRing },
      { href: "/admin/support", label: "Support", icon: Headphones },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/payment-config", label: "Payments & WhatsApp", icon: Wallet },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const isActivePath = (href: string, pathname: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

/** Page titles for breadcrumbs, longest match first. */
export function titleForPath(pathname: string): string {
  const all = navSections.flatMap((section) => section.items);

  const hit = [...all]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isActivePath(item.href, pathname));

  return hit?.label ?? "Admin";
}
