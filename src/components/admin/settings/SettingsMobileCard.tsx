"use client";

import Link from "next/link";
import { Edit3, Globe, Lock, Trash2 } from "lucide-react";
import type { StoreSetting } from "@/types/settings";

type SettingsMobileCardProps = {
  setting: StoreSetting;
  deleting?: boolean;
  updatingPublic?: boolean;
  onTogglePublic: (setting: StoreSetting) => void;
  onDelete: (setting: StoreSetting) => void;
};

export default function SettingsMobileCard({
  setting,
  deleting = false,
  updatingPublic = false,
  onTogglePublic,
  onDelete,
}: SettingsMobileCardProps) {
  const displayValue =
    typeof setting.value === "object" && setting.value !== null
      ? JSON.stringify(setting.value)
      : String(setting.value ?? "");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-all font-semibold text-gray-900">
            {setting.key}
          </h3>

          <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
            {setting.group}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onTogglePublic(setting)}
          disabled={updatingPublic}
          className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-50"
        >
          {setting.isPublic ? (
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Public
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              Private
            </span>
          )}
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          Value
        </p>

        <p className="break-all text-sm text-gray-700">
          {displayValue || "—"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-gray-400">
          Updated {new Date(setting.updatedAt).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/settings/${encodeURIComponent(setting.key)}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(setting)}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            title="Delete setting"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}