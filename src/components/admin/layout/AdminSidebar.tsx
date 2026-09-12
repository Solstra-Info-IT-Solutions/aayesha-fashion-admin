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
  LayoutTemplate,
  Megaphone,
  PackageCheck,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  Warehouse,
} from "lucide-react";

import { SidebarNavItem } from "./SidebarNavItem";

const sections = [
  {
    title: "Workspace",
    items: [
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
    ],
  },
  {
    title: "Management",
    items: [
      {
        href: "/admin/catalog",
        label: "Catalog",
        icon: Boxes,
      },
      {
        href: "/admin/homepage",
        label: "Homepage",
        icon: LayoutTemplate,
      },
      {
        href: "/admin/marketing",
        label: "Marketing",
        icon: Megaphone,
      },
      {
        href: "/admin/discounts",
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
    ],
  },
  {
    title: "System",
    items: [
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
    ],
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[#efa7ae]/40 text-[#efa7ae]">
              <PackageCheck
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#efa7ae]">
                Aayesha Fashion
              </p>

              <p className="font-serif text-xl leading-none text-white">
                Admin
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {sections.map((section) => (
            <div
              key={section.title}
              className="mb-6"
            >
              <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.18em] text-[#77736e]">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    {...item}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#302f2d] px-6 py-5">
          <p className="text-[10px] leading-5 text-[#77736e]">
            Store administration
          </p>

          <p className="mt-1 text-xs text-[#c8c4c0]">
            Aayesha Fashion
          </p>
        </div>
      </div>
    </aside>
  );
}