import { apiGet, apiPost, apiPut } from "@/lib/api";

export type PaymentSettings = {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  storeGstin: string;
  invoiceNote: string;

  upiId: string;
  bankDetails: string;

  claimHoldMinutes: number;
  invoiceCooldownSeconds: number;

  whatsappPhoneNumberId: string;
  whatsappApiVersion: string;
  whatsappTemplateLanguage: string;
  whatsappInvoiceTemplate: string;
  whatsappBillTemplate: string;
};

export type PaymentConfigView = {
  settings: PaymentSettings;
  savedFields: string[];
  whatsappAccessToken: {
    set: boolean;
    hint: string;
    source: "admin" | "env" | "none";
  };
  paymentWindowMinutes: number;
  razorpayConfigured: boolean;
  status: {
    upiConfigured: boolean;
    bankDetailsConfigured: boolean;
    whatsappCredentialsConfigured: boolean;
    invoiceTemplateSet: boolean;
    billTemplateSet: boolean;
  };
};

export type PaymentConfigInput = Partial<PaymentSettings> & {
  whatsappAccessToken?: string;
  clearWhatsappAccessToken?: boolean;
};

export type WhatsAppVerification = {
  displayPhoneNumber: string;
  verifiedName: string;
  qualityRating: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { message?: string };
};

function unwrap<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success) {
    throw new Error(response.error?.message || fallback);
  }

  return response.data;
}

export async function getPaymentConfigView(
  accessToken: string,
): Promise<PaymentConfigView> {
  return unwrap(
    await apiGet<ApiResponse<PaymentConfigView>>("/admin/payment-config", accessToken),
    "Unable to load payment settings.",
  );
}

export async function savePaymentConfig(
  accessToken: string,
  input: PaymentConfigInput,
): Promise<Pick<PaymentConfigView, "settings" | "savedFields" | "whatsappAccessToken">> {
  return unwrap(
    await apiPut<
      ApiResponse<Pick<PaymentConfigView, "settings" | "savedFields" | "whatsappAccessToken">>
    >("/admin/payment-config", input, accessToken),
    "Unable to save payment settings.",
  );
}

export async function verifyWhatsApp(
  accessToken: string,
): Promise<WhatsAppVerification> {
  return unwrap(
    await apiPost<ApiResponse<WhatsAppVerification>>(
      "/admin/payment-config/verify-whatsapp",
      {},
      accessToken,
    ),
    "Could not verify the WhatsApp connection.",
  );
}

/** Used by the order screen to show the configured hold time. */
export async function getPaymentConfig(accessToken: string) {
  const view = await getPaymentConfigView(accessToken);

  return { claimHoldMinutes: view.settings.claimHoldMinutes };
}
