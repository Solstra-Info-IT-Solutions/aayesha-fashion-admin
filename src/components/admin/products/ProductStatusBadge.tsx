import type { ProductStatus } from "@/types/admin-product";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const styles: Record<
  ProductStatus,
  string
> = {
  draft:
    "bg-[#efe8df] text-[#70635d]",
  active:
    "bg-[#edf1e9] text-[#65745f]",
  archived:
    "bg-[#e6ddd4] text-[#70635d]",
  discontinued:
    "bg-[#f5eae6] text-[#955c56]",
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