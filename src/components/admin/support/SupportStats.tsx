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
      "bg-[#2a241b] text-[#f8f3f1]",
  },
  {
    key: "open",
    label: "Open",
    icon: MessageCircle,
    iconClass: "bg-[#16222b] text-[#8fbfdc]",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Clock3,
    iconClass: "bg-[#2b2216] text-[#e0b56a]",
  },
  {
    key: "waitingCustomer",
    label: "Waiting Customer",
    icon: AlertCircle,
    iconClass: "bg-[#2b2216] text-[#e0b56a]",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    iconClass: "bg-[#1a2419] text-[#8fb08a]",
  },
  {
    key: "closed",
    label: "Closed",
    icon: XCircle,
    iconClass: "bg-[#211e1b] text-[#cfc7bb]",
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
            <div className="h-10 w-10 animate-pulse rounded-[14px] bg-[#211e1b]" />

            <div className="mt-5 h-3 w-24 animate-pulse rounded bg-[#211e1b]" />

            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-[#211e1b]" />
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