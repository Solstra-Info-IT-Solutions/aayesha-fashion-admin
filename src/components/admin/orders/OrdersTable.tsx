"use client";

import Link from "next/link";

import type {
  AdminOrder,
} from "@/types/order";

import {
  OrderStatusBadge,
} from "./OrderStatusBadge";

import {
  PaymentStatusBadge,
} from "./PaymentStatusBadge";

function formatDate(
  value?: string,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

export function OrdersTable({
  orders,
  loading,
}: {
  orders: AdminOrder[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden border border-[#e7e2dd] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-[#eee9e4] bg-[#fcfbf9]">
              {[
                "Order",
                "Customer",
                "Date",
                "Total",
                "Payment",
                "Status",
                "",
              ].map(
                (heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.14em] text-[#969696]"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#f0ece8]"
                  >
                    <td
                      colSpan={7}
                      className="px-5 py-5"
                    >
                      <div className="h-4 animate-pulse bg-[#f2efeb]" />
                    </td>
                  </tr>
                ),
              )
            ) : (
              orders.map(
                (order) => (
                  <tr
                    key={
                      order.orderNumber
                    }
                    className="border-b border-[#f0ece8] transition hover:bg-[#fcfbf9]"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(
                          order.orderNumber,
                        )}`}
                        className="text-sm font-medium text-[#171717] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#171717]">
                        {order.customerName ||
                          "Guest customer"}
                      </p>

                      <p className="mt-1 text-xs text-[#969696]">
                        {order.customerEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6f706f]">
                      {formatDate(
                        order.createdAt,
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#171717]">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <PaymentStatusBadge
                        status={
                          order.paymentStatus
                        }
                      />

                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#969696]">
                        {order.paymentMethod}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatusBadge
                        status={
                          order.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(
                          order.orderNumber,
                        )}`}
                        className="text-xs font-medium text-[#6f706f] hover:text-[#171717]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}