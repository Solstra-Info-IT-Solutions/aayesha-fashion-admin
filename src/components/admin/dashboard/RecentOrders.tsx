import Link from "next/link";

import type { DashboardOrder } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { labelOf, money } from "./format";

const tone = (status: string) =>
  status === "delivered"
    ? "bg-[#1a2419] text-[#8fb08a]"
    : status === "cancelled"
      ? "bg-[#2b1a18] text-[#e08b84]"
      : status === "pending"
        ? "bg-[#2b2216] text-[#e0b56a]"
        : "bg-[#2a241b] text-[#d9c7a3]";

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
        <p className="py-10 text-center text-sm text-[#9a9185]">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">No orders yet.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[#9a9185]">
              <tr>
                <th className="px-2 py-2 font-semibold">Order</th>
                <th className="px-2 py-2 font-semibold">Customer</th>
                <th className="px-2 py-2 font-semibold">Status</th>
                <th className="px-2 py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2e2a26]">
              {orders.map((order) => (
                <tr key={order.orderNumber} className="group">
                  <td className="px-2 py-3">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`}
                      className="font-semibold text-[#d9c7a3] hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-2 py-3 text-[#f8f3f1]">{order.customerName || "—"}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone(order.status)}`}>
                      {labelOf(order.status)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right font-semibold text-[#f8f3f1]">{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}
