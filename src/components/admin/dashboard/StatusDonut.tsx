"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { OrderStatusSummary } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { labelOf, statusColor } from "./format";

export function StatusDonut({
  statuses,
  loading,
}: {
  statuses: OrderStatusSummary[];
  loading?: boolean;
}) {
  const router = useRouter();
  const total = statuses.reduce((sum, item) => sum + item.count, 0);
  const data = statuses.filter((item) => item.count > 0);

  return (
    <ChartCard eyebrow="Orders" title="Order status" href="/admin/orders" hrefLabel="All orders">
      {loading ? (
        <div className="flex h-56 items-center justify-center text-sm text-[#9a9185]">Loading…</div>
      ) : total === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-[#9a9185]">No orders yet.</div>
      ) : (
        <>
          <div className="relative mx-auto h-44 w-44" role="img" aria-label="Orders by status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="#1a1816"
                  strokeWidth={2}
                  isAnimationActive={false}
                  onClick={(slice) => {
                    const status = (slice as unknown as { status?: string })?.status;

                    if (status) router.push(`/admin/orders?status=${encodeURIComponent(status)}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {data.map((item) => (
                    <Cell key={item.status} fill={statusColor(item.status)} />
                  ))}
                </Pie>

                <Tooltip
                  content={({ active, payload }) => {
                    const item = payload?.[0]?.payload as OrderStatusSummary | undefined;

                    if (!active || !item) return null;

                    return (
                      <div className="rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 py-2 text-xs shadow-lg">
                        <span className="font-semibold text-[#f8f3f1]">{labelOf(item.status)}</span>{" "}
                        <span className="text-[#cfc7bb]">
                          {item.count} ({Math.round((item.count / total) * 100)}%)
                        </span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#f8f3f1]">{total}</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#9a9185]">orders</span>
            </div>
          </div>

          <ul className="mt-5 space-y-1.5">
            {statuses.map((item) => (
              <li key={item.status}>
                <Link
                  href={`/admin/orders?status=${encodeURIComponent(item.status)}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-[#111111]"
                >
                  <span className="flex items-center gap-2 text-[#f8f3f1]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor(item.status) }} />
                    {labelOf(item.status)}
                  </span>

                  <span className="text-[#cfc7bb]">
                    <span className="font-semibold text-[#f8f3f1]">{item.count}</span>{" "}
                    · {Math.round((item.count / total) * 100)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartCard>
  );
}
