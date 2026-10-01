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
        className="h-11 w-full rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] px-3.5 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/10"
      />

      <p className="text-right text-xs text-[#756d62]">
        {value.length}/80
      </p>
    </SettingFormField>
  );
}