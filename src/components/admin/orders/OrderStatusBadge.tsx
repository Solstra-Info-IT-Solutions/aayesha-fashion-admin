import type { OrderStatus } from "@/types/order";

const TONES: Record<string, { box: string; dot: string }> = {
  confirmed: { box: "bg-[#f1ead9] text-[#6f542f] border-[#e4d8bd]", dot: "bg-[#b08d57]" },
  processing: { box: "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]", dot: "bg-[#d29a0a]" },
  packed: { box: "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]", dot: "bg-[#d29a0a]" },
  shipped: { box: "bg-[#e6f0f7] text-[#1f5f86] border-[#c4dbea]", dot: "bg-[#1f77a8]" },
  in_transit: { box: "bg-[#e6f0f7] text-[#1f5f86] border-[#c4dbea]", dot: "bg-[#1f77a8]" },
  out_for_delivery: { box: "bg-[#e6f0f7] text-[#1f5f86] border-[#c4dbea]", dot: "bg-[#1f77a8]" },
  delivered: { box: "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]", dot: "bg-[#2a9a68]" },
  cancelled: { box: "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]", dot: "bg-[#c2372e]" },
  returned: { box: "bg-[#efebf8] text-[#4f43a0] border-[#d8d1f0]", dot: "bg-[#6a58c4]" },
  exchanged: { box: "bg-[#efebf8] text-[#4f43a0] border-[#d8d1f0]", dot: "bg-[#6a58c4]" },
};

const FALLBACK = { box: "bg-[#efe8d8] text-[#5f584d] border-[#e6dfcf]", dot: "bg-[#a89f90]" };

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
