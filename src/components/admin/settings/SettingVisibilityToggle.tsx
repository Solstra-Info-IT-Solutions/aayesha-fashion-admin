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
      className={`flex w-full items-center justify-between rounded-[14px] border p-4 text-left transition ${
        checked
          ? "border-[#bfe3cb] bg-[#e8f5ec]"
          : "border-[#e6dfcf] bg-[#f7f2e7]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-[#d6ccb6]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            checked ? "bg-[#fffdf8]" : "bg-[#efe8d8]"
          }`}
        >
          {checked ? (
            <Globe2 className="h-4 w-4 text-[#276541]" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-[#756d62]" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#2a2520]">
            {checked ? "Public setting" : "Private setting"}
          </p>

          <p className="mt-0.5 text-xs text-[#756d62]">
            {checked
              ? "This setting can be accessed by public-facing APIs."
              : "This setting is available only to authorized admin users."}
          </p>
        </div>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#276541]" : "bg-[#d6ccb6]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#fffdf8] shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}