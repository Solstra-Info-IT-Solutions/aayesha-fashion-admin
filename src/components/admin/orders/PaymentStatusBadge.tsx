import type {
  PaymentStatus,
} from "@/types/order";

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span className="inline-flex rounded-full border border-[#e6dfcf] bg-[#fffdf8] px-2.5 py-1 text-[11px] font-medium capitalize text-[#5f584d]">
      {status.replace(
        /_/g,
        " ",
      )}
    </span>
  );
}