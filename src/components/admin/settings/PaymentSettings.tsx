"use client";

import {
  CreditCard,
  Info,
} from "lucide-react";

import type {
  SettingValue,
} from "@/types/settings";

type PaymentSettingsProps = {
  value: SettingValue;
  onChange: (
    value: SettingValue,
  ) => void;
};

export default function PaymentSettings({
  value,
  onChange,
}: PaymentSettingsProps) {
  const currentValue =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const currency =
    typeof currentValue.currency === "string"
      ? currentValue.currency
      : "INR";

  const codEnabled =
    typeof currentValue.codEnabled === "boolean"
      ? currentValue.codEnabled
      : true;

  const onlinePaymentEnabled =
    typeof currentValue.onlinePaymentEnabled ===
    "boolean"
      ? currentValue.onlinePaymentEnabled
      : true;

  const updateField = (
    field: string,
    fieldValue: string | boolean,
  ) => {
    onChange({
      ...currentValue,
      [field]: fieldValue,
    });
  };

  return (
    <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
      <div className="border-b border-[#2e2a26] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2a241b]">
            <CreditCard className="h-4 w-4 text-[#d9c7a3]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#f8f3f1]">
              Payment Settings
            </h2>

            <p className="mt-1 text-sm text-[#9a9185]">
              Configure available payment options.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Currency */}
        <div>
          <label
            htmlFor="payment-currency"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Currency
          </label>

          <input
            id="payment-currency"
            type="text"
            value={currency}
            onChange={(event) =>
              updateField(
                "currency",
                event.target.value.toUpperCase(),
              )
            }
            placeholder="INR"
            className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm uppercase text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
          />
        </div>

        {/* COD */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#2e2a26] p-4">
          <div>
            <p className="text-sm font-medium text-[#f8f3f1]">
              Cash on Delivery
            </p>

            <p className="mt-1 text-xs text-[#9a9185]">
              Allow customers to place orders using COD.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "codEnabled",
                !codEnabled,
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              codEnabled
                ? "bg-[#b79a6a]"
                : "bg-[#3a352f]"
            }`}
            aria-label={
              codEnabled
                ? "Disable cash on delivery"
                : "Enable cash on delivery"
            }
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#1a1816] shadow-sm transition ${
                codEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Online payment */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#2e2a26] p-4">
          <div>
            <p className="text-sm font-medium text-[#f8f3f1]">
              Online Payments
            </p>

            <p className="mt-1 text-xs text-[#9a9185]">
              Allow customers to pay online.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "onlinePaymentEnabled",
                !onlinePaymentEnabled,
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              onlinePaymentEnabled
                ? "bg-[#b79a6a]"
                : "bg-[#3a352f]"
            }`}
            aria-label={
              onlinePaymentEnabled
                ? "Disable online payments"
                : "Enable online payments"
            }
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#1a1816] shadow-sm transition ${
                onlinePaymentEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-3 rounded-[14px] border border-[#2c4658] bg-[#16222b] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8fbfdc]" />

          <p className="text-xs leading-5 text-[#8fbfdc]">
            Payment gateway credentials should not be stored in public
            settings. Keep sensitive credentials private and manage them
            through the appropriate secure environment configuration.
          </p>
        </div>
      </div>
    </section>
  );
}