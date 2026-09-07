"use client";

import Link from "next/link";
import {
  Boxes,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Users,
  Warehouse,
  X,
} from "lucide-react";

const items = [
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
  {
    href: "/admin/catalog",
    label: "Catalog",
    icon: Boxes,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close navigation"
      />

      <aside className="relative flex h-full w-[280px] flex-col bg-[#171717] text-white">
        <div className="flex items-center justify-between border-b border-[#302f2d] px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#efa7ae]">
              Aayesha Fashion
            </p>

            <p className="mt-1 font-serif text-2xl">
              Admin
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#c8c4c0]"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map(
            ({
              href,
              label,
              icon: Icon,
            }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#d0ccc7] transition hover:bg-[#292c2c] hover:text-white"
              >
                <Icon
                  size={18}
                  strokeWidth={1.7}
                />

                {label}
              </Link>
            ),
          )}
        </nav>
      </aside>
    </div>
  );
}