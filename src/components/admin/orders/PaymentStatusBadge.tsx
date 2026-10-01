import type {
  PaymentStatus,
} from "@/types/order";

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span className="inline-flex rounded-full border border-[#e5e7ec] bg-[#ffffff] px-2.5 py-1 text-[11px] font-medium capitalize text-[#5b6270]">
      {status.replace(
        /_/g,
        " ",
      )}
    </span>
  );
}