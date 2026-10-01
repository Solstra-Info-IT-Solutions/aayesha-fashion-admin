import { apiGet } from "@/lib/api";

export type PaymentConfig = {
  paymentWindowMinutes: number;
  claimHoldMinutes: number;
  invoiceCooldownSeconds: number;
  upiConfigured: boolean;
  bankDetailsConfigured: boolean;
  razorpayConfigured: boolean;
  whatsapp: {
    credentialsConfigured: boolean;
    apiVersion: string;
    templateLanguage: string;
    invoiceTemplate: string | null;
    billTemplate: string | null;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { message?: string };
};

export async function getPaymentConfig(
  accessToken: string,
): Promise<PaymentConfig> {
  const response = await apiGet<ApiResponse<PaymentConfig>>(
    "/admin/payment-config",
    accessToken,
  );

  if (!response.success) {
    throw new Error(response.error?.message || "Unable to load payment settings.");
  }

  return response.data;
}
