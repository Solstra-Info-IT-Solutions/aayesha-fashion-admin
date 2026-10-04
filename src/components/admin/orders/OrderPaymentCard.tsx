"use client";

import { useEffect, useState } from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getPaymentConfig } from "@/services/payment-config.service";

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
  const [reference, setReference] = useState(
    order.paymentClaimReference || "",
  );

  const { accessToken, isInitialized } = useAdminAuth();
  const [holdMinutes, setHoldMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    getPaymentConfig(accessToken)
      .then((config) => {
        if (!cancelled) setHoldMinutes(config.claimHoldMinutes);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const holdLabel =
    holdMinutes === null
      ? "the verification period"
      : holdMinutes % 60 === 0
        ? `${holdMinutes / 60} hour${holdMinutes === 60 ? "" : "s"}`
        : `${holdMinutes} minutes`;

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
    ...(order.billSentAt
      ? ([["Bill sent on WhatsApp", formatDateTime(order.billSentAt)]] as Array<[string, string]>)
      : []),
    ...(order.invoiceSentAt
      ? ([["Invoice sent on WhatsApp", formatDateTime(order.invoiceSentAt)]] as Array<[string, string]>)
      : []),
  ];

  return (
    <section className="surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a9185]">
            Payment
          </p>

          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#f8f3f1]">
            Payment details
          </h2>
        </div>

        <PaymentStatusBadge status={order.paymentStatus} />
      </div>

      <dl className="mt-6 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-[#cfc7bb]">{label}</dt>
            <dd className="break-all text-right text-[#f8f3f1]">{value}</dd>
          </div>
        ))}

        {isBankUpi && whatsapp ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#cfc7bb]">Bill sent to (WhatsApp)</dt>
            <dd className="text-right">
              <a
                href={`https://wa.me/${whatsapp.length === 10 ? `91${whatsapp}` : whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#f8f3f1] underline underline-offset-2"
              >
                {order.paymentWhatsapp}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      {awaiting ? (
        <div className="mt-6 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">
            {order.paymentClaimedAt
              ? "Customer says they have paid — please verify"
              : "Awaiting payment"}
          </p>

          {order.paymentClaimedAt ? (
            <p className="mt-1 text-xs leading-5">
              Reported {formatDateTime(order.paymentClaimedAt)} · UTR / ref{" "}
              <strong>{order.paymentClaimReference || "—"}</strong>. Check your
              bank / UPI app, then mark as paid. The order is held for up to{" "}
              {holdLabel} from placing before it auto-cancels.
            </p>
          ) : null}

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
              className="h-10 flex-1 border border-amber-200 bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none focus:border-[#f8f3f1]"
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
              className="h-10 bg-[#b79a6a] px-4 text-sm font-medium text-[#111111] hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving…" : "Mark as paid"}
            </button>
          </div>
        </div>
      ) : null}

      {cancelled && !isCod && order.paymentStatus === "failed" ? (
        <p className="mt-6 border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-[#cfc7bb]">
          This order was cancelled because payment was not completed
          {order.paymentId
            ? `. A payment (${order.paymentId}) was received after cancellation — please refund it.`
            : "."}
        </p>
      ) : null}
    </section>
  );
}
