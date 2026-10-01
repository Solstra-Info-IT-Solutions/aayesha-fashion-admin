/** Customers have this long to pay online / Bank-UPI orders (matches backend). */
export const PAYMENT_WINDOW_MINUTES = 30;

const LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  online: "Online (Razorpay)",
  bank_upi: "Bank / UPI Transfer",
};

export function paymentMethodLabel(method?: string | null): string {
  if (!method) return "—";

  return LABELS[method] ?? method.replace(/_/g, " ");
}

/** When an unpaid online / Bank-UPI order will be auto-cancelled. */
export function paymentDeadline(createdAt?: string): Date | null {
  if (!createdAt) return null;

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) return null;

  return new Date(created.getTime() + PAYMENT_WINDOW_MINUTES * 60_000);
}
