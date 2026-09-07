import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="border border-[#e7e2dd] bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.14em] text-[#969696]">
          {label}
        </p>

        <Icon
          size={18}
          strokeWidth={1.6}
          className="text-[#b5aea7]"
        />
      </div>

      <p className="mt-5 font-serif text-3xl text-[#171717]">
        {value}
      </p>

      {helper && (
        <p className="mt-2 text-xs text-[#969696]">
          {helper}
        </p>
      )}
    </div>
  );
}