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
      <div className="rounded-[14px] border border-dashed border-[#2e2a26] bg-[#111111] px-4 py-6 text-center">
        <p className="text-sm text-[#9a9185]">No value configured</p>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#2e2a26] bg-[#111111]">
        <div className="flex items-center gap-2 border-b border-[#2e2a26] px-4 py-3">
          <Braces className="h-4 w-4 text-[#9a9185]" />

          <span className="text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
            JSON Value
          </span>
        </div>

        <pre className="max-h-80 overflow-auto p-4 text-xs leading-6 text-[#cfc7bb]">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#111111] p-4">
      <p className="break-words text-sm text-[#e6dfd4]">
        {String(value)}
      </p>
    </div>
  );
}