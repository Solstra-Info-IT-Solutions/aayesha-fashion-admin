"use client";

import {
  useState,
} from "react";

import type {
  AdminOrder,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

const nextStatuses: OrderStatus[] = [
  "processing",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

export function OrderActionsCard({
  order,
  loading,
  onStatus,
  onPayment,
  onShipping,
  onNotes,
  onCancel,
}: {
  order: AdminOrder;
  loading: boolean;
  onStatus: (
    status: OrderStatus,
    note?: string,
  ) => Promise<void>;

  onPayment: (input: {
    paymentStatus: PaymentStatus;
    paymentId?: string;
    paymentSource?: string;
    note?: string;
  }) => Promise<void>;

  onShipping: (input: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    note?: string;
  }) => Promise<void>;

  onNotes: (
    notes: string,
  ) => Promise<void>;

  onCancel: (
    reason: string,
  ) => Promise<void>;
}) {
  const [
    status,
    setStatus,
  ] = useState<
    OrderStatus | ""
  >("");

  const [
    statusNote,
    setStatusNote,
  ] = useState("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState<
    PaymentStatus | ""
  >("");

  const [
    paymentId,
    setPaymentId,
  ] = useState(
    order.paymentId ||
      "",
  );

  const [
    paymentSource,
    setPaymentSource,
  ] = useState(
    order.paymentSource ||
      "",
  );

  const [
    courierName,
    setCourierName,
  ] = useState(
    order.shippingInfo
      ?.courierName ||
      "",
  );

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState(
    order.shippingInfo
      ?.trackingNumber ||
      "",
  );

  const [
    trackingUrl,
    setTrackingUrl,
  ] = useState(
    order.shippingInfo
      ?.trackingUrl ||
      "",
  );

  const [
    notes,
    setNotes,
  ] = useState(
    order.adminNotes ||
      "",
  );

  const [
    cancelReason,
    setCancelReason,
  ] = useState("");

  async function submitStatus() {
    if (!status) return;

    await onStatus(
      status,
      statusNote || undefined,
    );

    setStatus("");
    setStatusNote("");
  }

  async function submitPayment() {
    if (!paymentStatus) return;

    await onPayment({
      paymentStatus,
      ...(paymentId
        ? { paymentId }
        : {}),
      ...(paymentSource
        ? { paymentSource }
        : {}),
    });

    setPaymentStatus("");
  }

  async function submitShipping() {
    await onShipping({
      courierName:
        courierName || undefined,
      trackingNumber:
        trackingNumber ||
        undefined,
      trackingUrl:
        trackingUrl || undefined,
    });
  }

  async function submitNotes() {
    await onNotes(notes);
  }

  async function submitCancel() {
    if (!cancelReason.trim()) {
      return;
    }

    await onCancel(
      cancelReason.trim(),
    );

    setCancelReason("");
  }

  return (
    <section className="space-y-5">
      <div className="border border-[#e5e7ec] bg-[#ffffff] p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
          Fulfilment
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
          Order status
        </h2>

        <div className="mt-5 space-y-3">
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as OrderStatus,
              )
            }
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] bg-[#ffffff] px-3 text-sm outline-none focus:border-[#1a1d24]"
          >
            <option value="">
              Select next status
            </option>

            {nextStatuses.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                  disabled={
                    value ===
                    order.status
                  }
                >
                  {value.replace(
                    /_/g,
                    " ",
                  )}
                </option>
              ),
            )}
          </select>

          <textarea
            value={statusNote}
            onChange={(event) =>
              setStatusNote(
                event.target.value,
              )
            }
            placeholder="Optional status note"
            disabled={loading}
            rows={3}
            className="w-full resize-none border border-[#d3d7df] p-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <button
            type="button"
            onClick={() =>
              void submitStatus()
            }
            disabled={
              loading ||
              !status
            }
            className="h-10 w-full bg-[#2b3a55] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Update status
          </button>
        </div>
      </div>

      <div className="border border-[#e5e7ec] bg-[#ffffff] p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
          Payment
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
          Payment details
        </h2>

        <div className="mt-5 space-y-3">
          <select
            value={paymentStatus}
            onChange={(event) =>
              setPaymentStatus(
                event.target
                  .value as PaymentStatus,
              )
            }
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] bg-[#ffffff] px-3 text-sm outline-none focus:border-[#1a1d24]"
          >
            <option value="">
              Select payment status
            </option>

            {paymentStatuses.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value.replace(
                    /_/g,
                    " ",
                  )}
                </option>
              ),
            )}
          </select>

          <input
            value={paymentId}
            onChange={(event) =>
              setPaymentId(
                event.target.value,
              )
            }
            placeholder="Payment ID"
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] px-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <input
            value={paymentSource}
            onChange={(event) =>
              setPaymentSource(
                event.target.value,
              )
            }
            placeholder="Payment source"
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] px-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <button
            type="button"
            onClick={() =>
              void submitPayment()
            }
            disabled={
              loading ||
              !paymentStatus
            }
            className="h-10 w-full border border-[#1a1d24] text-sm font-medium text-[#1a1d24] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Update payment
          </button>
        </div>
      </div>

      <div className="border border-[#e5e7ec] bg-[#ffffff] p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
          Shipping
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
          Tracking information
        </h2>

        <div className="mt-5 space-y-3">
          <input
            value={courierName}
            onChange={(event) =>
              setCourierName(
                event.target.value,
              )
            }
            placeholder="Courier name"
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] px-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <input
            value={trackingNumber}
            onChange={(event) =>
              setTrackingNumber(
                event.target.value,
              )
            }
            placeholder="Tracking number"
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] px-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <input
            value={trackingUrl}
            onChange={(event) =>
              setTrackingUrl(
                event.target.value,
              )
            }
            placeholder="Tracking URL"
            disabled={loading}
            className="h-11 w-full border border-[#d3d7df] px-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <button
            type="button"
            onClick={() =>
              void submitShipping()
            }
            disabled={loading}
            className="h-10 w-full border border-[#1a1d24] text-sm font-medium text-[#1a1d24] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save shipping
          </button>
        </div>
      </div>

      <div className="border border-[#e5e7ec] bg-[#ffffff] p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
          Internal
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
          Admin notes
        </h2>

        <div className="mt-5 space-y-3">
          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value,
              )
            }
            rows={5}
            placeholder="Internal notes..."
            disabled={loading}
            className="w-full resize-none border border-[#d3d7df] p-3 text-sm outline-none focus:border-[#1a1d24]"
          />

          <button
            type="button"
            onClick={() =>
              void submitNotes()
            }
            disabled={loading}
            className="h-10 w-full border border-[#1a1d24] text-sm font-medium text-[#1a1d24] disabled:opacity-50"
          >
            Save notes
          </button>
        </div>
      </div>

      {order.status !==
        "cancelled" &&
        order.status !==
          "delivered" &&
        order.status !==
          "returned" &&
        order.status !==
          "exchanged" && (
          <div className="border border-[#fdecec] bg-[#fdecec] p-6">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#7d8aa6]">
              Destructive action
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
              Cancel order
            </h2>

            <div className="mt-5 space-y-3">
              <textarea
                value={
                  cancelReason
                }
                onChange={(
                  event,
                ) =>
                  setCancelReason(
                    event.target
                      .value,
                  )
                }
                rows={3}
                placeholder="Cancellation reason"
                disabled={loading}
                className="w-full resize-none border border-[#fdecec] bg-[#ffffff] p-3 text-sm outline-none focus:border-[#7d8aa6]"
              />

              <button
                type="button"
                onClick={() =>
                  void submitCancel()
                }
                disabled={
                  loading ||
                  !cancelReason.trim()
                }
                className="h-10 w-full bg-[#7d8aa6] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel order
              </button>
            </div>
          </div>
        )}
    </section>
  );
}