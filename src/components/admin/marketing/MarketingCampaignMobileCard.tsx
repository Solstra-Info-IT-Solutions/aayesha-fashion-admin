"use client";

import Link from "next/link";
import {
  Archive,
  CalendarDays,
  CircleDollarSign,
  Eye,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import type {
  MarketingCampaign,
  MarketingCampaignStatus,
} from "@/types/marketing";

type MarketingCampaignMobileCardProps = {
  campaign: MarketingCampaign;
  onArchive: (campaign: MarketingCampaign) => void;
  onRestore: (campaign: MarketingCampaign) => void;
  onDelete: (campaign: MarketingCampaign) => void;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusClasses(status: MarketingCampaignStatus) {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700";

    case "scheduled":
      return "bg-blue-50 text-blue-700";

    case "paused":
      return "bg-yellow-50 text-yellow-700";

    case "completed":
      return "bg-purple-50 text-purple-700";

    case "archived":
      return "bg-gray-100 text-gray-600";

    case "draft":
    default:
      return "bg-gray-50 text-gray-700";
  }
}

export default function MarketingCampaignMobileCard({
  campaign,
  onArchive,
  onRestore,
  onDelete,
}: MarketingCampaignMobileCardProps) {
  const isArchived = campaign.status === "archived";

  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/marketing/${campaign._id}`}
            className="block truncate text-base font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-rose-dark)]"
          >
            {campaign.name}
          </Link>

          {campaign.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-secondary)]">
              {campaign.description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              No description
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
            campaign.status,
          )}`}
        >
          {formatLabel(campaign.status)}
        </span>
      </div>

      {/* Type */}
      <div className="mt-4">
        <span className="inline-flex rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-[var(--color-secondary)]">
          {formatLabel(campaign.type)}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--color-border)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
            <CircleDollarSign size={14} />
            Budget
          </div>

          <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
            {formatCurrency(campaign.budget)}
          </p>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
            <CalendarDays size={14} />
            Start Date
          </div>

          <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
            {formatDate(campaign.startsAt)}
          </p>
        </div>
      </div>

      {/* End Date */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <span className="text-xs text-[var(--color-secondary)]">
          End Date
        </span>

        <span className="text-sm font-medium text-[var(--color-ink)]">
          {formatDate(campaign.endsAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <Link
          href={`/admin/marketing/${campaign._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
        >
          <Eye size={15} />
          View
        </Link>

        {!isArchived && (
          <Link
            href={`/admin/marketing/${campaign._id}/edit`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
            title="Edit campaign"
          >
            <Pencil size={15} />
          </Link>
        )}

        {isArchived ? (
          <button
            type="button"
            onClick={() => onRestore(campaign)}
            title="Restore campaign"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:border-green-600 hover:text-green-700"
          >
            <RotateCcw size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onArchive(campaign)}
            title="Archive campaign"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:border-yellow-600 hover:text-yellow-700"
          >
            <Archive size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(campaign)}
          title="Delete campaign"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:border-red-600 hover:text-red-600"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}