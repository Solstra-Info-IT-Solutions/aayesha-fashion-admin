"use client";

import { paymentMethodLabel } from "@/lib/payment";
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
    <div className="overflow-hidden border border-[#e6ddd4] bg-[#fbf9f5]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-[#e6ddd4] bg-[#f7f3ed]">
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
                    className="px-5 py-3 text-left text-[10px] uppercase tracking-[0.14em] text-[#958781]"
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
                    className="border-b border-[#e6ddd4]"
                  >
                    <td
                      colSpan={7}
                      className="px-5 py-5"
                    >
                      <div className="h-4 animate-pulse bg-[#efe8df]" />
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
                    className="border-b border-[#e6ddd4] transition hover:bg-[#f7f3ed]"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(
                          order.orderNumber,
                        )}`}
                        className="text-sm font-medium text-[#3f2d2a] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#3f2d2a]">
                        {order.customerName ||
                          "Guest customer"}
                      </p>

                      <p className="mt-1 text-xs text-[#958781]">
                        {order.customerEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#70635d]">
                      {formatDate(
                        order.createdAt,
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#3f2d2a]">
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

                      {order.paymentClaimedAt &&
                      order.paymentStatus === "pending" ? (
                        <p className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-800">
                          Customer reported paid
                        </p>
                      ) : null}

                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#958781]">
                        {paymentMethodLabel(
                          order.paymentMethod,
                        )}
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
                        className="text-xs font-medium text-[#70635d] hover:text-[#3f2d2a]"
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