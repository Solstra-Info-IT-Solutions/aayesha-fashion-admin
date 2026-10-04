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
        className="h-11 w-full rounded-[14px] border border-[#2e2a26] bg-[#1a1816] px-3.5 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
      />

      <p className="text-right text-xs text-[#9a9185]">
        {value.length}/80
      </p>
    </SettingFormField>
  );
}