"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Headphones,
  MessageCircle,
  XCircle,
} from "lucide-react";

import type { SupportStats as SupportStatsType } from "@/types/support";

type SupportStatsProps = {
  stats: SupportStatsType | null;
  loading?: boolean;
};

const statCards = [
  {
    key: "total",
    label: "Total Tickets",
    icon: Headphones,
    iconClass:
      "bg-[#f1ead9] text-[#26221d]",
  },
  {
    key: "open",
    label: "Open",
    icon: MessageCircle,
    iconClass: "bg-[#e6f0f7] text-[#1f5f86]",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Clock3,
    iconClass: "bg-[#fdf3e1] text-[#7f4806]",
  },
  {
    key: "waitingCustomer",
    label: "Waiting Customer",
    icon: AlertCircle,
    iconClass: "bg-[#fdf3e1] text-[#7f4806]",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    iconClass: "bg-[#e8f5ec] text-[#276541]",
  },
  {
    key: "closed",
    label: "Closed",
    icon: XCircle,
    iconClass: "bg-[#efe8d8] text-[#5f584d]",
  },
] as const;

export default function SupportStats({
  stats,
  loading = false,
}: SupportStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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