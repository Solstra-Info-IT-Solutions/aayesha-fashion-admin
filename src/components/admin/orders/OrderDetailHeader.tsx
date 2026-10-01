import Link from "next/link";

import { paymentMethodLabel } from "@/lib/payment";
import type {
  AdminOrder,
} from "@/types/order";

import {
  OrderStatusBadge,
} from "./OrderStatusBadge";

import {
  PaymentStatusBadge,
} from "./PaymentStatusBadge";

export function OrderDetailHeader({
  order,
}: {
  order: AdminOrder;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <Link
          href="/admin/orders"
          className="text-xs text-[#5b6270] hover:text-[#0f172a]"
        >
          ← Back to orders
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl text-[#0f172a]">
            {order.orderNumber}
          </h1>

          <OrderStatusBadge
            status={order.status}
          />
        </div>

        <p className="mt-2 text-sm text-[#5b6270]">
          Placed{" "}
          {order.createdAt
            ? new Intl.DateTimeFormat(
                "en-IN",
                {
                  dateStyle:
                    "medium",
                  timeStyle:
                    "short",
                },
              ).format(
                new Date(
                  order.createdAt,
                ),
              )
            : "—"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <PaymentStatusBadge
          status={
            order.paymentStatus
          }
        />

        <span className="text-sm text-[#5b6270]">
          {paymentMethodLabel(
            order.paymentMethod,
          )}
        </span>
      </div>
    </div>
  );
}