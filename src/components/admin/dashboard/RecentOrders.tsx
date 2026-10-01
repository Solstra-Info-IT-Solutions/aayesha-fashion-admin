import Link from "next/link";

import type { DashboardOrder } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { labelOf, money } from "./format";

const tone = (status: string) =>
  status === "delivered"
    ? "bg-[#e8f5ec] text-[#276541]"
    : status === "cancelled"
      ? "bg-[#fdecec] text-[#b3261e]"
      : status === "pending"
        ? "bg-[#fdf3e1] text-[#7f4806]"
        : "bg-[#eef2ff] text-[#3730a3]";

export function RecentOrders({
  orders,
  loading,
}: {
  orders: DashboardOrder[];
  loading?: boolean;
}) {
  return (
    <ChartCard eyebrow="Orders" title="Recent orders" href="/admin/orders" className="xl:col-span-2">
      {loading ? (
        <p className="py-10 text-center text-sm text-[#737a8c]">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#737a8c]">No orders yet.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#737a8c]">
              <tr>
                <th className="px-2 py-2 font-semibold">Order</th>
                <th className="px-2 py-2 font-semibold">Customer</th>
                <th className="px-2 py-2 font-semibold">Status</th>
                <th className="px-2 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5e7ec]">
              {orders.map((order) => (
                <tr key={order.orderNumber} className="group">
                  <td className="px-2 py-3">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`}
                      className="font-semibold text-[#4338ca] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-[#0f172a]">{order.customerName || "—"}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(order.status)}`}>
                      {labelOf(order.status)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right font-semibold text-[#0f172a]">{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}
