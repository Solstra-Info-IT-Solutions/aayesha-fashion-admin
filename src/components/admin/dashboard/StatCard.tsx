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
    <article className="border border-[#e6ddd4] bg-[#fbf9f5] p-5">
      <div className="flex items-start justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
          {label}
        </span>

        <Icon
          size={18}
          strokeWidth={1.6}
          className="text-[#958781]"
        />
      </div>

      <p className="mt-5 font-serif text-3xl text-[#3f2d2a]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#958781]">
        {helper}
      </p>
    </article>
  );
}