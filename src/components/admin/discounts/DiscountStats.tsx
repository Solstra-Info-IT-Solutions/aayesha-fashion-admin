"use client";

import {
  Activity,
  Clock3,
  CircleOff,
  Tag,
  TrendingUp,
} from "lucide-react";

import type { CouponStats } from "@/types/discount";

type DiscountStatsProps = {
  stats: CouponStats | null;
  loading: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-secondary)]">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[var(--color-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-rose-light)] text-[#9f1239]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-8 w-20 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default function DiscountStats({
  stats,
  loading,
}: DiscountStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <SkeletonCard key={index} />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total Discounts"
        value={stats.total}
        description="All discount coupons"
        icon={<Tag size={20} />}
      />

      <StatCard
        title="Active"
        value={stats.active}
        description="Currently available"
        icon={<Activity size={20} />}
      />

      <StatCard
        title="Scheduled"
        value={stats.scheduled}
        description="Starting in the future"
        icon={<Clock3 size={20} />}
      />

      <StatCard
        title="Inactive"
        value={stats.inactive}
        description="Currently disabled"
        icon={<CircleOff size={20} />}
      />

      <StatCard
        title="Total Usage"
        value={stats.totalUsage.toLocaleString("en-IN")}
        description="Coupons redeemed"
        icon={<TrendingUp size={20} />}
      />
    </div>
  );
}