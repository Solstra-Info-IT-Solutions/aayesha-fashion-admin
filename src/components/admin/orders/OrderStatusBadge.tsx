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
    <span className="inline-flex rounded-full border border-[#e5e7ec] bg-[#f4f5f7] px-2.5 py-1 text-[11px] font-medium capitalize text-[#5b6270]">
      {label}
    </span>
  );
}