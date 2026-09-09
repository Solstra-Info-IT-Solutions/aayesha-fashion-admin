import type { ProductStatus } from "@/types/admin-product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const styles: Record<
  ProductStatus,
  string
> = {
  draft:
    "bg-[#f5f1ec] text-[#6f706f]",
  active:
    "bg-[#edf7ef] text-[#2f7a43]",
  archived:
    "bg-[#f1f1f1] text-[#777777]",
  discontinued:
    "bg-[#fff0f0] text-[#a33a3a]",
};

const labels: Record<
  ProductStatus,
  string
> = {
  draft: "Draft",
  active: "Active",
  archived: "Archived",
  discontinued: "Discontinued",
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}