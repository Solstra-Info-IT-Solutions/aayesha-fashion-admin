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
    <article className="border border-[#e5e7ec] bg-[#ffffff] p-5">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
          {label}
        </span>

        <Icon
          size={18}
          strokeWidth={1.6}
          className="text-[#737a8c]"
        />
      </div>

      <p className="mt-5 font-serif text-3xl text-[#1a1d24]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#737a8c]">
        {helper}
      </p>
    </article>
  );
}