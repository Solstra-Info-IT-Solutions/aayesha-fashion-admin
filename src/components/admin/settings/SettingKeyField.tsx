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
        className="h-11 w-full rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] px-3.5 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/10 disabled:cursor-not-allowed disabled:bg-[#f7f2e7]"
      />

      <p className="text-right text-xs text-[#756d62]">
        {value.length}/150
      </p>
    </SettingFormField>
  );
}