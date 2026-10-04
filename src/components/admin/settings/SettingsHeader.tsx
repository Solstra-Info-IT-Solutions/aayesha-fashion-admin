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
        <div className="mb-2 hidden items-center gap-2 text-sm text-[#9a9185]">
          <Link
            href="/admin"
            className="transition hover:text-[#f8f3f1]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[#e6dfd4]">
            Settings
          </span>
        </div>

        <div className="flex items-center gap-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">Configuration</p>
            <h1 className="mt-1 text-[#f8f3f1]">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[#9a9185]">
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
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:bg-[#2a241b] disabled:cursor-not-allowed disabled:opacity-60"
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
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#b79a6a] px-4 text-sm font-semibold text-[#1a1816] transition hover:bg-[#c8ad7f]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      </div>
    </div>
  );
}