import type { PaymentStatus } from "@/types/order";

const TONES: Record<string, string> = {
  paid: "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]",
  pending: "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]",
  failed: "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]",
  refunded: "bg-[#efebf8] text-[#4f43a0] border-[#d8d1f0]",
  partially_refunded: "bg-[#efebf8] text-[#4f43a0] border-[#d8d1f0]",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
        TONES[status] ?? "bg-[#efe8d8] text-[#5f584d] border-[#e6dfcf]"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
