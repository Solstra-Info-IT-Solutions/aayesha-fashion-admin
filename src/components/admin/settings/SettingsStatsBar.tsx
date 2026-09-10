"use client";

import { Globe2, LockKeyhole, Settings2 } from "lucide-react";

import type { StoreSetting } from "@/types/settings";

type SettingsStatsBarProps = {
  settings: StoreSetting[];
};

export default function SettingsStatsBar({
  settings,
}: SettingsStatsBarProps) {
  const publicCount = settings.filter(
    (setting) => setting.isPublic,
  ).length;

  const privateCount = settings.length - publicCount;

  const stats = [
    {
      label: "All Settings",
      value: settings.length,
      icon: Settings2,
    },
    {
      label: "Public",
      value: publicCount,
      icon: Globe2,
    },
    {
      label: "Private",
      value: privateCount,
      icon: LockKeyhole,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 sm:px-4"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-gray-400" />

              <span className="truncate text-xs font-medium text-gray-500">
                {stat.label}
              </span>
            </div>

            <p className="mt-1 text-lg font-semibold text-gray-900 sm:text-xl">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}