"use client";

import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

import type {
  SettingValue,
} from "@/types/settings";

type NotificationSettingsProps = {
  value: SettingValue;
  onChange: (
    value: SettingValue,
  ) => void;
};

export default function NotificationSettings({
  value,
  onChange,
}: NotificationSettingsProps) {
  const currentValue =
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const emailEnabled =
    typeof currentValue.emailEnabled ===
    "boolean"
      ? currentValue.emailEnabled
      : true;

  const smsEnabled =
    typeof currentValue.smsEnabled ===
    "boolean"
      ? currentValue.smsEnabled
      : false;

  const whatsappEnabled =
    typeof currentValue.whatsappEnabled ===
    "boolean"
      ? currentValue.whatsappEnabled
      : false;

  const orderNotificationsEnabled =
    typeof currentValue.orderNotificationsEnabled ===
    "boolean"
      ? currentValue.orderNotificationsEnabled
      : true;

  const updateField = (
    field: string,
    fieldValue: boolean,
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
            <Bell className="h-4 w-4 text-[#6f542f]" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#2a2520]">
              Notification Settings
            </h2>

            <p className="mt-1 text-sm text-[#756d62]">
              Configure customer notification channels.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[#efe8d8]">
        <NotificationRow
          icon={
            <Mail className="h-4 w-4" />
          }
          title="Email Notifications"
          description="Send customer notifications through email."
          enabled={emailEnabled}
          onChange={(enabled) =>
            updateField(
              "emailEnabled",
              enabled,
            )
          }
        />

        <NotificationRow
          icon={
            <Smartphone className="h-4 w-4" />
          }
          title="SMS Notifications"
          description="Send customer notifications through SMS."
          enabled={smsEnabled}
          onChange={(enabled) =>
            updateField(
              "smsEnabled",
              enabled,
            )
          }
        />

        <NotificationRow
          icon={
            <MessageSquare className="h-4 w-4" />
          }
          title="WhatsApp Notifications"
          description="Send customer notifications through WhatsApp."
          enabled={whatsappEnabled}
          onChange={(enabled) =>
            updateField(
              "whatsappEnabled",
              enabled,
            )
          }
        />

        <NotificationRow
          icon={
            <Bell className="h-4 w-4" />
          }
          title="Order Notifications"
          description="Enable notifications related to customer orders."
          enabled={
            orderNotificationsEnabled
          }
          onChange={(enabled) =>
            updateField(
              "orderNotificationsEnabled",
              enabled,
            )
          }
        />
      </div>
    </section>
  );
}

type NotificationRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (
    enabled: boolean,
  ) => void;
};

function NotificationRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: NotificationRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f7f2e7] text-[#756d62]">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-[#2a2520]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#756d62]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          enabled
            ? "bg-[#26221d]"
            : "bg-[#d6ccb6]"
        }`}
        aria-label={
          enabled
            ? `Disable ${title}`
            : `Enable ${title}`
        }
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-[#fffdf8] shadow-sm transition ${
            enabled
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}