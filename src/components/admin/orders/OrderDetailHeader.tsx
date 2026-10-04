"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Copy, Mail, MessageCircle, Phone, RefreshCw } from "lucide-react";

import { paymentMethodLabel } from "@/lib/payment";
import type { AdminOrder } from "@/types/order";

import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const STEPS = [
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

/** Maps the many delivery statuses onto the 5-step tracker. */
function stepIndex(status: string): number {
  if (status === "in_transit" || status === "out_for_delivery") return 3;

  const index = STEPS.findIndex((step) => step.key === status);

  return index;
}

const digits = (value?: string | null) => (value ?? "").replace(/\D/g, "");

const waNumber = (value?: string | null) => {
  const d = digits(value);

  return d.length === 10 ? `91${d}` : d;
};

const stamp = (value?: string) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

const iconButton =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-3.5 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:opacity-50";

export function OrderDetailHeader({
  order,
  onRefresh,
  refreshing,
  onBack,
}: {
  order: AdminOrder;
  onRefresh: () => void;
  refreshing: boolean;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const ended = ["cancelled", "returned", "exchanged"].includes(order.status);
  const current = ended ? -1 : stepIndex(order.status);

  const phone = waNumber(order.paymentWhatsapp || order.customerPhone);
  const message = encodeURIComponent(
    `Hi ${order.customerName || ""}, this is Aayesha Fashion regarding your order ${order.orderNumber}.`,
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9c7a3]">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#3a352f] bg-[#1a1816] text-[#f8f3f1] transition hover:border-[#b79a6a]"
            >
              <ArrowLeft size={15} />
            </button>

            <Link href="/admin/orders" className="hover:underline">
              Orders
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-[#f8f3f1]">{order.orderNumber}</h1>

            <button
              type="button"
              onClick={copy}
              aria-label="Copy order number"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#9a9185] transition hover:bg-[#211e1b] hover:text-[#f8f3f1]"
            >
              {copied ? <Check size={15} className="text-[#8fb08a]" /> : <Copy size={15} />}
            </button>

            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#cfc7bb]">
            <span>Placed {stamp(order.createdAt)}</span>

            <span className="hidden h-1 w-1 rounded-full bg-[#4a443d] sm:block" />

            <span className="flex items-center gap-2">
              <PaymentStatusBadge status={order.paymentStatus} />
              {paymentMethodLabel(order.paymentMethod)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {phone ? (
            <a
              href={`https://wa.me/${phone}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className={iconButton}
            >
              <MessageCircle size={15} className="text-[#8fb08a]" />
              WhatsApp
            </a>
          ) : null}

          {order.customerPhone ? (
            <a href={`tel:${order.customerPhone}`} className={iconButton}>
              <Phone size={15} />
              Call
            </a>
          ) : null}

          {order.customerEmail ? (
            <a href={`mailto:${order.customerEmail}?subject=Order ${order.orderNumber}`} className={iconButton}>
              <Mail size={15} />
              Email
            </a>
          ) : null}

          <button type="button" onClick={onRefresh} disabled={refreshing} className={iconButton}>
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Fulfilment progress */}
      <div className="surface p-5">
        {ended ? (
          <p className="text-sm font-semibold text-[#cfc7bb]">
            This order is{" "}
            <span className="capitalize text-[#f8f3f1]">{order.status.replace(/_/g, " ")}</span>
            {order.cancelledAt ? ` · ${stamp(order.cancelledAt)}` : ""}.
          </p>
        ) : (
          <ol className="grid grid-cols-5 gap-2" aria-label="Fulfilment progress">
            {STEPS.map((step, index) => {
              const done = index < current;
              const active = index === current;

              return (
                <li key={step.key} className="relative flex flex-col items-center text-center">
                  {index > 0 ? (
                    <span
                      className={`absolute right-1/2 top-[15px] h-0.5 w-full ${
                        index <= current ? "bg-[#b79a6a]" : "bg-[#2e2a26]"
                      }`}
                      aria-hidden="true"
                    />
                  ) : null}

                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      done
                        ? "border-[#b79a6a] bg-[#b79a6a] text-[#111111]"
                        : active
                          ? "border-[#f8f3f1] bg-[#b79a6a] text-[#1a1816] ring-4 ring-[#b79a6a]/25"
                          : "border-[#3a352f] bg-[#1a1816] text-[#8c847d]"
                    }`}
                  >
                    {done ? <Check size={14} /> : index + 1}
                  </span>

                  <span
                    className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                      active ? "text-[#f8f3f1]" : done ? "text-[#d9c7a3]" : "text-[#9a9185]"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
