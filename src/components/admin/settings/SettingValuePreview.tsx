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
      <div className="rounded-[14px] border border-dashed border-[#e6dfcf] bg-[#f7f2e7] px-4 py-6 text-center">
        <p className="text-sm text-[#756d62]">No value configured</p>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#f7f2e7]">
        <div className="flex items-center gap-2 border-b border-[#e6dfcf] px-4 py-3">
          <Braces className="h-4 w-4 text-[#756d62]" />

          <span className="text-xs font-semibold uppercase tracking-wide text-[#756d62]">
            JSON Value
          </span>
        </div>

        <pre className="max-h-80 overflow-auto p-4 text-xs leading-6 text-[#5f584d]">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#f7f2e7] p-4">
      <p className="break-words text-sm text-[#3d372f]">
        {String(value)}
      </p>
    </div>
  );
}