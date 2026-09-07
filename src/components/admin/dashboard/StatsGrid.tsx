import {
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import type {
  DashboardSummary,
} from "@/types/dashboard";

import { StatCard } from "./StatCard";

export function StatsGrid({
  summary,
  loading,
}: {
  summary: DashboardSummary;
  loading: boolean;
}) {
  const currency =
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      },
    );

  const cards = [
    {
      label: "Revenue",
      value: loading
        ? "—"
        : currency.format(
            summary.revenue,
          ),
      helper: "Current reporting period",
      icon: IndianRupee,
    },
    {
      label: "Orders",
      value: loading
        ? "—"
        : summary.orders.toLocaleString(
            "en-IN",
          ),
      helper: "Total orders",
      icon: Package,
    },
    {
      label: "Customers",
      value: loading
        ? "—"
        : summary.customers.toLocaleString(
            "en-IN",
          ),
      helper: "Registered customers",
      icon: Users,
    },
    {
      label: "Products",
      value: loading
        ? "—"
        : summary.products.toLocaleString(
            "en-IN",
          ),
      helper: "Catalog products",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          {...card}
        />
      ))}
    </div>
  );
}