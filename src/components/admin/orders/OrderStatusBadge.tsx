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
    <span className="inline-flex rounded-full border border-[#e6ddd4] bg-[#f7f3ed] px-2.5 py-1 text-[11px] font-medium capitalize text-[#70635d]">
      {label}
    </span>
  );
}