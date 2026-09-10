"use client";

import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Star,
  XCircle,
} from "lucide-react";
import type { ReviewStats as ReviewStatsType } from "@/types/review";

type ReviewStatsProps = {
  stats: ReviewStatsType | null;
  loading?: boolean;
};

const statCards = [
  {
    key: "total",
    label: "Total Reviews",
    icon: MessageSquareText,
    iconClass: "bg-[var(--color-rose-light)] text-[#9f1239]",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconClass: "bg-red-50 text-red-600",
  },
  {
    key: "featured",
    label: "Featured",
    icon: Star,
    iconClass: "bg-yellow-50 text-yellow-600",
  },
] as const;

export default function ReviewStats({
  stats,
  loading = false,
}: ReviewStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />

            <div className="mt-5 h-3 w-24 animate-pulse rounded bg-gray-100" />

            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}
            >
              <Icon size={19} />
            </div>

            <p className="mt-4 text-sm font-medium text-[var(--color-secondary)]">
              {card.label}
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              {value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}