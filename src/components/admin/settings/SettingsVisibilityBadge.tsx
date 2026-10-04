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
          ? "border-[#2c4a33] bg-[#1a2419] text-[#8fb08a]"
          : "border-[#2e2a26] bg-[#111111] text-[#cfc7bb]"
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