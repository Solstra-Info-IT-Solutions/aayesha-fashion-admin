"use client";

import { useState } from "react";

import { paymentDeadline, paymentMethodLabel } from "@/lib/payment";
import type { AdminOrder } from "@/types/order";

import { PaymentStatusBadge } from "./PaymentStatusBadge";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type OrderPaymentCardProps = {
  order: AdminOrder;
  loading?: boolean;
  onMarkPaid: (input: {
    paymentStatus: "paid";
    paymentId?: string;
    note?: string;
  }) => Promise<void>;
};

export function OrderPaymentCard({
  order,
  loading = false,
  onMarkPaid,
}: OrderPaymentCardProps) {
  const [reference, setReference] = useState("");

  const isCod = order.paymentMethod === "cod";
  const isBankUpi = order.paymentMethod === "bank_upi";
  const cancelled = order.status === "cancelled";
  const awaiting =
    !isCod && order.paymentStatus === "pending" && !cancelled;

  const deadline = awaiting ? paymentDeadline(order.createdAt) : null;
  const whatsapp = (order.paymentWhatsapp || "").replace(/\D/g, "");

  const rows: Array<[string, string]> = [
    ["Method", paymentMethodLabel(order.paymentMethod)],
    ...(order.razorpayOrderId
      ? ([["Razorpay order", order.razorpayOrderId]] as Array<[string, string]>)
      : []),
    ...(order.paymentId
      ? ([["Payment ID / reference", order.paymentId]] as Array<[string, string]>)
      : []),
    ["Paid at", formatDateTime(order.paymentPaidAt)],
  ];

  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
            Payment
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#171717]">
            Payment details
          </h2>
        </div>

        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-[#6f706f]">{label}</dt>
            <dd className="break-all text-right text-[#171717]">{value}</dd>
          </div>
        ))}

        {isBankUpi && whatsapp ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#6f706f]">Bill sent to (WhatsApp)</dt>
            <dd className="text-right">
              <a
                href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#171717] underline underline-offset-2"
              >
                {order.paymentWhatsapp}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      {awaiting ? (
        <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Awaiting payment</p>

          <p className="mt-1 text-xs leading-5">
            {deadline
              ? `This order is cancelled automatically if it is not paid by ${formatDateTime(deadline.toISOString())}.`
              : "This order is cancelled automatically if it is not paid in time."}
            {isBankUpi
              ? " Check your bank / UPI app for the transfer, then mark it as paid."
              : " Razorpay payments are marked paid automatically."}
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="UTR / reference (optional)"
              className="h-10 flex-1 border border-amber-200 bg-white px-3 text-sm text-[#171717] outline-none focus:border-[#292c2c]"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (
                  !window.confirm(
                    "Mark this order as paid? The customer will be notified.",
                  )
                ) {
                  return;
                }

                void onMarkPaid({
                  paymentStatus: "paid",
                  ...(reference.trim() ? { paymentId: reference.trim() } : {}),
                  note: "Payment received (marked by admin).",
                });
              }}
              className="h-10 bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving…" : "Mark as paid"}
            </button>
          </div>
        </div>
      ) : null}

      {cancelled && !isCod && order.paymentStatus === "failed" ? (
        <p className="mt-6 border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-[#6f706f]">
          This order was cancelled because payment was not completed
          {order.paymentId
            ? `. A payment (${order.paymentId}) was received after cancellation — please refund it.`
            : "."}
        </p>
      ) : null}
    </section>
  );
}
