import type { OrderStatus } from "@/types/order";

const TONES: Record<string, { box: string; dot: string }> = {
  confirmed: { box: "bg-[#2a241b] text-[#d9c7a3] border-[#3a352f]", dot: "bg-[#b79a6a]" },
  processing: { box: "bg-[#2b2216] text-[#e0b56a] border-[#5a4420]", dot: "bg-[#e0b56a]" },
  packed: { box: "bg-[#2b2216] text-[#e0b56a] border-[#5a4420]", dot: "bg-[#e0b56a]" },
  shipped: { box: "bg-[#16222b] text-[#8fbfdc] border-[#2c4658]", dot: "bg-[#8fbfdc]" },
  in_transit: { box: "bg-[#16222b] text-[#8fbfdc] border-[#2c4658]", dot: "bg-[#8fbfdc]" },
  out_for_delivery: { box: "bg-[#16222b] text-[#8fbfdc] border-[#2c4658]", dot: "bg-[#8fbfdc]" },
  delivered: { box: "bg-[#1a2419] text-[#8fb08a] border-[#2c4a33]", dot: "bg-[#8fb08a]" },
  cancelled: { box: "bg-[#2b1a18] text-[#f0a39d] border-[#5a2a27]", dot: "bg-[#e08b84]" },
  returned: { box: "bg-[#221f33] text-[#c4baf5] border-[#3d3660]", dot: "bg-[#b4a8f0]" },
  exchanged: { box: "bg-[#221f33] text-[#c4baf5] border-[#3d3660]", dot: "bg-[#b4a8f0]" },
};

const FALLBACK = { box: "bg-[#211e1b] text-[#cfc7bb] border-[#2e2a26]", dot: "bg-[#8c847d]" };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone = TONES[status] ?? FALLBACK;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${tone.box}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}
