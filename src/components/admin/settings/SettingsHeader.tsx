"use client";

import Link from "next/link";
import {
  Plus,
  RefreshCw,
} from "lucide-react";

type SettingsHeaderProps = {
  onRefresh: () => void | Promise<void>;
  refreshing?: boolean;
};

export default function SettingsHeader({
  onRefresh,
  refreshing = false,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 hidden items-center gap-2 text-sm text-[#756d62]">
          <Link
            href="/admin"
            className="transition hover:text-[#2a2520]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[#3d372f]">
            Settings
          </span>
        </div>

        <div className="flex items-center gap-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">Configuration</p>
            <h1 className="mt-1 text-[#2a2520]">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[#756d62]">
              Manage your store configuration
              and settings.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:bg-[#f1ead9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

        <Link
          href="/admin/settings/create"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#26221d] px-4 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#3d372f]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      </div>
    </div>
  );
}