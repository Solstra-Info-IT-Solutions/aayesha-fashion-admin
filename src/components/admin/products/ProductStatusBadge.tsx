import type { ProductStatus } from "@/types/admin-product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const styles: Record<
  ProductStatus,
  string
> = {
  draft:
    "bg-[#eef0f4] text-[#5b6270]",
  active:
    "bg-[#e8f5ec] text-[#2f7d4f]",
  archived:
    "bg-[#e5e7ec] text-[#5b6270]",
  discontinued:
    "bg-[#fdecec] text-[#b3261e]",
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