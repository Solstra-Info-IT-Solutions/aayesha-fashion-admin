"use client";

import {
  BarChart3,
  CircleDollarSign,
  Megaphone,
  Target,
} from "lucide-react";

import type { MarketingCampaignStats } from "@/types/marketing";

type MarketingStatsProps = {
  stats: MarketingCampaignStats | null;
  loading: boolean;
};

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
};

function StatCard({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#756d62]">
            {title}
          </p>

          <p className="display mt-1 truncate text-3xl font-semibold text-[#2a2520]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#5f584d]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f1ead9] text-[#6f542f]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="surface p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <div className="h-4 w-28 animate-pulse rounded bg-[#e6dfcf]" />

              <div className="mt-3 h-8 w-24 animate-pulse rounded bg-[#e6dfcf]" />

              <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[#e6dfcf]" />
            </div>

            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#e6dfcf]" />
          </div>
        </div>
      ))}
    </>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MarketingStats({
  stats,
  loading,
}: MarketingStatsProps) {
  if (loading || !stats) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsSkeleton />
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Campaigns"
        value={stats.total}
        description="All marketing campaigns"
        icon={<Megaphone size={20} />}
      />

      <StatCard
        title="Active Campaigns"
        value={stats.active}
        description="Currently running"
        icon={<Target size={20} />}
      />

      <StatCard
        title="Total Budget"
        value={formatCurrency(stats.totalBudget)}
        description="Combined campaign budget"
        icon={<CircleDollarSign size={20} />}
      />

      <StatCard
        title="Completed"
        value={stats.completed}
        description="Successfully completed"
        icon={<BarChart3 size={20} />}
      />
    </section>
  );
}