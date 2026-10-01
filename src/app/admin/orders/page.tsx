import { OrdersPage } from "@/components/admin/orders/OrdersPage";

import type { OrderQuickFilter } from "@/lib/order-quick-filters";
import type { OrderListFilters } from "@/types/order";

const QUICK: OrderQuickFilter[] = [
  "all",
  "awaiting",
  "reported",
  "cancelled",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    quick?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { quick, status, paymentStatus, paymentMethod, from, to } =
    await searchParams;

  const day = /^\d{4}-\d{2}-\d{2}$/;
  const token = /^[a-z_]{1,30}$/;

  // Links from the dashboard (chart bars, status slices, KPI cards).
  const initialFilters: Partial<OrderListFilters> = {
    ...(status && token.test(status) ? { status: status as OrderListFilters["status"] } : {}),
    ...(paymentStatus && token.test(paymentStatus)
      ? { paymentStatus: paymentStatus as OrderListFilters["paymentStatus"] }
      : {}),
    ...(paymentMethod && token.test(paymentMethod) ? { paymentMethod } : {}),
    ...(from && day.test(from) ? { from } : {}),
    ...(to && day.test(to) ? { to } : {}),
  };

  const initialQuick = QUICK.includes(quick as OrderQuickFilter)
    ? (quick as OrderQuickFilter)
    : "all";

  return <OrdersPage
      key={JSON.stringify([initialQuick, initialFilters])}
      initialQuick={initialQuick}
      initialFilters={initialFilters}
    />;
}
