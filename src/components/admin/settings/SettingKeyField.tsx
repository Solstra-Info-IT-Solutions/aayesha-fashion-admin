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
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
      />

      <p className="text-right text-xs text-gray-400">
        {value.length}/150
      </p>
    </SettingFormField>
  );
}