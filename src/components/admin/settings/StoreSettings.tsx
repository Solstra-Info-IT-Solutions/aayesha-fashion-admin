"use client";

import {
  Building2,
  Info,
} from "lucide-react";

import type {
  SettingValue,
} from "@/types/settings";

type StoreSettingsProps = {
  value: SettingValue;
  onChange: (
    value: SettingValue,
  ) => void;
};

export default function StoreSettings({
  value,
  onChange,
}: StoreSettingsProps) {
  const currentValue =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const storeName =
    typeof currentValue.storeName ===
    "string"
      ? currentValue.storeName
      : "";

  const storeDescription =
    typeof currentValue.storeDescription ===
    "string"
      ? currentValue.storeDescription
      : "";

  const websiteUrl =
    typeof currentValue.websiteUrl ===
    "string"
      ? currentValue.websiteUrl
      : "";

  const updateField = (
    field: string,
    fieldValue: string,
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
            <Building2 className="h-4 w-4 text-[#d9c7a3]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#f8f3f1]">
              Store Settings
            </h2>

            <p className="mt-1 text-sm text-[#9a9185]">
              Store identity and basic website information.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Store name */}
        <div>
          <label
            htmlFor="store-name"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Store Name
          </label>

          <input
            id="store-name"
            type="text"
            value={storeName}
            onChange={(event) =>
              updateField(
                "storeName",
                event.target.value,
              )
            }
            placeholder="Aayesha Fashion"
            className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="store-description"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Store Description
          </label>

          <textarea
            id="store-description"
            value={storeDescription}
            onChange={(event) =>
              updateField(
                "storeDescription",
                event.target.value,
              )
            }
            rows={5}
            placeholder="Enter a short description of your store..."
            className="w-full resize-y rounded-lg border border-[#2e2a26] px-3 py-3 text-sm leading-6 text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
          />
        </div>

        {/* Website */}
        <div>
          <label
            htmlFor="store-website"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Website URL
          </label>

          <input
            id="store-website"
            type="url"
            value={websiteUrl}
            onChange={(event) =>
              updateField(
                "websiteUrl",
                event.target.value,
              )
            }
            placeholder="https://example.com"
            className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
          />
        </div>

        {/* Information */}
        <div className="flex gap-3 rounded-[14px] border border-[#2c4658] bg-[#16222b] p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8fbfdc]" />

          <p className="text-xs leading-5 text-[#8fbfdc]">
            These fields are stored inside the setting&apos;s value as a
            JSON object. The exact setting key and group are controlled by
            the parent settings form.
          </p>
        </div>
      </div>
    </section>
  );
}