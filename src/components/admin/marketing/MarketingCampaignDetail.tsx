"use client";

import { useRouter } from "next/navigation";
import { SmartBackLink } from "@/components/navigation/smart-back-link";
import { useConfirm } from "@/components/ui/useConfirm";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Loader2,
  Pencil,
  RotateCcw,
  Tag,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  archiveMarketingCampaign,
  deleteMarketingCampaign,
  getMarketingCampaign,
  restoreMarketingCampaign,
} from "@/services/marketing.service";

import type {
  MarketingCampaign,
  MarketingCampaignStatus,
} from "@/types/marketing";

type MarketingCampaignDetailProps = {
  id: string;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e6dfcf] p-4">
      <p className="text-xs font-medium text-[#5f584d]">
        {label}
      </p>

      <div className="mt-1.5 text-sm font-semibold text-[#2a2520]">
        {value}
      </div>
    </div>
  );
}

export default function MarketingCampaignDetail({
  id,
}: MarketingCampaignDetailProps) {
  const router = useRouter();
  const { confirm, dialog: confirmDialog } = useConfirm();
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [campaign, setCampaign] =
    useState<MarketingCampaign | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const loadCampaign = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const data = await getMarketingCampaign(
        accessToken,
        id,
      );

      setCampaign(data);
    } catch (error) {
      console.error(
        "Failed to load campaign:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load campaign.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, id]);

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    loadCampaign();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadCampaign,
  ]);

  const handleArchive = async () => {
    if (!campaign || !accessToken) return;

    const confirmed = await confirm({
      title: "Archive this campaign?",
      description: `"${campaign.name}" will be moved to archived. You can restore it later.`,
      confirmLabel: "Archive",
      tone: "default",
    });

    if (!confirmed) return;

    try {
      setActionLoading(true);

      const updated =
        await archiveMarketingCampaign(
          accessToken,
          campaign._id,
        );

      setCampaign(updated);

      toast.success(
        "Campaign archived successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to archive campaign.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!campaign || !accessToken) return;

    try {
      setActionLoading(true);

      const updated =
        await restoreMarketingCampaign(
          accessToken,
          campaign._id,
        );

      setCampaign(updated);

      toast.success(
        "Campaign restored successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to restore campaign.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!campaign || !accessToken) return;

    const confirmed = await confirm({
      title: "Delete this campaign?",
      description: `"${campaign.name}" will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete campaign",
    });

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await deleteMarketingCampaign(
        accessToken,
        campaign._id,
      );

      toast.success(
        "Campaign deleted successfully.",
      );

      router.replace("/admin/marketing");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete campaign.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 rounded bg-[#efe8d8]" />
            <div className="h-72 rounded-[14px] bg-[#efe8d8]" />
            <div className="h-48 rounded-[14px] bg-[#efe8d8]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-5">
            <div className="h-8 w-48 animate-pulse rounded bg-[#efe8d8]" />

            <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6">
              <div className="h-7 w-72 animate-pulse rounded bg-[#efe8d8]" />
              <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-[#efe8d8]" />
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-20 animate-pulse rounded-lg bg-[#efe8d8]"
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] px-6 py-14">
            <h2 className="text-lg font-semibold text-[#2a2520]">
              Campaign not found
            </h2>

            <p className="mt-2 text-sm text-[#5f584d]">
              The requested campaign could not be found.
            </p>

            <SmartBackLink
              href="/admin/marketing"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#6f542f] px-4 py-2.5 text-sm font-medium text-white"
            >
              <ArrowLeft size={16} />
              Back to Marketing
            </SmartBackLink>
          </div>
        </div>
      </div>
    );
  }

  const isArchived =
    campaign.status === "archived";

  return (
    <div className="min-h-full">
      {confirmDialog}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <SmartBackLink
          href="/admin/marketing"
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#5f584d] transition hover:text-[#6f542f]"
        >
          <ArrowLeft size={16} />
          Back to Marketing
        </SmartBackLink>

        {/* Main Card */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8]">
          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-[#e6dfcf] p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    campaign.status,
                  )}`}
                >
                  {formatLabel(campaign.status)}
                </span>

                <span className="rounded-full bg-[#f7f2e7] px-2.5 py-1 text-xs font-medium text-[#5f584d]">
                  {formatLabel(campaign.type)}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#2a2520] sm:text-3xl">
                {campaign.name}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f584d]">
                {campaign.description ||
                  "No description provided."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {!isArchived && (
                <Link
                  href={`/admin/marketing/${campaign._id}/edit`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] px-4 text-sm font-medium text-[#2a2520] transition hover:border-[#6f542f] hover:text-[#6f542f]"
                >
                  <Pencil size={15} />
                  Edit
                </Link>
              )}

              {isArchived ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleRestore}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] px-4 text-sm font-medium text-[#2a2520] transition hover:border-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <RotateCcw size={15} />
                  )}
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleArchive}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] px-4 text-sm font-medium text-[#2a2520] transition hover:border-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : (
                    <Archive size={15} />
                  )}
                  Archive
                </button>
              )}

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDelete}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] px-4 text-sm font-medium text-[#b3261e] transition hover:border-[#b3261e] disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                label="Campaign Type"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Tag size={14} />
                    {formatLabel(campaign.type)}
                  </span>
                }
              />

              <DetailItem
                label="Budget"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <CircleDollarSign size={14} />
                    {formatCurrency(campaign.budget)}
                  </span>
                }
              />

              <DetailItem
                label="Start Date"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatDate(campaign.startsAt)}
                  </span>
                }
              />

              <DetailItem
                label="End Date"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {formatDate(campaign.endsAt)}
                  </span>
                }
              />
            </div>

            {/* Metadata */}
            <div className="mt-6 border-t border-[#e6dfcf] pt-6">
              <h2 className="text-sm font-semibold text-[#2a2520]">
                Campaign Information
              </h2>

              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#5f584d]">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm text-[#2a2520]">
                    {formatDate(campaign.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#5f584d]">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-[#2a2520]">
                    {formatDate(campaign.updatedAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#5f584d]">
                    Created By
                  </dt>
                  <dd className="mt-1 break-all text-sm text-[#2a2520]">
                    {campaign.createdBy || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs text-[#5f584d]">
                    Updated By
                  </dt>
                  <dd className="mt-1 break-all text-sm text-[#2a2520]">
                    {campaign.updatedBy || "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}