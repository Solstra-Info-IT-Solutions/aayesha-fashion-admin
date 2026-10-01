"use client";

import Link from "next/link";
import {
  Archive,
  Eye,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

import type {
  MarketingCampaign,
  MarketingCampaignStatus,
} from "@/types/marketing";

type MarketingCampaignTableProps = {
  campaigns: MarketingCampaign[];
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

export default function MarketingCampaignTable({
  campaigns,
  onArchive,
  onRestore,
  onDelete,
}: MarketingCampaignTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Campaign
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Type
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Budget
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Start Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                End Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign) => {
              const isArchived =
                campaign.status === "archived";

              return (
                <tr
                  key={campaign._id}
                  className="border-b border-[#e6dfcf] last:border-b-0 hover:bg-[#f7f2e7]/50"
                >
                  {/* Campaign */}
                  <td className="px-5 py-4">
                    <div className="max-w-[280px]">
                      <Link
                        href={`/admin/marketing/${campaign._id}`}
                        className="block truncate text-sm font-semibold text-[#2a2520] transition hover:text-[#6f542f]"
                      >
                        {campaign.name}
                      </Link>

                      {campaign.description ? (
                        <p className="mt-1 truncate text-xs text-[#5f584d]">
                          {campaign.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-[#756d62]">
                          No description
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#2a2520]">
                      {formatLabel(campaign.type)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        campaign.status,
                      )}`}
                    >
                      {formatLabel(campaign.status)}
                    </span>
                  </td>

                  {/* Budget */}
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-medium text-[#2a2520]">
                      {formatCurrency(campaign.budget)}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#2a2520]">
                      {formatDate(campaign.startsAt)}
                    </span>
                  </td>

                  {/* End Date */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#2a2520]">
                      {formatDate(campaign.endsAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <Link
                        href={`/admin/marketing/${campaign._id}`}
                        title="View campaign"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#efe8d8] hover:text-[#2a2520]"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit */}
                      {!isArchived && (
                        <Link
                          href={`/admin/marketing/${campaign._id}/edit`}
                          title="Edit campaign"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#f1ead9] hover:text-[#6f542f]"
                        >
                          <Pencil size={15} />
                        </Link>
                      )}

                      {/* Archive / Restore */}
                      {isArchived ? (
                        <button
                          type="button"
                          title="Restore campaign"
                          onClick={() =>
                            onRestore(campaign)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-green-50 hover:text-green-700"
                        >
                          <RotateCcw size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Archive campaign"
                          onClick={() =>
                            onArchive(campaign)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          <Archive size={15} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete campaign"
                        onClick={() =>
                          onDelete(campaign)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#fdecec] hover:text-[#b3261e]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}