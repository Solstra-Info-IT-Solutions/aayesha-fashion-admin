import {
  Boxes,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  PackageSearch,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import InventorySummaryCard from "./InventorySummaryCard";

import type { InventorySummary as InventorySummaryType } from "@/types/inventory";

interface InventorySummaryProps {
  summary: InventorySummaryType | null;
  loading?: boolean;
}

export default function InventorySummary({
  summary,
  loading = false,
}: InventorySummaryProps) {
  const format = (value?: number) =>
    new Intl.NumberFormat("en-IN").format(value ?? 0);

  const cards = [
    {
      title: "Total SKUs",
      value: format(summary?.totalSkus),
      description: "All inventory variants",
      icon: Boxes,
    },
    {
      title: "Active SKUs",
      value: format(summary?.activeSkus),
      description: "Currently active variants",
      icon: PackageCheck,
    },
    {
      title: "Total Stock",
      value: format(summary?.totalStock),
      description: "Physical units in stock",
      icon: PackageOpen,
    },
    {
      title: "Reserved",
      value: format(summary?.totalReserved),
      description: "Units reserved for orders",
      icon: ShieldCheck,
    },
    {
      title: "Available",
      value: format(summary?.totalAvailable),
      description: "Available to sell",
      icon: PackageSearch,
    },
    {
      title: "Low Stock",
      value: format(summary?.lowStockSkus),
      description: "SKUs below threshold",
      icon: AlertTriangle,
    },
    {
      title: "Out of Stock",
      value: format(summary?.outOfStockSkus),
      description: "SKUs with no availability",
      icon: PackageMinus,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => (
        <InventorySummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          loading={loading}
        />
      ))}
    </div>
  );
}