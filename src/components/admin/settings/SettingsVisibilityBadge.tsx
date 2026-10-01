"use client";

import { Globe2, LockKeyhole } from "lucide-react";

type SettingsVisibilityBadgeProps = {
  isPublic: boolean;
};

export default function SettingsVisibilityBadge({
  isPublic,
}: SettingsVisibilityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isPublic
          ? "border-[#bfe3cb] bg-[#e8f5ec] text-[#276541]"
          : "border-[#e6dfcf] bg-[#f7f2e7] text-[#5f584d]"
      }`}
    >
      {isPublic ? (
        <>
          <Globe2 className="h-3.5 w-3.5" />
          Public
        </>
      ) : (
        <>
          <LockKeyhole className="h-3.5 w-3.5" />
          Private
        </>
      )}
    </span>
  );
}