"use client";

import Link from "next/link";
import { Settings2, Plus } from "lucide-react";

type SettingsEmptyStateProps = {
  filtered?: boolean;
};

export default function SettingsEmptyState({
  filtered = false,
}: SettingsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <Settings2 className="h-7 w-7 text-gray-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        {filtered ? "No settings found" : "No settings yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {filtered
          ? "There are no settings matching the selected group."
          : "Create your first store setting to start managing your configuration."}
      </p>

      {!filtered && (
        <Link
          href="/admin/settings/create"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#000000] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#881337]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      )}
    </div>
  );
}