"use client";

import {
  Info,
  Truck,
} from "lucide-react";

import type {
  SettingValue,
} from "@/types/settings";

type ShippingSettingsProps = {
  value: SettingValue;
  onChange: (
    value: SettingValue,
  ) => void;
};

export default function ShippingSettings({
  value,
  onChange,
}: ShippingSettingsProps) {
  const currentValue =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const shippingEnabled =
    typeof currentValue.shippingEnabled ===
    "boolean"
      ? currentValue.shippingEnabled
      : true;

  const freeShippingEnabled =
    typeof currentValue.freeShippingEnabled ===
    "boolean"
      ? currentValue.freeShippingEnabled
      : false;

  const freeShippingThreshold =
    typeof currentValue.freeShippingThreshold ===
    "number"
      ? String(
          currentValue.freeShippingThreshold,
        )
      : "";

  const defaultShippingCharge =
    typeof currentValue.defaultShippingCharge ===
    "number"
      ? String(
          currentValue.defaultShippingCharge,
        )
      : "";

  const updateField = (
    field: string,
    fieldValue: string | boolean | number,
  ) => {
    onChange({
      ...currentValue,
      [field]: fieldValue,
    });
  };

  const parseNumber = (
    value: string,
  ) => {
    if (value.trim() === "") {
      return 0;
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  };

  return (
    <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
      <div className="border-b border-[#e6dfcf] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1ead9]">
            <Truck className="h-4 w-4 text-[#6f542f]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#2a2520]">
              Shipping Settings
            </h2>

            <p className="mt-1 text-sm text-[#756d62]">
              Configure shipping availability and charges.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Shipping enabled */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#e6dfcf] p-4">
          <div>
            <p className="text-sm font-medium text-[#2a2520]">
              Shipping Enabled
            </p>

            <p className="mt-1 text-xs text-[#756d62]">
              Allow shipping for customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "shippingEnabled",
                !shippingEnabled,
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              shippingEnabled
                ? "bg-[#26221d]"
                : "bg-[#d6ccb6]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#fffdf8] shadow-sm transition ${
                shippingEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Default shipping charge */}
        <div>
          <label
            htmlFor="default-shipping-charge"
            className="mb-1.5 block text-sm font-medium text-[#3d372f]"
          >
            Default Shipping Charge
          </label>

          <input
            id="default-shipping-charge"
            type="number"
            min="0"
            step="0.01"
            value={defaultShippingCharge}
            onChange={(event) =>
              updateField(
                "defaultShippingCharge",
                parseNumber(
                  event.target.value,
                ),
              )
            }
            placeholder="0"
            className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
          />
        </div>

        {/* Free shipping */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#e6dfcf] p-4">
          <div>
            <p className="text-sm font-medium text-[#2a2520]">
              Free Shipping
            </p>

            <p className="mt-1 text-xs text-[#756d62]">
              Enable free shipping above a minimum order value.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateField(
                "freeShippingEnabled",
                !freeShippingEnabled,
              )
            }
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              freeShippingEnabled
                ? "bg-[#26221d]"
                : "bg-[#d6ccb6]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-[#fffdf8] shadow-sm transition ${
                freeShippingEnabled
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Free shipping threshold */}
        <div>
          <label
            htmlFor="free-shipping-threshold"
            className="mb-1.5 block text-sm font-medium text-[#3d372f]"
          >
            Free Shipping Threshold
          </label>

          <input
            id="free-shipping-threshold"
            type="number"
            min="0"
            step="0.01"
            value={freeShippingThreshold}
            onChange={(event) =>
              updateField(
                "freeShippingThreshold",
                parseNumber(
                  event.target.value,
                ),
              )
            }
            placeholder="0"
            disabled={!freeShippingEnabled}
            className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf] disabled:cursor-not-allowed disabled:bg-[#f7f2e7] disabled:text-[#756d62]"
          />
        </div>

        <div className="flex gap-3 rounded-[14px] border border-[#c7dcea] bg-[#e6f0f7] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1f5f86]" />

          <p className="text-xs leading-5 text-[#1f5f86]">
            Shipping values are stored inside the setting value as a JSON
            object. Actual shipping calculation rules should remain aligned
            with the backend order/shipping logic.
          </p>
        </div>
      </div>
    </section>
  );
}