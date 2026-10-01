"use client";

import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  useOrderDetails,
} from "@/hooks/useOrderDetails";

import type {
  OrderStatus,
} from "@/types/order";

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
  OrderPaymentCard,
} from "./OrderPaymentCard";

import {
  OrderActionsCard,
} from "./OrderActionsCard";

import {
  OrderTimeline,
} from "./OrderTimeline";

type OrderDetailsPageProps = {
  orderNumber: string;
};

export function OrderDetailsPage({
  orderNumber,
}: OrderDetailsPageProps) {
  const router = useRouter();

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
  } = useOrderDetails(orderNumber);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-24 animate-pulse rounded-xl bg-[#efe8d8]" />
        <div className="h-24 animate-pulse rounded-xl bg-[#efe8d8]" />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="h-80 animate-pulse rounded-xl bg-[#efe8d8]" />
          <div className="h-80 animate-pulse rounded-xl bg-[#efe8d8]" />
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR / NOT FOUND
  ========================================================= */

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-2">
        <div className="surface w-full max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fdecec] text-lg font-bold text-[#b3261e]">
            !
          </div>

          <h2 className="display text-3xl font-semibold text-[#2a2520]">Unable to load order</h2>

          <p className="mt-2 text-sm leading-6 text-[#5f584d]">
            {error || "The requested order could not be found."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#d6ccb6] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>

            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#3d372f]"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-6">
      <OrderDetailHeader
        order={order}
        onRefresh={() => void refresh()}
        refreshing={actionLoading}
        onBack={() => router.back()}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* What was ordered, what it cost, what happened */}
        <div className="min-w-0 space-y-6">
          <OrderItemsCard order={order} />

          <OrderSummaryCard order={order} />

          <div className="grid gap-6 md:grid-cols-2">
            <OrderCustomerCard order={order} />

            <OrderAddressCard order={order} />
          </div>

          <OrderTimeline order={order} />
        </div>

        {/* Payment first (verification is urgent), then fulfilment actions */}
        <aside className="min-w-0 space-y-6">
          <OrderPaymentCard
            order={order}
            loading={actionLoading}
            onMarkPaid={async (input) => {
              await changePayment(input);
            }}
          />

          <OrderActionsCard
            order={order}
            loading={actionLoading}
            onStatus={async (status: OrderStatus, note?: string) => {
              await changeStatus(status, note);
            }}
            onPayment={async (input) => {
              await changePayment(input);
            }}
            onShipping={async (input) => {
              await changeShipping(input);
            }}
            onNotes={async (notes) => {
              await saveNotes(notes);
            }}
            onCancel={async (reason) => {
              await cancel(reason);
            }}
          />
        </aside>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
