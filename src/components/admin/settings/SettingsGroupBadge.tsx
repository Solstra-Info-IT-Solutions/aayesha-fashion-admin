"use client";

type SettingsGroupBadgeProps = {
  group: string;
};

export default function SettingsGroupBadge({
  group,
}: SettingsGroupBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#211e1b] px-2.5 py-1 text-xs font-medium capitalize text-[#cfc7bb]">
      {group || "general"}
    </span>
  );
}