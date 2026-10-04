"use client";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import type {
  SettingValue,
} from "@/types/settings";

type ContactSettingsProps = {
  value: SettingValue;
  onChange: (
    value: SettingValue,
  ) => void;
};

export default function ContactSettings({
  value,
  onChange,
}: ContactSettingsProps) {
  const currentValue =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const email =
    typeof currentValue.email === "string"
      ? currentValue.email
      : "";

  const phone =
    typeof currentValue.phone === "string"
      ? currentValue.phone
      : "";

  const address =
    typeof currentValue.address === "string"
      ? currentValue.address
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
        <h2 className="text-base font-semibold text-[#f8f3f1]">
          Contact Settings
        </h2>

        <p className="mt-1 text-sm text-[#9a9185]">
          Manage the store contact information.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />

            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value,
                )
              }
              placeholder="support@example.com"
              className="h-11 w-full rounded-lg border border-[#2e2a26] pl-10 pr-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Phone Number
          </label>

          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />

            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="+91 00000 00000"
              className="h-11 w-full rounded-lg border border-[#2e2a26] pl-10 pr-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-address"
            className="mb-1.5 block text-sm font-medium text-[#e6dfd4]"
          >
            Address
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-[#9a9185]" />

            <textarea
              id="contact-address"
              value={address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Enter store address..."
              className="w-full resize-y rounded-lg border border-[#2e2a26] py-3 pl-10 pr-3 text-sm leading-6 text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}