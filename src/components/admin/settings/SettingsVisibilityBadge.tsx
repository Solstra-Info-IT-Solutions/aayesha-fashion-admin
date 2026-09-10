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
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-gray-50 text-gray-600"
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