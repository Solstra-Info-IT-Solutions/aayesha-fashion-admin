"use client";

import Link from "next/link";
import { Edit3, Globe, Lock, Trash2 } from "lucide-react";
import type { StoreSetting } from "@/types/settings";

type SettingRowProps = {
  setting: StoreSetting;
  deleting?: boolean;
  updatingPublic?: boolean;
  onTogglePublic: (setting: StoreSetting) => void;
  onDelete: (setting: StoreSetting) => void;
};

export default function SettingRow({
  setting,
  deleting = false,
  updatingPublic = false,
  onTogglePublic,
  onDelete,
}: SettingRowProps) {
  const displayValue =
    typeof setting.value === "object" && setting.value !== null
      ? JSON.stringify(setting.value)
      : String(setting.value ?? "");

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70">
      <td className="px-5 py-4">
        <div className="font-medium text-gray-900">{setting.key}</div>
        <div className="mt-1 text-xs text-gray-400">
          Updated {new Date(setting.updatedAt).toLocaleDateString()}
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
          {setting.group}
        </span>
      </td>

      <td className="max-w-md px-5 py-4">
        <div
          className="truncate text-sm text-gray-600"
          title={displayValue}
        >
          {displayValue || "—"}
        </div>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onTogglePublic(setting)}
          disabled={updatingPublic}
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {setting.isPublic ? (
            <>
              <Globe className="h-3.5 w-3.5" />
              Public
            </>
          ) : (
            <>
              <Lock className="h-3.5 w-3.5" />
              Private
            </>
          )}
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/settings/${encodeURIComponent(setting.key)}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            title="Edit setting"
          >
            <Edit3 className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(setting)}
            disabled={deleting}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete setting"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}