"use client";

import SettingsSkeleton from "./SettingsSkeleton";

export default function SettingsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 w-40 rounded bg-[#e6dfcf]" />
        <div className="mt-2 h-4 w-72 rounded bg-[#efe8d8]" />
      </div>

      <SettingsSkeleton />
    </div>
  );
}