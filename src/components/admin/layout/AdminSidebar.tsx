"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Headphones,
  LayoutDashboard,
  Megaphone,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  Warehouse,
} from "lucide-react";

import { SidebarNavItem } from "./SidebarNavItem";

const primaryItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: Warehouse,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
];

const managementItems = [
  {
    href: "/admin/catalog",
    label: "Catalog",
    icon: Boxes,
  },
  {
    href: "/admin/marketing",
    label: "Marketing",
    icon: Megaphone,
  },
  {
    href: "/admin/coupons",
    label: "Discounts",
    icon: Percent,
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: FileText,
  },
  {
    href: "/admin/support",
    label: "Support",
    icon: Headphones,
  },
];

const systemItems = [
  {
    href: "/admin/reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-[#302f2d] bg-[#171717] lg:block">
      <div className="flex h-full flex-col">
        <Link
          href="/admin"
          className="border-b border-[#302f2d] px-6 py-6"
        >
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#efa7ae]">
            Aayesha Fashion
          </p>

          <p className="mt-1 font-serif text-2xl text-white">
            Admin
          </p>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <SidebarSection
            title="Workspace"
            items={primaryItems}
            pathname={pathname}
          />

          <SidebarSection
            title="Management"
            items={managementItems}
            pathname={pathname}
          />

          <SidebarSection
            title="System"
            items={systemItems}
            pathname={pathname}
          />
        </nav>

        <div className="border-t border-[#302f2d] px-6 py-5">
          <p className="text-[10px] leading-5 text-[#969696]">
            Store operations
            <br />
            Aayesha Fashion
          </p>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: typeof primaryItems;
  pathname: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.18em] text-[#77736e]">
        {title}
      </p>

      <div className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            {...item}
            pathname={pathname}
          />
        ))}
      </div>
    </div>
  );
}