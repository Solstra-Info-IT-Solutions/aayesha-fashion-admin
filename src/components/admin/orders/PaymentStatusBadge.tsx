import type {
  PaymentStatus,
} from "@/types/order";

export function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  return (
    <span className="inline-flex rounded-full border border-[#e1dbd5] bg-white px-2.5 py-1 text-[11px] font-medium capitalize text-[#6f706f]">
      {status.replace(
        /_/g,
        " ",
      )}
    </span>
  );
}