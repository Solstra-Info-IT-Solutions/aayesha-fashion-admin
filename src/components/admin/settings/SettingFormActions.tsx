"use client";

import Link from "next/link";
import { Loader2, Save } from "lucide-react";

type SettingFormActionsProps = {
  saving?: boolean;
  disabled?: boolean;
  cancelHref?: string;
  saveLabel?: string;
};

export default function SettingFormActions({
  saving = false,
  disabled = false,
  cancelHref = "/admin/settings",
  saveLabel = "Save Setting",
}: SettingFormActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-[#2e2a26] pt-5 sm:flex-row sm:items-center sm:justify-end">
      <Link
        href={cancelHref}
        className="inline-flex h-11 items-center justify-center rounded-[14px] border border-[#2e2a26] px-5 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#111111]"
      >
        Cancel
      </Link>

      <button
        type="submit"
        disabled={saving || disabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#b79a6a] px-5 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}

        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  );
}