"use client";

import SettingsSkeleton from "./SettingsSkeleton";

export default function SettingsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-6 w-40 rounded bg-[#2e2a26]" />
        <div className="mt-2 h-4 w-72 rounded bg-[#211e1b]" />
      </div>

      <SettingsSkeleton />
    </div>
  );
}