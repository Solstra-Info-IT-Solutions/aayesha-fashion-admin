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
          ? "border-[#2c4a33] bg-[#1a2419]"
          : "border-[#2e2a26] bg-[#111111]"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-[#3a352f]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            checked ? "bg-[#1a1816]" : "bg-[#211e1b]"
          }`}
        >
          {checked ? (
            <Globe2 className="h-4 w-4 text-[#8fb08a]" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-[#9a9185]" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#f8f3f1]">
            {checked ? "Public setting" : "Private setting"}
          </p>

          <p className="mt-0.5 text-xs text-[#9a9185]">
            {checked
              ? "This setting can be accessed by public-facing APIs."
              : "This setting is available only to authorized admin users."}
          </p>
        </div>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#8fb08a]" : "bg-[#3a352f]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#1a1816] shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}