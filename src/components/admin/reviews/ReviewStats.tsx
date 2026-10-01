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
    iconClass: "bg-[#f1ead9] text-[#26221d]",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    iconClass: "bg-[#fdf3e1] text-[#7f4806]",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "bg-[#e8f5ec] text-[#276541]",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconClass: "bg-[#fdecec] text-[#b3261e]",
  },
  {
    key: "featured",
    label: "Featured",
    icon: Star,
    iconClass: "bg-[#fdf3e1] text-[#7f4806]",
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
            className="surface p-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-[14px] bg-[#efe8d8]" />

            <div className="mt-5 h-3 w-24 animate-pulse rounded bg-[#efe8d8]" />

            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-[#efe8d8]" />
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
            className="surface surface-hover p-5"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-[14px] ${card.iconClass}`}
            >
              <Icon size={19} />
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#756d62]">
              {card.label}
            </p>

            <p className="display mt-1 text-3xl font-semibold text-[#2a2520]">
              {value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}