"use client";

import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Settings,
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
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin"
            className="transition hover:text-slate-900"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-slate-700">
            Settings
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
            <Settings className="h-5 w-5 text-rose-700" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
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
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#000000] px-4 text-sm font-medium text-white transition hover:bg-[#881337]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      </div>
    </div>
  );
}