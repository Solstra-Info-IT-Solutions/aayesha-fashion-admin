import type { InventoryStatus } from "@/types/inventory";

interface InventoryStatusBadgeProps {
  status: InventoryStatus;
}

const labels: Record<InventoryStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

const classes: Record<InventoryStatus, string> = {
  "in-stock":
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  "low-stock":
    "border-amber-200 bg-amber-50 text-amber-700",
  "out-of-stock":
    "border-red-200 bg-red-50 text-red-700",
};

export default function InventoryStatusBadge({
  status,
}: InventoryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}