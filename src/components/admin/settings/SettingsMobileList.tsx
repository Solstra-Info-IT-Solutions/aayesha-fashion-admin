"use client";

import type { StoreSetting } from "@/types/settings";
import SettingsMobileCard from "./SettingsMobileCard";

type SettingsMobileListProps = {
  settings: StoreSetting[];
  deletingKey?: string | null;
  updatingPublicKey?: string | null;
  onTogglePublic: (setting: StoreSetting) => void;
  onDelete: (setting: StoreSetting) => void;
};

export default function SettingsMobileList({
  settings,
  deletingKey = null,
  updatingPublicKey = null,
  onTogglePublic,
  onDelete,
}: SettingsMobileListProps) {
  return (
    <div className="space-y-3 md:hidden">
      {settings.map((setting) => (
        <SettingsMobileCard
          key={setting.key}
          setting={setting}
          deleting={deletingKey === setting.key}
          updatingPublic={updatingPublicKey === setting.key}
          onTogglePublic={onTogglePublic}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}