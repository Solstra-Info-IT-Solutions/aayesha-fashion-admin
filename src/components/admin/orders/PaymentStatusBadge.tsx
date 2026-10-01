import type {
  PaymentStatus,
} from "@/types/order";

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span className="inline-flex rounded-full border border-[#e6ddd4] bg-[#fbf9f5] px-2.5 py-1 text-[11px] font-medium capitalize text-[#70635d]">
      {status.replace(
        /_/g,
        " ",
      )}
    </span>
  );
}