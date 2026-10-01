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
    <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
      <div className="border-b border-[#e6dfcf] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1ead9]">
            <CreditCard className="h-4 w-4 text-[#6f542f]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#2a2520]">
              Payment Settings
            </h2>

            <p className="mt-1 text-sm text-[#756d62]">
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
            className="mb-1.5 block text-sm font-medium text-[#3d372f]"
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
            className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm uppercase text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
          />
        </div>

        {/* COD */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#e6dfcf] p-4">
          <div>
            <p className="text-sm font-medium text-[#2a2520]">
              Cash on Delivery
            </p>

            <p className="mt-1 text-xs text-[#756d62]">
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
                ? "bg-[#26221d]"
                : "bg-[#d6ccb6]"
            }`}
            aria-label={
              codEnabled
                ? "Disable cash on delivery"
                : "Enable cash on delivery"
            }
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#fffdf8] shadow-sm transition ${
                codEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Online payment */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#e6dfcf] p-4">
          <div>
            <p className="text-sm font-medium text-[#2a2520]">
              Online Payments
            </p>

            <p className="mt-1 text-xs text-[#756d62]">
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
                ? "bg-[#26221d]"
                : "bg-[#d6ccb6]"
            }`}
            aria-label={
              onlinePaymentEnabled
                ? "Disable online payments"
                : "Enable online payments"
            }
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#fffdf8] shadow-sm transition ${
                onlinePaymentEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-3 rounded-[14px] border border-[#c7dcea] bg-[#e6f0f7] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86]" />

          <p className="text-xs leading-5 text-[#1f5f86]">
            Payment gateway credentials should not be stored in public
            settings. Keep sensitive credentials private and manage them
            through the appropriate secure environment configuration.
          </p>
        </div>
      </div>
    </section>
  );
}