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
    <div className="rounded-[14px] border border-dashed border-[#3a352f] bg-[#1a1816] px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#211e1b]">
        <Settings2 className="h-7 w-7 text-[#9a9185]" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#f8f3f1]">
        {filtered ? "No settings found" : "No settings yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9a9185]">
        {filtered
          ? "There are no settings matching the selected group."
          : "Create your first store setting to start managing your configuration."}
      </p>

      {!filtered && (
        <Link
          href="/admin/settings/create"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#b79a6a] px-4 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      )}
    </div>
  );
}