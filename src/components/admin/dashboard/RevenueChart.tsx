"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { compactMoney, money } from "./format";

type Measure = "revenue" | "orders";

export function RevenueChart({
  trend,
  loading,
}: {
  trend: TrendPoint[];
  loading?: boolean;
}) {
  const router = useRouter();
  const [measure, setMeasure] = useState<Measure>("revenue");
  const [table, setTable] = useState(false);

  const total = useMemo(
    () => trend.reduce((sum, point) => sum + point[measure], 0),
    [trend, measure],
  );

  const hasData = trend.some((point) => point.revenue > 0 || point.orders > 0);
  const fmt = (value: number) => (measure === "revenue" ? money(value) : `${value}`);

  const openDay = (date: string | undefined) => {
    if (!date) return;

    const query = new URLSearchParams({ from: date, to: date });

    if (measure === "revenue") query.set("paymentStatus", "paid");

    router.push(`/admin/orders?${query}`);
  };

  return (
    <ChartCard
      eyebrow="Sales"
      title={measure === "revenue" ? "Revenue over time" : "Orders over time"}
      className="xl:col-span-2"
      actions={
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#e6dfcf] bg-[#f7f2e7] p-0.5 text-xs font-semibold" role="tablist">
            {(["revenue", "orders"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={measure === key}
                onClick={() => setMeasure(key)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${
                  measure === key ? "bg-[#fffdf8] text-[#8a6a3b] shadow-sm" : "text-[#5f584d] hover:text-[#2a2520]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTable((value) => !value)}
            className="rounded-lg border border-[#e6dfcf] px-3 py-1.5 text-xs font-semibold text-[#5f584d] hover:text-[#2a2520]"
          >
            {table ? "Chart" : "Table"}
          </button>
        </div>
      }
    >
      <p className="mb-3 text-sm text-[#5f584d]">
        <span className="display text-4xl font-semibold text-[#2a2520]">{fmt(total)}</span>{" "}
        in this period · click a day to open its orders
      </p>

      {loading ? (
        <div className="flex h-72 items-center justify-center text-sm text-[#756d62]">Loading…</div>
      ) : !hasData ? (
        <div className="flex h-72 items-center justify-center text-sm text-[#756d62]">
          No sales in this period yet.
        </div>
      ) : table ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white text-xs uppercase tracking-wide text-[#756d62]">
              <tr>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 text-right font-semibold">Revenue</th>
                <th className="py-2 text-right font-semibold">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6dfcf]">
              {trend.map((point) => (
                <tr key={point.date} className="cursor-pointer hover:bg-[#f7f2e7]" onClick={() => openDay(point.date)}>
                  <td className="py-2">{point.date}</td>
                  <td className="py-2 text-right font-medium">{money(point.revenue)}</td>
                  <td className="py-2 text-right">{point.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-72 w-full" role="img" aria-label={`${measure} per day`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trend}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              onClick={(state) => {
                const raw = state as unknown as { activeIndex?: string | number; activeTooltipIndex?: string | number };
                const index = Number(raw?.activeIndex ?? raw?.activeTooltipIndex);

                if (Number.isFinite(index)) openDay(trend[index]?.date);
              }}
              style={{ cursor: "pointer" }}
            >
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8a6a3b" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#8a6a3b" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#e6dfcf" strokeDasharray="3 5" vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#5f584d", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={24}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fill: "#5f584d", fontSize: 11 }}
                tickFormatter={(value: number) => (measure === "revenue" ? compactMoney(value) : `${value}`)}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: "#b08d57", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload as TrendPoint | undefined;

                  if (!active || !point) return null;

                  return (
                    <div className="rounded-lg border border-[#e6dfcf] bg-white px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-[#2a2520]">{point.date}</p>
                      <p className="mt-1 text-[#5f584d]">
                        Revenue <span className="font-semibold text-[#2a2520]">{money(point.revenue)}</span>
                      </p>
                      <p className="text-[#5f584d]">
                        Orders <span className="font-semibold text-[#2a2520]">{point.orders}</span>
                      </p>
                      <p className="mt-1 text-[#8a6a3b]">Click to open orders</p>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey={measure}
                stroke="#8a6a3b"
                strokeWidth={2}
                fill="url(#revFill)"
                dot={false}
                activeDot={{ r: 5, stroke: "#fffdf8", strokeWidth: 2, fill: "#8a6a3b" }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
