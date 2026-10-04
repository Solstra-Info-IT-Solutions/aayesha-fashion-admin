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
    iconClass: "bg-[#2a241b] text-[#f8f3f1]",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock3,
    iconClass: "bg-[#2b2216] text-[#e0b56a]",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconClass: "bg-[#1a2419] text-[#8fb08a]",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconClass: "bg-[#2b1a18] text-[#e08b84]",
  },
  {
    key: "featured",
    label: "Featured",
    icon: Star,
    iconClass: "bg-[#2b2216] text-[#e0b56a]",
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
            <div className="h-10 w-10 animate-pulse rounded-[14px] bg-[#211e1b]" />

            <div className="mt-5 h-3 w-24 animate-pulse rounded bg-[#211e1b]" />

            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-[#211e1b]" />
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

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
              {card.label}
            </p>

            <p className="display mt-1 text-3xl font-semibold text-[#f8f3f1]">
              {value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}