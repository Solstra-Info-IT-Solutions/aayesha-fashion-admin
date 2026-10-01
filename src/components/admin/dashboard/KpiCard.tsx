import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type KpiCardProps = {
  href: string;
  label: string;
  value: string;
  icon: LucideIcon;
  /** % change vs previous period (null = no comparison available). */
  change?: number | null;
  /** Shown under the value, e.g. "vs previous 30 days". */
  caption?: string;
  spark?: number[];
  loading?: boolean;
};

export function KpiCard({
  href,
  label,
  value,
  icon: Icon,
  change,
  caption,
  spark,
  loading,
}: KpiCardProps) {
  const up = (change ?? 0) > 0;
  const down = (change ?? 0) < 0;

  return (
    <Link
      href={href}
      className={`surface surface-hover group relative block overflow-hidden p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#4338ca] ${spark && spark.length > 1 ? "pb-14" : ""}`}
      aria-label={`${label}: ${value}. Open details`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6270]">
          {label}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef2ff] text-[#4338ca] transition group-hover:bg-[#4338ca] group-hover:text-white">
          <Icon size={17} strokeWidth={1.8} />
        </span>
      </div>

      <p className="mt-3 text-[28px] font-bold leading-none tracking-tight text-[#0f172a]">
        {loading ? "—" : value}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {change !== undefined && !loading ? (
          change === null ? (
            <span className="text-[#737a8c]">New activity</span>
          ) : (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                up
                  ? "bg-[#e8f5ec] text-[#276541]"
                  : down
                    ? "bg-[#fdecec] text-[#b3261e]"
                    : "bg-[#eef0f4] text-[#5b6270]"
              }`}
            >
              {up ? <ArrowUpRight size={12} /> : down ? <ArrowDownRight size={12} /> : <Minus size={12} />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )
        ) : null}

        {caption ? <span className="text-[#737a8c]">{caption}</span> : null}
      </div>

      {spark && spark.length > 1 && !loading ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 opacity-80" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#818cf8"
                strokeWidth={1.5}
                fill="#818cf8"
                fillOpacity={0.15}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </Link>
  );
}
