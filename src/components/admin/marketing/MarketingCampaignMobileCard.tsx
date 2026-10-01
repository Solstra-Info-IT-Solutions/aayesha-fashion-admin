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
      return "bg-[#e6f0f7] text-[#1f5f86]";

    case "paused":
      return "bg-yellow-50 text-yellow-700";

    case "completed":
      return "bg-purple-50 text-purple-700";

    case "archived":
      return "bg-[#efe8d8] text-[#5f584d]";

    case "draft":
    default:
      return "bg-[#f7f2e7] text-[#3d372f]";
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
    <article className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/marketing/${campaign._id}`}
            className="block truncate text-base font-semibold text-[#2a2520] transition hover:text-[#6f542f]"
          >
            {campaign.name}
          </Link>

          {campaign.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#5f584d]">
              {campaign.description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-[#756d62]">
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
        <span className="inline-flex rounded-md bg-[#f7f2e7] px-2.5 py-1 text-xs font-medium text-[#5f584d]">
          {formatLabel(campaign.type)}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#e6dfcf] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5f584d]">
            <CircleDollarSign size={14} />
            Budget
          </div>

          <p className="mt-1 text-sm font-semibold text-[#2a2520]">
            {formatCurrency(campaign.budget)}
          </p>
        </div>

        <div className="rounded-lg border border-[#e6dfcf] p-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5f584d]">
            <CalendarDays size={14} />
            Start Date
          </div>

          <p className="mt-1 text-sm font-semibold text-[#2a2520]">
            {formatDate(campaign.startsAt)}
          </p>
        </div>
      </div>

      {/* End Date */}
      <div className="mt-3 flex items-center justify-between border-t border-[#e6dfcf] pt-3">
        <span className="text-xs text-[#5f584d]">
          End Date
        </span>

        <span className="text-sm font-medium text-[#2a2520]">
          {formatDate(campaign.endsAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-[#e6dfcf] pt-4">
        <Link
          href={`/admin/marketing/${campaign._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e6dfcf] text-xs font-medium text-[#2a2520] transition hover:border-[#6f542f] hover:text-[#6f542f]"
        >
          <Eye size={15} />
          View
        </Link>

        {!isArchived && (
          <Link
            href={`/admin/marketing/${campaign._id}/edit`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-[#6f542f] hover:text-[#6f542f]"
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
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-green-600 hover:text-green-700"
          >
            <RotateCcw size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onArchive(campaign)}
            title="Archive campaign"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-yellow-600 hover:text-yellow-700"
          >
            <Archive size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(campaign)}
          title="Delete campaign"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-[#b3261e] hover:text-[#b3261e]"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}