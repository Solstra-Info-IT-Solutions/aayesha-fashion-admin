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
        <label className="block text-sm font-medium text-gray-800">
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>

        {description && (
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}