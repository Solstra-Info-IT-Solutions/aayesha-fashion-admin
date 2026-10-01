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
    <div className="rounded-[14px] border border-dashed border-[#d6ccb6] bg-[#fffdf8] px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#efe8d8]">
        <Settings2 className="h-7 w-7 text-[#756d62]" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#2a2520]">
        {filtered ? "No settings found" : "No settings yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#756d62]">
        {filtered
          ? "There are no settings matching the selected group."
          : "Create your first store setting to start managing your configuration."}
      </p>

      {!filtered && (
        <Link
          href="/admin/settings/create"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#26221d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d372f]"
        >
          <Plus className="h-4 w-4" />
          Add Setting
        </Link>
      )}
    </div>
  );
}