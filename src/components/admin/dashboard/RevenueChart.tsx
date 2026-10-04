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
          <div className="inline-flex rounded-lg border border-[#2e2a26] bg-[#111111] p-0.5 text-xs font-semibold" role="tablist">
            {(["revenue", "orders"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={measure === key}
                onClick={() => setMeasure(key)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${
                  measure === key ? "bg-[#1a1816] text-[#d9c7a3] shadow-sm" : "text-[#cfc7bb] hover:text-[#f8f3f1]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTable((value) => !value)}
            className="rounded-lg border border-[#2e2a26] px-3 py-1.5 text-xs font-semibold text-[#cfc7bb] hover:text-[#f8f3f1]"
          >
            {table ? "Chart" : "Table"}
          </button>
        </div>
      }
    >
      <p className="mb-3 text-sm text-[#cfc7bb]">
        <span className="display text-4xl font-semibold text-[#f8f3f1]">{fmt(total)}</span>{" "}
        in this period · click a day to open its orders
      </p>

      {loading ? (
        <div className="flex h-72 items-center justify-center text-sm text-[#9a9185]">Loading…</div>
      ) : !hasData ? (
        <div className="flex h-72 items-center justify-center text-sm text-[#9a9185]">
          No sales in this period yet.
        </div>
      ) : table ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-[#1a1816] text-xs uppercase tracking-wide text-[#9a9185]">
              <tr>
                <th className="py-2 font-semibold">Date</th>
                <th className="py-2 text-right font-semibold">Revenue</th>
                <th className="py-2 text-right font-semibold">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2a26]">
              {trend.map((point) => (
                <tr key={point.date} className="cursor-pointer hover:bg-[#111111]" onClick={() => openDay(point.date)}>
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
                  <stop offset="0%" stopColor="#d9c7a3" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#d9c7a3" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#2e2a26" strokeDasharray="3 5" vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#cfc7bb", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={24}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fill: "#cfc7bb", fontSize: 11 }}
                tickFormatter={(value: number) => (measure === "revenue" ? compactMoney(value) : `${value}`)}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: "#b79a6a", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  const point = payload?.[0]?.payload as TrendPoint | undefined;

                  if (!active || !point) return null;

                  return (
                    <div className="rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-[#f8f3f1]">{point.date}</p>
                      <p className="mt-1 text-[#cfc7bb]">
                        Revenue <span className="font-semibold text-[#f8f3f1]">{money(point.revenue)}</span>
                      </p>
                      <p className="text-[#cfc7bb]">
                        Orders <span className="font-semibold text-[#f8f3f1]">{point.orders}</span>
                      </p>
                      <p className="mt-1 text-[#d9c7a3]">Click to open orders</p>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey={measure}
                stroke="#d9c7a3"
                strokeWidth={2}
                fill="url(#revFill)"
                dot={false}
                activeDot={{ r: 5, stroke: "#1a1816", strokeWidth: 2, fill: "#d9c7a3" }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
