"use client";

import SettingFormField from "./SettingFormField";

type SettingGroupFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function SettingGroupField({
  value,
  onChange,
  error,
}: SettingGroupFieldProps) {
  return (
    <SettingFormField
      label="Setting Group"
      description="Use a group name to organize related settings."
      required
      error={error}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="e.g. general"
        maxLength={80}
        autoComplete="off"
        spellCheck={false}
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
      />

      <p className="text-right text-xs text-gray-400">
        {value.length}/80
      </p>
    </SettingFormField>
  );
}