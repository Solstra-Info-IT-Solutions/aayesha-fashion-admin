import type { OrderListFilters } from "@/types/order";

export type OrderQuickFilter =
  | "all"
  | "awaiting"
  | "reported"
  | "cancelled";

export const QUICK_FILTERS: Array<{
  id: OrderQuickFilter;
  label: string;
  hint: string;
}> = [
  { id: "all", label: "All orders", hint: "Everything" },
  {
    id: "awaiting",
    label: "Awaiting payment",
    hint: "WhatsApp bill sent, unpaid",
  },
  {
    id: "reported",
    label: "Reported paid",
    hint: "Customer sent a UTR: verify",
  },
  {
    id: "cancelled",
    label: "Cancelled",
    hint: "Includes unpaid auto-cancels",
  },
];

/** Filter values to reset before applying a quick filter. */
const CLEARED: Partial<OrderListFilters> = {
  status: undefined,
  paymentStatus: undefined,
  paymentMethod: undefined,
  paymentClaimed: undefined,
};

export function quickFilterToFilters(
  quick: OrderQuickFilter,
): Partial<OrderListFilters> {
  switch (quick) {
    case "awaiting":
      return {
        ...CLEARED,
        paymentStatus: "pending",
        paymentMethod: "bank_upi",
      };

    case "reported":
      return {
        ...CLEARED,
        paymentStatus: "pending",
        paymentMethod: "bank_upi",
        paymentClaimed: true,
      };

    case "cancelled":
      return { ...CLEARED, status: "cancelled" };

    default:
      return { ...CLEARED };
  }
}

export function activeQuickFilter(
  filters: OrderListFilters,
): OrderQuickFilter | null {
  if (
    filters.paymentStatus === "pending" &&
    filters.paymentMethod === "bank_upi" &&
    filters.paymentClaimed &&
    !filters.status
  ) {
    return "reported";
  }

  if (
    filters.paymentStatus === "pending" &&
    filters.paymentMethod === "bank_upi" &&
    !filters.paymentClaimed &&
    !filters.status
  ) {
    return "awaiting";
  }

  if (
    filters.status === "cancelled" &&
    !filters.paymentStatus &&
    !filters.paymentMethod &&
    !filters.paymentClaimed
  ) {
    return "cancelled";
  }

  if (
    !filters.status &&
    !filters.paymentStatus &&
    !filters.paymentMethod &&
    !filters.paymentClaimed
  ) {
    return "all";
  }

  return null;
}
