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
    <span className="inline-flex rounded-full border border-[#e6dfcf] bg-[#f7f2e7] px-2.5 py-1 text-[11px] font-medium capitalize text-[#5f584d]">
      {label}
    </span>
  );
}