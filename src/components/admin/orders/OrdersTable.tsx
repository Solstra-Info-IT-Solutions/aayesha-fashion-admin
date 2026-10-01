"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { paymentMethodLabel } from "@/lib/payment";
import type { AdminOrder } from "@/types/order";

import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" });

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function when(value?: string) {
  if (!value) return { date: "—", time: "" };

  const date = new Date(value);

  return { date: dateFmt.format(date), time: timeFmt.format(date) };
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("") || "G";

function itemSummary(order: AdminOrder) {
  const count = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const first = order.items[0]?.productName;

  if (!first) return `${count} item${count === 1 ? "" : "s"}`;

  return order.items.length > 1 ? `${first} +${order.items.length - 1} more` : `${first} × ${count}`;
}

const href = (order: AdminOrder) => `/admin/orders/${encodeURIComponent(order.orderNumber)}`;

function Reported({ order }: { order: AdminOrder }) {
  return order.paymentClaimedAt && order.paymentStatus === "pending" ? (
    <span className="inline-flex rounded-full bg-[#f1ead9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f542f]">
      Customer reported paid
    </span>
  ) : null;
}

export function OrdersTable({ orders, loading }: { orders: AdminOrder[]; loading: boolean }) {
  if (loading && orders.length === 0) {
    return (
      <div className="surface divide-y divide-[#e6dfcf]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-5">
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#efe8d8]" />
            <div className="h-4 flex-1 animate-pulse rounded bg-[#efe8d8]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
      {/* Desktop / tablet: table */}
      <div className="surface hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]">
                {["Order", "Customer", "Date", "Items", "Total", "Payment", "Status", ""].map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#756d62] ${
                      heading === "Total" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e6dfcf]">
              {orders.map((order) => {
                const stamp = when(order.createdAt);

                return (
                  <tr key={order.orderNumber} className="group transition-colors hover:bg-[#faf6ec]">
                    <td className="px-5 py-4">
                      <Link href={href(order)} className="text-sm font-bold tracking-wide text-[#2a2520] hover:text-[#8a6a3b]">
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1ead9] text-xs font-bold text-[#6f542f]">
                          {initials(order.customerName || "")}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#2a2520]">
                            {order.customerName || "Guest customer"}
                          </p>
                          <p className="truncate text-xs text-[#756d62]">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#2a2520]">{stamp.date}</p>
                      <p className="text-xs text-[#756d62]">{stamp.time}</p>
                    </td>

                    <td className="max-w-[170px] px-5 py-4 text-sm text-[#5f584d]">
                      <span className="line-clamp-2">{itemSummary(order)}</span>
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-[#2a2520]">{money(order.total)}</td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <PaymentStatusBadge status={order.paymentStatus} />
                        <Reported order={order} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#756d62]">
                          {paymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={href(order)}
                        aria-label={`Open order ${order.orderNumber}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8a8275] transition group-hover:bg-[#26221d] group-hover:text-[#fffdf8]"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phones: cards */}
      <ul className="space-y-3 md:hidden">
        {orders.map((order) => {
          const stamp = when(order.createdAt);

          return (
            <li key={order.orderNumber}>
              <Link href={href(order)} className="surface surface-hover block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1ead9] text-xs font-bold text-[#6f542f]">
                      {initials(order.customerName || "")}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-wide text-[#2a2520]">{order.orderNumber}</p>
                      <p className="truncate text-xs text-[#756d62]">{order.customerName || "Guest customer"}</p>
                    </div>
                  </div>

                  <p className="shrink-0 text-base font-bold text-[#2a2520]">{money(order.total)}</p>
                </div>

                <p className="mt-3 line-clamp-1 text-xs text-[#5f584d]">{itemSummary(order)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <Reported order={order} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#e6dfcf] pt-3 text-xs text-[#756d62]">
                  <span>
                    {stamp.date} · {stamp.time}
                  </span>
                  <span className="font-semibold uppercase tracking-[0.08em]">{paymentMethodLabel(order.paymentMethod)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
