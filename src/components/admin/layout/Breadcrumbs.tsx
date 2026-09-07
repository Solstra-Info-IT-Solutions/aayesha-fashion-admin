"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

const labels: Record<string, string> =
  {
    admin: "Dashboard",
    orders: "Orders",
    products: "Products",
    inventory: "Inventory",
    customers: "Customers",
    catalog: "Catalog",
    marketing: "Marketing",
    coupons: "Discounts",
    reviews: "Reviews",
    support: "Support",
    reports: "Reports",
    settings: "Settings",
  };

export function Breadcrumbs() {
  const pathname =
    usePathname();

  const segments =
    pathname
      .split("/")
      .filter(Boolean);

  const current =
    segments.at(-1) || "admin";

  const title =
    labels[current] ||
    "Admin";

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
        Aayesha Fashion
      </p>

      <div className="mt-1 flex items-center gap-2">
        <Link
          href="/admin"
          className="text-sm text-[#6f706f] hover:text-[#171717]"
        >
          Admin
        </Link>

        <span className="text-[#c6c0ba]">
          /
        </span>

        <span className="text-sm font-medium text-[#171717]">
          {title}
        </span>
      </div>
    </div>
  );
}