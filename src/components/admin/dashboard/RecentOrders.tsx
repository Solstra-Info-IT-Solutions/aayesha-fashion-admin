import Link from "next/link";

import type {
  DashboardOrder,
} from "@/types/dashboard";

export function RecentOrders({
  orders,
  loading,
}: {
  orders: DashboardOrder[];
  loading: boolean;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white">
      <div className="flex items-center justify-between border-b border-[#eee9e4] px-6 py-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
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
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#eee9e4]">
              {[
                "Order",
                "Customer",
                "Total",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.13em] text-[#969696]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-[#969696]"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-[#969696]"
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

                    <td className="px-6 py-4 text-xs capitalize text-[#6f706f]">
                      {order.status.replace(
                        /_/g,
                        " ",
                      )}
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