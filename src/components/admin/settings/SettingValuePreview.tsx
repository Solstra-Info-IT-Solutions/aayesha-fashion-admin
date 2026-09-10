"use client";

import { Braces } from "lucide-react";

type SettingValuePreviewProps = {
  value: unknown;
};

export default function SettingValuePreview({
  value,
}: SettingValuePreviewProps) {
  if (value === null || value === undefined || value === "") {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
        <p className="text-sm text-gray-400">No value configured</p>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <Braces className="h-4 w-4 text-gray-400" />

          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            JSON Value
          </span>
        </div>

        <pre className="max-h-80 overflow-auto p-4 text-xs leading-6 text-gray-600">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="break-words text-sm text-gray-700">
        {String(value)}
      </p>
    </div>
  );
}