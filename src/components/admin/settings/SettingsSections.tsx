"use client";

import type { StoreSetting } from "@/types/settings";

type SettingsSectionsProps = {
  settings: StoreSetting[];
  selectedGroup: string;
  onGroupChange: (group: string) => void;
};

export default function SettingsSections({
  settings,
  selectedGroup,
  onGroupChange,
}: SettingsSectionsProps) {
  const groups = Array.from(
    new Set(settings.map((setting) => setting.group).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const groupedSettings = groups.reduce<Record<string, StoreSetting[]>>(
    (acc, group) => {
      acc[group] = settings.filter(
        (setting) => setting.group === group,
      );
      return acc;
    },
    {},
  );

  return (
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-[#2a2520]">
          Setting Groups
        </h2>

        <p className="mt-1 text-sm text-[#756d62]">
          Select a group to quickly filter your store settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onGroupChange("")}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            selectedGroup === ""
              ? "bg-[#26221d] text-white"
              : "bg-[#efe8d8] text-[#5f584d] hover:bg-[#e6dfcf]"
          }`}
        >
          All
        </button>

        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => onGroupChange(group)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition ${
              selectedGroup === group
                ? "bg-[#26221d] text-white"
                : "bg-[#efe8d8] text-[#5f584d] hover:bg-[#e6dfcf]"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {selectedGroup && groupedSettings[selectedGroup] && (
        <div className="mt-5 border-t border-[#e6dfcf] pt-4">
          <p className="text-xs text-[#756d62]">
            {groupedSettings[selectedGroup].length}{" "}
            {groupedSettings[selectedGroup].length === 1
              ? "setting"
              : "settings"}{" "}
            in {selectedGroup}
          </p>
        </div>
      )}
    </div>
  );
}