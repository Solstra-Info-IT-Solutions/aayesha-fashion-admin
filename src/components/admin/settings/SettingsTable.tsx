"use client";

import type { StoreSetting } from "@/types/settings";
import SettingRow from "./SettingRow";

type SettingsTableProps = {
  settings: StoreSetting[];
  deletingKey?: string | null;
  updatingPublicKey?: string | null;
  onTogglePublic: (setting: StoreSetting) => void;
  onDelete: (setting: StoreSetting) => void;
};

export default function SettingsTable({
  settings,
  deletingKey = null,
  updatingPublicKey = null,
  onTogglePublic,
  onDelete,
}: SettingsTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Setting
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Group
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Value
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Visibility
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {settings.map((setting) => (
              <SettingRow
                key={setting.key}
                setting={setting}
                deleting={deletingKey === setting.key}
                updatingPublic={updatingPublicKey === setting.key}
                onTogglePublic={onTogglePublic}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}