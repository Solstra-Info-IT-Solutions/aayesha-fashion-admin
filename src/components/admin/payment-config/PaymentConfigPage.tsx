"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, Wallet } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  getPaymentConfig,
  type PaymentConfig,
} from "@/services/payment-config.service";

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
        ok ? "text-emerald-700" : "text-amber-700"
      }`}
    >
      {ok ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}
      {label}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] py-3 last:border-0">
      <dt className="text-sm text-[var(--color-secondary)]">{label}</dt>
      <dd className="text-right text-sm text-[var(--color-ink)]">{children}</dd>
    </div>
  );
}

export default function PaymentConfigPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [data, setData] = useState<PaymentConfig | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    getPaymentConfig(accessToken)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(true);
        toast.error(
          error instanceof Error ? error.message : "Unable to load payment settings.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const wa = data?.whatsapp;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#7a5650]">
          <Wallet size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            Payments &amp; WhatsApp
          </h1>

          <p className="mt-1 text-sm text-[var(--color-secondary)]">
            Read-only status. Values are set as environment variables on the
            backend server — secrets are never shown here.
          </p>
        </div>
      </div>

      {data === null && !failed ? (
        <p className="text-sm text-[var(--color-secondary)]">Loading…</p>
      ) : failed || !data || !wa ? (
        <p className="text-sm text-red-600">Unable to load payment settings.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[#fbf9f5] p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              Order payment timing
            </h2>

            <dl className="mt-3">
              <Row label="Pay-within window">{data.paymentWindowMinutes} min</Row>
              <Row label="Hold after customer reports payment">
                {data.claimHoldMinutes} min
              </Row>
              <Row label="Invoice resend cooldown">
                {data.invoiceCooldownSeconds} sec
              </Row>
            </dl>

            <p className="mt-3 text-xs leading-5 text-[var(--color-secondary)]">
              Hold time: <code>PAYMENT_CLAIM_HOLD_MINUTES</code> · Cooldown:{" "}
              <code>INVOICE_RESEND_COOLDOWN_SECONDS</code>
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[#fbf9f5] p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              Payment methods
            </h2>

            <dl className="mt-3">
              <Row label="UPI ID (STORE_UPI_ID)">
                <Status ok={data.upiConfigured} label={data.upiConfigured ? "Set" : "Missing"} />
              </Row>
              <Row label="Bank details (STORE_BANK_DETAILS)">
                <Status
                  ok={data.bankDetailsConfigured}
                  label={data.bankDetailsConfigured ? "Set" : "Missing"}
                />
              </Row>
              <Row label="Razorpay keys">
                <Status
                  ok={data.razorpayConfigured}
                  label={data.razorpayConfigured ? "Configured" : "Not configured"}
                />
              </Row>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[#fbf9f5] p-5 shadow-sm sm:p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--color-ink)]">
              WhatsApp invoices &amp; bills
            </h2>

            <dl className="mt-3">
              <Row label="Credentials (token + phone number ID)">
                <Status
                  ok={wa.credentialsConfigured}
                  label={wa.credentialsConfigured ? "Configured" : "Missing"}
                />
              </Row>
              <Row label="Invoice template (WHATSAPP_INVOICE_TEMPLATE_NAME)">
                <Status ok={Boolean(wa.invoiceTemplate)} label={wa.invoiceTemplate || "Not set"} />
              </Row>
              <Row label="Bill template (WHATSAPP_BILL_TEMPLATE_NAME)">
                <Status ok={Boolean(wa.billTemplate)} label={wa.billTemplate || "Not set"} />
              </Row>
              <Row label="Template language">{wa.templateLanguage}</Row>
              <Row label="API version">{wa.apiVersion}</Row>
            </dl>

            {!wa.invoiceTemplate || !wa.billTemplate ? (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                Without an approved template, WhatsApp only delivers to
                customers who messaged you in the last 24 hours. Create the
                templates in Meta Business Manager (header: Document; body
                variables: {"{{1}}"} name, {"{{2}}"} order number, {"{{3}}"} amount)
                and set the template names on the backend.
              </p>
            ) : null}
          </section>
        </div>
      )}
    </div>
  );
}
