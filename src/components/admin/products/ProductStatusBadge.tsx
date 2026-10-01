import type { ProductStatus } from "@/types/admin-product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const styles: Record<
  ProductStatus,
  string
> = {
  draft:
    "bg-[#efe8d8] text-[#5f584d]",
  active:
    "bg-[#e8f5ec] text-[#2f7d4f]",
  archived:
    "bg-[#e6dfcf] text-[#5f584d]",
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