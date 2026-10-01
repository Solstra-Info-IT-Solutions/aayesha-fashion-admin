"use client";

type SettingsGroupBadgeProps = {
  group: string;
};

export default function SettingsGroupBadge({
  group,
}: SettingsGroupBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#efe8d8] px-2.5 py-1 text-xs font-medium capitalize text-[#5f584d]">
      {group || "general"}
    </span>
  );
}