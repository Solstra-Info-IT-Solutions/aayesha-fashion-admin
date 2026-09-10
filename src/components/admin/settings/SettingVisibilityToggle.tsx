"use client";

import { Globe2, LockKeyhole } from "lucide-react";

type SettingVisibilityToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export default function SettingVisibilityToggle({
  checked,
  onChange,
  disabled = false,
}: SettingVisibilityToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
        checked
          ? "border-emerald-200 bg-emerald-50"
          : "border-gray-200 bg-gray-50"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            checked ? "bg-white" : "bg-gray-100"
          }`}
        >
          {checked ? (
            <Globe2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-gray-500" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">
            {checked ? "Public setting" : "Private setting"}
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            {checked
              ? "This setting can be accessed by public-facing APIs."
              : "This setting is available only to authorized admin users."}
          </p>
        </div>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}