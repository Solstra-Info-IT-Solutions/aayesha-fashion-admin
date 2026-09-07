"use client";

import Link from "next/link";

import {
  Loader2,
} from "lucide-react";

import {
  useOrderDetails,
} from "@/hooks/useOrderDetails";

import {
  OrderDetailHeader,
} from "./OrderDetailHeader";

import {
  OrderCustomerCard,
} from "./OrderCustomerCard";

import {
  OrderAddressCard,
} from "./OrderAddressCard";

import {
  OrderItemsCard,
} from "./OrderItemsCard";

import {
  OrderSummaryCard,
} from "./OrderSummaryCard";

import {
  OrderActionsCard,
} from "./OrderActionsCard";

import {
  OrderTimeline,
} from "./OrderTimeline";

export function OrderDetailsPage({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const {
    order,
    loading,
    actionLoading,
    error,
    refresh,
    changeStatus,
    changePayment,
    changeShipping,
    saveNotes,
    cancel,
  } = useOrderDetails(
    orderNumber,
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          size={24}
          className="animate-spin text-[#292c2c]"
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-serif text-3xl text-[#171717]">
          Order unavailable
        </h1>

        <p className="mt-3 text-sm text-[#6f706f]">
          {error ||
            "The requested order could not be loaded."}
        </p>

        <Link
          href="/admin/orders"
          className="mt-6 inline-flex border border-[#d8d1ca] bg-white px-5 py-3 text-sm text-[#292c2c]"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <OrderDetailHeader
        order={order}
      />

      {error && (
        <div className="flex items-center justify-between gap-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              void refresh()
            }
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="space-y-6">
          <OrderItemsCard
            order={order}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <OrderCustomerCard
              order={order}
            />

            <OrderAddressCard
              order={order}
            />
          </div>

          <OrderTimeline
            order={order}
          />
        </div>

        <div className="space-y-6">
          <OrderSummaryCard
            order={order}
          />

          <OrderActionsCard
            order={order}
            loading={
              actionLoading
            }
            onStatus={async (
              status,
              note,
            ) => {
              await changeStatus(
                status,
                note,
              );
            }}
            onPayment={
              changePayment
            }
            onShipping={
              changeShipping
            }
            onNotes={
              saveNotes
            }
            onCancel={
              cancel
            }
          />
        </div>
      </div>
    </div>
  );
}