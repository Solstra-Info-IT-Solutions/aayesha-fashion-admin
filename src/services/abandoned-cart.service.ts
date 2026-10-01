import { apiGet } from "@/lib/api";

export type AbandonedCart = {
  cartId: string;
  customerName: string;
  email: string;
  phone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  itemCount: number;
  total: number;
  idleHours: number;
  updatedAt: string;
  /** Reminders sent for the current bag contents (max 2). */
  remindersSent: number;
  lastReminderAt: string | null;
};

export type AbandonedCartsResult = {
  summary: { carts: number; value: number };
  carts: AbandonedCart[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { message?: string };
};

export async function getAbandonedCarts(
  accessToken: string,
): Promise<AbandonedCartsResult> {
  const response = await apiGet<ApiResponse<AbandonedCartsResult>>(
    "/admin/abandoned-carts",
    accessToken,
  );

  if (!response.success) {
    throw new Error(response.error?.message || "Unable to load abandoned carts.");
  }

  return response.data;
}
