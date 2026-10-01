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
      className={`surface surface-hover group relative block overflow-hidden p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#b08d57] ${spark && spark.length > 1 ? "pb-14" : ""}`}
      aria-label={`${label}: ${value}. Open details`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f584d]">
          {label}
        </p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1ead9] text-[#8a6a3b] transition group-hover:bg-[#26221d] group-hover:text-[#fffdf8]">
          <Icon size={17} strokeWidth={1.8} />
        </span>
      </div>

      <p className="mt-3 display text-[40px] font-semibold leading-none text-[#2a2520]">
        {loading ? "—" : value}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs">
        {change !== undefined && !loading ? (
          change === null ? (
            <span className="text-[#756d62]">New activity</span>
          ) : (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                up
                  ? "bg-[#e8f5ec] text-[#276541]"
                  : down
                    ? "bg-[#fdecec] text-[#b3261e]"
                    : "bg-[#efe8d8] text-[#5f584d]"
              }`}
            >
              {up ? <ArrowUpRight size={12} /> : down ? <ArrowDownRight size={12} /> : <Minus size={12} />}
              {Math.abs(change).toFixed(1)}%
            </span>
          )
        ) : null}

        {caption ? <span className="text-[#756d62]">{caption}</span> : null}
      </div>

      {spark && spark.length > 1 && !loading ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 opacity-80" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#b08d57"
                strokeWidth={1.5}
                fill="#b08d57"
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
