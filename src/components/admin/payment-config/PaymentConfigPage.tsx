"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  Save,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  getPaymentConfigView,
  savePaymentConfig,
  verifyWhatsApp,
  type PaymentConfigView,
  type PaymentSettings,
  type WhatsAppVerification,
} from "@/services/payment-config.service";

/* =========================================================
   VALIDATION (mirrors the server rules)
========================================================= */

type Errors = Partial<Record<keyof PaymentSettings, string>>;

const rules: Array<[keyof PaymentSettings, (value: string) => string]> = [
  ["storePhone", (v) => (v && !/^[0-9+()\-\s]{6,20}$/.test(v) ? "Enter a valid phone number." : "")],
  ["storeEmail", (v) => (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address." : "")],
  ["storeGstin", (v) => (v && !/^[0-9A-Za-z]{15}$/.test(v) ? "GSTIN must be 15 characters." : "")],
  ["upiId", (v) => (v && !/^[\w.\-]{2,}@[A-Za-z][\w.\-]{1,}$/.test(v) ? "Enter a valid UPI ID, e.g. name@bank." : "")],
  ["whatsappPhoneNumberId", (v) => (v && !/^\d{6,20}$/.test(v) ? "Phone number ID is digits only." : "")],
  ["whatsappApiVersion", (v) => (v && !/^v\d{1,2}\.\d$/.test(v) ? "Use a version like v23.0." : "")],
  ["whatsappTemplateLanguage", (v) => (v && !/^[a-z]{2}(_[A-Z]{2})?$/.test(v) ? "Use a code like en or en_US." : "")],
  ["whatsappInvoiceTemplate", (v) => (v && !/^[a-z0-9_]+$/.test(v) ? "Lowercase letters, digits and underscores only." : "")],
  ["whatsappBillTemplate", (v) => (v && !/^[a-z0-9_]+$/.test(v) ? "Lowercase letters, digits and underscores only." : "")],
];

function validate(values: PaymentSettings): Errors {
  const errors: Errors = {};

  rules.forEach(([field, check]) => {
    const message = check(String(values[field] ?? "").trim());

    if (message) errors[field] = message;
  });

  if (!(values.claimHoldMinutes >= 30 && values.claimHoldMinutes <= 1440)) {
    errors.claimHoldMinutes = "Enter between 30 and 1440 minutes.";
  }

  if (!(values.invoiceCooldownSeconds >= 0 && values.invoiceCooldownSeconds <= 3600)) {
    errors.invoiceCooldownSeconds = "Enter between 0 and 3600 seconds.";
  }

  return errors;
}

/* =========================================================
   SMALL UI PIECES
========================================================= */

const inputClass =
  "h-11 w-full border border-[#d6ccb6] bg-white px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/15 disabled:bg-[#efe8d8]";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#2a2520]">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-[#b3261e]">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-[#5f584d]">{hint}</span>
      ) : null}
    </label>
  );
}

function Section({
  eyebrow,
  title,
  description,
  badge,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#e6dfcf] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-[#2a2520]">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5f584d]">{description}</p>
        </div>

        {badge}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Badge({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold ${
        ok
          ? "border-[#bfe3cb] bg-[#e8f5ec] text-[#276541]"
          : "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806]"
      }`}
    >
      {ok ? <CheckCircle2 size={13} /> : <CircleAlert size={13} />}
      {ok ? yes : no}
    </span>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function PaymentConfigPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [view, setView] = useState<PaymentConfigView | null>(null);
  const [values, setValues] = useState<PaymentSettings | null>(null);
  const [failed, setFailed] = useState(false);

  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [removeToken, setRemoveToken] = useState(false);

  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<WhatsAppVerification | null>(null);
  const [verifyError, setVerifyError] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    getPaymentConfigView(accessToken)
      .then((result) => {
        if (cancelled) return;
        setView(result);
        setValues(result.settings);
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(true);
        toast.error(error instanceof Error ? error.message : "Unable to load payment settings.");
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const errors = useMemo(() => (values ? validate(values) : {}), [values]);

  const dirty = useMemo(() => {
    if (!view || !values) return false;

    return (
      JSON.stringify(values) !== JSON.stringify(view.settings) ||
      tokenInput.trim() !== "" ||
      removeToken
    );
  }, [view, values, tokenInput, removeToken]);

  const set = useCallback(
    <K extends keyof PaymentSettings>(field: K, value: PaymentSettings[K]) =>
      setValues((current) => (current ? { ...current, [field]: value } : current)),
    [],
  );

  const text = (field: keyof PaymentSettings) => ({
    value: String(values?.[field] ?? ""),
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(field, event.target.value as never),
  });

  async function handleSave() {
    if (!accessToken || !values || saving) return;

    setShowErrors(true);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);

    try {
      const saved = await savePaymentConfig(accessToken, {
        ...values,
        ...(tokenInput.trim() ? { whatsappAccessToken: tokenInput.trim() } : {}),
        ...(removeToken && !tokenInput.trim() ? { clearWhatsappAccessToken: true } : {}),
      });

      setView((current) =>
        current
          ? {
              ...current,
              settings: saved.settings,
              savedFields: saved.savedFields,
              whatsappAccessToken: saved.whatsappAccessToken,
              status: {
                ...current.status,
                upiConfigured: Boolean(saved.settings.upiId),
                bankDetailsConfigured: Boolean(saved.settings.bankDetails),
                whatsappCredentialsConfigured: Boolean(
                  saved.whatsappAccessToken.set && saved.settings.whatsappPhoneNumberId,
                ),
                invoiceTemplateSet: Boolean(saved.settings.whatsappInvoiceTemplate),
                billTemplateSet: Boolean(saved.settings.whatsappBillTemplate),
              },
            }
          : current,
      );
      setValues(saved.settings);
      setTokenInput("");
      setRemoveToken(false);
      setShowErrors(false);
      setVerified(null);
      toast.success("Settings saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleVerify() {
    if (!accessToken || verifying) return;

    setVerifying(true);
    setVerified(null);
    setVerifyError("");

    try {
      setVerified(await verifyWhatsApp(accessToken));
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  const e = (field: keyof PaymentSettings) => (showErrors ? errors[field] : undefined);
  const token = view?.whatsappAccessToken;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3 border-b border-[#d6ccb6] pb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#f1ead9] text-[#26221d]">
          <Wallet size={22} />
        </div>

        <div>
          <h1 className="text-[#2a2520]">Payments &amp; WhatsApp</h1>

          <p className="mt-1 text-sm text-[#5f584d]">
            Enter your payment, invoice and WhatsApp details here. Changes apply to new
            bills and invoices immediately. Leave a field blank to use the server default.
          </p>
        </div>
      </div>

      {!values || !view ? (
        <p className={`text-sm ${failed ? "text-[#b3261e]" : "text-[#5f584d]"}`}>
          {failed ? "Unable to load payment settings." : "Loading…"}
        </p>
      ) : (
        <>
          <Section
            eyebrow="Bank / UPI"
            title="Where customers pay"
            description="Shown on the WhatsApp bill and encoded in the UPI QR code on the invoice PDF."
            badge={
              <Badge
                ok={view.status.upiConfigured}
                yes="UPI ready"
                no="UPI ID missing"
              />
            }
          >
            <Field label="UPI ID" hint="e.g. aayeshafashion@okhdfcbank" error={e("upiId")}>
              <input className={inputClass} placeholder="name@bank" {...text("upiId")} />
            </Field>

            <div className="sm:col-span-2">
              <Field
                label="Bank account details"
                hint="Printed on the WhatsApp bill, e.g. A/C Name, A/C No, IFSC, Bank."
              >
                <textarea
                  rows={3}
                  maxLength={500}
                  className={`${inputClass} h-auto py-2.5`}
                  placeholder={"A/C Name: …\nA/C No: …\nIFSC: …"}
                  {...text("bankDetails")}
                />
              </Field>
            </div>
          </Section>

          <Section
            eyebrow="Invoice"
            title="Business details on the invoice"
            description="Appear on every invoice PDF sent to customers."
          >
            <Field label="Store name" error={e("storeName")}>
              <input className={inputClass} {...text("storeName")} />
            </Field>

            <Field label="Phone" error={e("storePhone")}>
              <input className={inputClass} inputMode="tel" placeholder="+91 …" {...text("storePhone")} />
            </Field>

            <Field label="Email" error={e("storeEmail")}>
              <input className={inputClass} type="email" {...text("storeEmail")} />
            </Field>

            <Field label="GSTIN (optional)" hint="15 characters" error={e("storeGstin")}>
              <input className={inputClass} maxLength={15} {...text("storeGstin")} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Address">
                <textarea
                  rows={2}
                  maxLength={300}
                  className={`${inputClass} h-auto py-2.5`}
                  {...text("storeAddress")}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Footer note (optional)" hint="e.g. Returns accepted within 7 days.">
                <input className={inputClass} maxLength={240} {...text("invoiceNote")} />
              </Field>
            </div>
          </Section>

          <Section
            eyebrow="Timing"
            title="Payment windows"
            description={`Unpaid orders are cancelled after ${view.paymentWindowMinutes} minutes. If a customer reports having paid, the order is held longer so you can verify it.`}
          >
            <Field
              label="Hold after customer reports payment (minutes)"
              hint="30 to 1440. Default 180."
              error={e("claimHoldMinutes")}
            >
              <input
                className={inputClass}
                type="number"
                min={30}
                max={1440}
                value={values.claimHoldMinutes}
                onChange={(event) => set("claimHoldMinutes", Number(event.target.value))}
              />
            </Field>

            <Field
              label="Invoice resend cooldown (seconds)"
              hint="Minimum gap between two invoice messages for the same order."
              error={e("invoiceCooldownSeconds")}
            >
              <input
                className={inputClass}
                type="number"
                min={0}
                max={3600}
                value={values.invoiceCooldownSeconds}
                onChange={(event) => set("invoiceCooldownSeconds", Number(event.target.value))}
              />
            </Field>
          </Section>

          <Section
            eyebrow="WhatsApp"
            title="WhatsApp Business connection"
            description="Used to send bills and invoices. Get these from Meta: Business Manager → WhatsApp → API setup."
            badge={
              <Badge
                ok={view.status.whatsappCredentialsConfigured}
                yes="Credentials saved"
                no="Credentials missing"
              />
            }
          >
            <Field
              label="Phone number ID"
              hint="Digits only (not the phone number itself)."
              error={e("whatsappPhoneNumberId")}
            >
              <input
                className={inputClass}
                inputMode="numeric"
                placeholder="e.g. 123456789012345"
                {...text("whatsappPhoneNumberId")}
              />
            </Field>

            <Field
              label="Permanent access token"
              hint={
                removeToken
                  ? "The saved token will be removed when you save."
                  : token?.set
                    ? `Saved ${token.hint} (${token.source === "env" ? "from server settings" : "saved here"}). Type a new one to replace it. It is never shown again.`
                    : "Paste a permanent system-user token. It is stored encrypted."
              }
            >
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  type={showToken ? "text" : "password"}
                  autoComplete="off"
                  placeholder={token?.set ? "Leave blank to keep the saved token" : "EAAG…"}
                  value={tokenInput}
                  onChange={(event) => {
                    setTokenInput(event.target.value);
                    setRemoveToken(false);
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowToken((value) => !value)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[#d6ccb6] bg-white text-[#5f584d] hover:text-[#2a2520]"
                  aria-label={showToken ? "Hide token" : "Show token"}
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {token?.set && token.source === "admin" && !tokenInput ? (
                <button
                  type="button"
                  onClick={() => setRemoveToken((value) => !value)}
                  className="mt-2 text-xs font-semibold text-[#b3261e] hover:underline"
                >
                  {removeToken ? "Keep the saved token" : "Remove saved token"}
                </button>
              ) : null}
            </Field>

            <Field
              label="Invoice template name"
              hint="Approved template for paid invoices. Header: Document. Body variables: {{1}} name, {{2}} order number, {{3}} amount."
              error={e("whatsappInvoiceTemplate")}
            >
              <input className={inputClass} placeholder="e.g. order_invoice" {...text("whatsappInvoiceTemplate")} />
            </Field>

            <Field
              label="Payment bill template name"
              hint="Approved template for the pay-now bill (same layout)."
              error={e("whatsappBillTemplate")}
            >
              <input className={inputClass} placeholder="e.g. payment_bill" {...text("whatsappBillTemplate")} />
            </Field>

            <Field label="Template language" error={e("whatsappTemplateLanguage")}>
              <input className={inputClass} placeholder="en" {...text("whatsappTemplateLanguage")} />
            </Field>

            <Field label="API version" error={e("whatsappApiVersion")}>
              <input className={inputClass} placeholder="v23.0" {...text("whatsappApiVersion")} />
            </Field>

            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center gap-3 border border-[#e6dfcf] bg-[#f7f2e7] p-4">
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying || dirty || !view.status.whatsappCredentialsConfigured}
                  className="inline-flex h-10 items-center gap-2 border border-[#26221d] bg-white px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#26221d] hover:bg-[#f1ead9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {verifying ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  Verify connection
                </button>

                <p className="text-xs leading-5 text-[#5f584d]">
                  {dirty
                    ? "Save your changes first, then verify."
                    : "Checks the saved token and number with Meta. No message is sent."}
                </p>

                {verified ? (
                  <p className="w-full text-sm font-medium text-[#276541]">
                    Connected: {verified.verifiedName || "Business"} · {verified.displayPhoneNumber}
                    {verified.qualityRating ? ` · quality ${verified.qualityRating}` : ""}
                  </p>
                ) : null}

                {verifyError ? (
                  <p className="w-full text-sm font-medium text-[#b3261e]">{verifyError}</p>
                ) : null}
              </div>

              {!view.status.invoiceTemplateSet || !view.status.billTemplateSet ? (
                <p className="mt-3 border border-[#f6d08a] bg-[#fdf3e1] p-3 text-xs leading-5 text-[#7f4806]">
                  Without approved template names, WhatsApp only delivers to customers who
                  messaged your business in the last 24 hours. Create the templates in Meta
                  Business Manager, wait for approval, then enter their names above.
                </p>
              ) : null}
            </div>
          </Section>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d6ccb6] bg-white/95 px-4 py-3 backdrop-blur lg:left-[250px]">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 lg:px-4">
              <p className={`text-sm ${dirty ? "font-semibold text-[#a15c07]" : "text-[#5f584d]"}`}>
                {dirty ? "You have unsaved changes." : "All changes saved."}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={() => {
                    setValues(view.settings);
                    setTokenInput("");
                    setRemoveToken(false);
                    setShowErrors(false);
                  }}
                  className="h-10 border border-[#d6ccb6] bg-white px-4 text-sm font-semibold text-[#2a2520] hover:bg-[#f7f2e7] disabled:opacity-50"
                >
                  Discard
                </button>

                <button
                  type="button"
                  disabled={!dirty || saving}
                  onClick={handleSave}
                  className="inline-flex h-10 items-center gap-2 bg-[#26221d] px-5 text-sm font-semibold text-white hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
