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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Setting Groups
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select a group to quickly filter your store settings.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onGroupChange("")}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            selectedGroup === ""
              ? "bg-[#9f1239] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                ? "bg-[#9f1239] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {selectedGroup && groupedSettings[selectedGroup] && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
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