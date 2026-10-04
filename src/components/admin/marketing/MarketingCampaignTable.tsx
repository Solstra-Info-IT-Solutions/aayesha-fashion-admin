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
      return "bg-[#16222b] text-[#8fbfdc]";

    case "paused":
      return "bg-yellow-50 text-yellow-700";

    case "completed":
      return "bg-purple-50 text-purple-700";

    case "archived":
      return "bg-[#211e1b] text-[#cfc7bb]";

    case "draft":
    default:
      return "bg-[#111111] text-[#e6dfd4]";
  }
}

export default function MarketingCampaignTable({
  campaigns,
  onArchive,
  onRestore,
  onDelete,
}: MarketingCampaignTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#2e2a26] bg-[#1a1816] md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#2e2a26] bg-[#111111]/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                Campaign
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                Type
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                Budget
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                Start Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
                End Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#cfc7bb]">
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
                  className="border-b border-[#2e2a26] last:border-b-0 hover:bg-[#111111]/50"
                >
                  {/* Campaign */}
                  <td className="px-5 py-4">
                    <div className="max-w-[280px]">
                      <Link
                        href={`/admin/marketing/${campaign._id}`}
                        className="block truncate text-sm font-semibold text-[#f8f3f1] transition hover:text-[#d9c7a3]"
                      >
                        {campaign.name}
                      </Link>

                      {campaign.description ? (
                        <p className="mt-1 truncate text-xs text-[#cfc7bb]">
                          {campaign.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-[#9a9185]">
                          No description
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#f8f3f1]">
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
                    <span className="text-sm font-medium text-[#f8f3f1]">
                      {formatCurrency(campaign.budget)}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#f8f3f1]">
                      {formatDate(campaign.startsAt)}
                    </span>
                  </td>

                  {/* End Date */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#f8f3f1]">
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#cfc7bb] transition hover:bg-[#211e1b] hover:text-[#f8f3f1]"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit */}
                      {!isArchived && (
                        <Link
                          href={`/admin/marketing/${campaign._id}/edit`}
                          title="Edit campaign"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#cfc7bb] transition hover:bg-[#2a241b] hover:text-[#d9c7a3]"
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
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#cfc7bb] transition hover:bg-green-50 hover:text-green-700"
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
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#cfc7bb] transition hover:bg-yellow-50 hover:text-yellow-700"
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#cfc7bb] transition hover:bg-[#2b1a18] hover:text-[#e08b84]"
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