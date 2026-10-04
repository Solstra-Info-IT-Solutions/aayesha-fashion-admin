import type { ProductStatus } from "@/types/admin-product";

const styles: Record<ProductStatus, { box: string; dot: string; label: string }> = {
  draft: { box: "bg-[#211e1b] text-[#cfc7bb] border-[#2e2a26]", dot: "bg-[#8c847d]", label: "Draft" },
  active: { box: "bg-[#1a2419] text-[#8fb08a] border-[#2c4a33]", dot: "bg-[#8fb08a]", label: "Active" },
  archived: { box: "bg-[#2e2a26] text-[#cfc7bb] border-[#3a352f]", dot: "bg-[#9a9185]", label: "Archived" },
  discontinued: { box: "bg-[#2b1a18] text-[#f0a39d] border-[#5a2a27]", dot: "bg-[#e08b84]", label: "Discontinued" },
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
