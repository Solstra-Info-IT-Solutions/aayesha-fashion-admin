"use client";

import SettingFormField from "./SettingFormField";

type SettingKeyFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

export default function SettingKeyField({
  value,
  onChange,
  disabled = false,
  error,
}: SettingKeyFieldProps) {
  return (
    <SettingFormField
      label="Setting Key"
      description="Use letters, numbers, dots, underscores and hyphens only."
      required
      error={error}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="e.g. store.name"
        maxLength={150}
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-[14px] border border-[#2e2a26] bg-[#1a1816] px-3.5 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10 disabled:cursor-not-allowed disabled:bg-[#111111]"
      />

      <p className="text-right text-xs text-[#9a9185]">
        {value.length}/150
      </p>
    </SettingFormField>
  );
}