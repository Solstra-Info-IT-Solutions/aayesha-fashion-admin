import Link from "next/link";

import type {
  DashboardOrder,
} from "@/types/dashboard";

export function RecentOrders({
  orders,
  loading,
}: {
  orders: DashboardOrder[];
  loading?: boolean;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white">
      <div className="flex items-center justify-between border-b border-[#eee9e4] px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#969696]">
            Orders
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#171717]">
            Recent orders
          </h2>
        </div>

        <Link
          href="/admin/orders"
          className="text-xs font-medium text-[#6f706f] hover:text-[#171717]"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px]">
          <thead>
            <tr className="border-b border-[#eee9e4] text-left">
              <th className="px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                Order
              </th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                Customer
              </th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                Total
              </th>
              <th className="px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-[#969696]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-[#969696]"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length ===
              0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-[#969696]"
                >
                  No recent orders.
                </td>
              </tr>
            ) : (
              orders.map(
                (order) => (
                  <tr
                    key={
                      order.orderNumber
                    }
                    className="border-b border-[#f0ece8] last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#171717]">
                      {order.orderNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#6f706f]">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#171717]">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs capitalize text-[#6f706f]">
                        {order.status.replace(
                          /_/g,
                          " ",
                        )}
                      </span>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}