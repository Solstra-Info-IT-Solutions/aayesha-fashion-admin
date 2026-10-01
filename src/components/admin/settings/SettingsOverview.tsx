"use client";

import {
  Globe2,
  LockKeyhole,
  Layers3,
  Settings2,
} from "lucide-react";

import type { StoreSetting } from "@/types/settings";

type SettingsOverviewProps = {
  settings: StoreSetting[];
};

export default function SettingsOverview({
  settings,
}: SettingsOverviewProps) {
  const publicCount = settings.filter(
    (setting) => setting.isPublic,
  ).length;

  const privateCount = settings.length - publicCount;

  const groupCount = new Set(
    settings.map((setting) => setting.group).filter(Boolean),
  ).size;

  const cards = [
    {
      label: "Total Settings",
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
    {
      label: "Groups",
      value: groupCount,
      icon: Layers3,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#2a2520]">
                  {card.value}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#efe8d8]">
                <Icon className="h-5 w-5 text-[#756d62]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 