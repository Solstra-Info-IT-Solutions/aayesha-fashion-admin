import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="border border-[#e7e2dd] bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
          {label}
        </span>

        <Icon
          size={18}
          strokeWidth={1.6}
          className="text-[#b8b0a8]"
        />
      </div>

      <p className="mt-5 font-serif text-3xl text-[#171717]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#969696]">
        {helper}
      </p>
    </article>
  );
}