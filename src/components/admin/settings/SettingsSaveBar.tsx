"use client";

import { Save } from "lucide-react";

type SettingsSaveBarProps = {
  saving?: boolean;
  disabled?: boolean;
  onSave: () => void | Promise<void>;
};

export default function SettingsSaveBar({
  saving = false,
  disabled = false,
  onSave,
}: SettingsSaveBarProps) {
  return (
    <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Save your changes before leaving this page.
        </p>

        <button
          type="button"
          onClick={onSave}
          disabled={saving || disabled}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#9f1239] px-5 text-sm font-medium text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save
            className={`h-4 w-4 ${
              saving ? "animate-pulse" : ""
            }`}
          />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}