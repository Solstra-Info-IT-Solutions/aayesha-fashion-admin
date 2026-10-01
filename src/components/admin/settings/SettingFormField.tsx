"use client";

import type { ReactNode } from "react";

type SettingFormFieldProps = {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export default function SettingFormField({
  label,
  description,
  required = false,
  error,
  children,
}: SettingFormFieldProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-[#2a2520]">
          {label}
          {required && (
            <span className="ml-1 text-[#b3261e]">*</span>
          )}
        </label>

        {description && (
          <p className="mt-1 text-xs leading-5 text-[#756d62]">
            {description}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}