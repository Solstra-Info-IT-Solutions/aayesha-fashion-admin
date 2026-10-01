import { OrdersPage } from "@/components/admin/orders/OrdersPage";

import type { OrderQuickFilter } from "@/lib/order-quick-filters";

const QUICK: OrderQuickFilter[] = [
  "all",
  "awaiting",
  "reported",
  "cancelled",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ quick?: string }>;
}) {
  const { quick } = await searchParams;

  const initialQuick = QUICK.includes(quick as OrderQuickFilter)
    ? (quick as OrderQuickFilter)
    : "all";

  return <OrdersPage initialQuick={initialQuick} />;
}
