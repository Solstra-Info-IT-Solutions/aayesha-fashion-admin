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
    <section className="border border-[#e6ddd4] bg-[#fbf9f5]">
      <div className="flex items-center justify-between border-b border-[#e6ddd4] px-6 py-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
            Orders
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
            Recent orders
          </h2>
        </div>

        <Link
          href="/admin/orders"
          className="text-xs font-medium text-[#70635d] hover:text-[#3f2d2a]"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#e6ddd4]">
              {[
                "Order",
                "Customer",
                "Total",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-[10px] uppercase tracking-[0.13em] text-[#958781]"
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
                  className="px-6 py-10 text-center text-sm text-[#958781]"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-[#958781]"
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
                    className="border-b border-[#e6ddd4] last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#3f2d2a]">
                      {order.orderNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#70635d]">
                      {order.customerName}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#3f2d2a]">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs capitalize text-[#70635d]">
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