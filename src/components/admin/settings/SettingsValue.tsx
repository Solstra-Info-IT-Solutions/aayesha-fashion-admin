"use client";

import { Braces } from "lucide-react";

type SettingsValueProps = {
  value: unknown;
  truncate?: boolean;
};

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Object]";
    }
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value);
}

export default function SettingsValue({
  value,
  truncate = true,
}: SettingsValueProps) {
  const formattedValue = formatValue(value);

  if (typeof value === "object" && value !== null) {
    return (
      <div
        className={`flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600 ${
          truncate ? "max-w-md" : ""
        }`}
        title={formattedValue}
      >
        <Braces className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

        <span className={truncate ? "truncate" : "break-all"}>
          {formattedValue}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`text-sm text-gray-600 ${
        truncate ? "block max-w-md truncate" : "break-all"
      }`}
      title={formattedValue}
    >
      {formattedValue}
    </span>
  );
}