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
    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
      <Link
        href={cancelHref}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Cancel
      </Link>

      <button
        type="submit"
        disabled={saving || disabled}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#9f1239] px-5 text-sm font-medium text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-60"
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