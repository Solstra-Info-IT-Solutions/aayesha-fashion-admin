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
      "bg-[var(--color-rose-light)] text-[#9f1239]",
  },
  {
    key: "open",
    label: "Open",
    icon: MessageCircle,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Clock3,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    key: "waitingCustomer",
    label: "Waiting Customer",
    icon: AlertCircle,
    iconClass: "bg-orange-50 text-orange-600",
  },
  {
    key: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "closed",
    label: "Closed",
    icon: XCircle,
    iconClass: "bg-gray-100 text-gray-600",
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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