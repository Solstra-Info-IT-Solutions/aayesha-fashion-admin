import type {
  OrderStatus,
} from "@/types/order";

export function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const label =
    status.replace(
      /_/g,
      " ",
    );

  return (
    <span className="inline-flex rounded-full border border-[#e1dbd5] bg-[#f8f5f2] px-2.5 py-1 text-[11px] font-medium capitalize text-[#4f504f]">
      {label}
    </span>
  );
}