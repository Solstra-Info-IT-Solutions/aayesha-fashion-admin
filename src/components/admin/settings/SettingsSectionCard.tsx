"use client";

import Link from "next/link";
import { Edit3, Settings2 } from "lucide-react";
import type { StoreSetting } from "@/types/settings";

type SettingsSectionCardProps = {
  group: string;
  settings: StoreSetting[];
};

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }

  return String(value);
}

export default function SettingsSectionCard({
  group,
  settings,
}: SettingsSectionCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
            <Settings2 className="h-4 w-4 text-gray-500" />
          </div>

          <div>
            <h3 className="font-semibold capitalize text-gray-900">
              {group}
            </h3>

            <p className="text-xs text-gray-400">
              {settings.length}{" "}
              {settings.length === 1 ? "setting" : "settings"}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="break-all text-sm font-medium text-gray-800">
                {setting.key}
              </p>

              <p className="mt-1 truncate text-sm text-gray-500">
                {formatValue(setting.value)}
              </p>
            </div>

            <Link
              href={`/admin/settings/${encodeURIComponent(setting.key)}`}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}