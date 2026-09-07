"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useOrderDetails } from "@/hooks/useOrderDetails";

import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderCustomerCard } from "./OrderCustomerCard";
import { OrderAddressCard } from "./OrderAddressCard";
import { OrderItemsCard } from "./OrderItemsCard";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { OrderActionsCard } from "./OrderActionsCard";
import { OrderTimeline } from "./OrderTimeline";

type OrderDetailsPageProps = {
  orderNumber: string;
};

export default function OrderDetailsPage({
  orderNumber,
}: OrderDetailsPageProps) {
  const router = useRouter();

  const {
    order,
    loading,
    error,
    actionLoading,
    updateStatus,
    updatePayment,
    updateShipping,
    updateNotes,
    cancelOrder,
    refetch,
  } = useOrderDetails(orderNumber);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading order details...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            !
          </div>

          <h2 className="text-xl font-semibold text-neutral-900">
            Unable to load order
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            {error || "The requested order could not be found."}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>

            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderDetailHeader
        order={order}
        onBack={() => router.back()}
        onRefresh={() => void refetch()}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <OrderCustomerCard order={order} />

          <OrderAddressCard order={order} />

          <OrderItemsCard order={order} />

          <OrderSummaryCard order={order} />

          <OrderTimeline order={order} />
        </div>

        <aside className="min-w-0">
          <OrderActionsCard
            order={order}
            statusLoading={actionLoading.status}
            paymentLoading={actionLoading.payment}
            shippingLoading={actionLoading.shipping}
            notesLoading={actionLoading.notes}
            cancelLoading={actionLoading.cancel}
            onStatusUpdate={async (status) => {
              await updateStatus(status);
            }}
            onPaymentUpdate={async (input) => {
              await updatePayment(input);
            }}
            onShippingUpdate={async (input) => {
              await updateShipping(input);
            }}
            onNotesUpdate={async (notes) => {
              await updateNotes(notes);
            }}
            onCancel={async (reason) => {
              await cancelOrder(reason);
            }}
          />
        </aside>
      </div>
    </div>
  );
}