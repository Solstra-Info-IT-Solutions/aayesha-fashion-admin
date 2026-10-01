import type { ProductStatus } from "@/types/admin-product";

const styles: Record<ProductStatus, { box: string; dot: string; label: string }> = {
  draft: { box: "bg-[#efe8d8] text-[#5f584d] border-[#e6dfcf]", dot: "bg-[#a89f90]", label: "Draft" },
  active: { box: "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]", dot: "bg-[#2a9a68]", label: "Active" },
  archived: { box: "bg-[#e6dfcf] text-[#5f584d] border-[#d6ccb6]", dot: "bg-[#8a8275]", label: "Archived" },
  discontinued: { box: "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]", dot: "bg-[#c2372e]", label: "Discontinued" },
};

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const tone = styles[status];

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.box}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {tone.label}
    </span>
  );
}
