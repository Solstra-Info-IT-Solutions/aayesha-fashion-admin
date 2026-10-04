import type { PaymentStatus } from "@/types/order";

const TONES: Record<string, string> = {
  paid: "bg-[#1a2419] text-[#8fb08a] border-[#2c4a33]",
  pending: "bg-[#2b2216] text-[#e0b56a] border-[#5a4420]",
  failed: "bg-[#2b1a18] text-[#f0a39d] border-[#5a2a27]",
  refunded: "bg-[#221f33] text-[#c4baf5] border-[#3d3660]",
  partially_refunded: "bg-[#221f33] text-[#c4baf5] border-[#3d3660]",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${
        TONES[status] ?? "bg-[#211e1b] text-[#cfc7bb] border-[#2e2a26]"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
