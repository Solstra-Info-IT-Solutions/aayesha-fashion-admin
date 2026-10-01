"use client";

import { Filter } from "lucide-react";

type SettingsGroupFilterProps = {
  groups: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function SettingsGroupFilter({
  groups,
  value,
  onChange,
}: SettingsGroupFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3">
        <Filter className="h-4 w-4 text-[#756d62]" />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-transparent text-sm font-medium text-[#3d372f] outline-none"
        >
          <option value="">All groups</option>

          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}