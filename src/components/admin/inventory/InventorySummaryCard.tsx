import type { LucideIcon } from "lucide-react";

interface InventorySummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  loading?: boolean;
}

export default function InventorySummaryCard({
  title,
  value,
  description,
  icon: Icon,
  loading = false,
}: InventorySummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#e7e2dd] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#6f706f]">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-[#f1eeeb]" />
          ) : (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
              {value}
            </p>
          )}

          <p className="mt-2 text-xs text-[#969696]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9e4e6] text-[#d98791]">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}