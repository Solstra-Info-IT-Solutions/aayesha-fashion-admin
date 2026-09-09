import type {
  VariantStatus,
} from "@/types/product-variant";

interface VariantStatusBadgeProps {
  status: VariantStatus;
}

const labels: Record<
  VariantStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
  discontinued: "Discontinued",
};

const classes: Record<
  VariantStatus,
  string
> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive:
    "border-[#e7e2dd] bg-[#f5f1ec] text-[#6f706f]",
  discontinued:
    "border-red-200 bg-red-50 text-red-700",
};

export default function VariantStatusBadge({
  status,
}: VariantStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}