"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleOff,
  Clock3,
  Pencil,
  Percent,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
} from "lucide-react";

import type { Coupon } from "@/types/discount";

type DiscountDetailProps = {
  discount: Coupon;
  onToggleStatus: () => void;
  onDelete: () => void;
  actionLoading?: boolean;
};

const statusConfig: Record<
  Coupon["lifecycleStatus"],
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  active: {
    label: "Active",
    className:
      "bg-[#1a2419] text-[#8fb08a] border-[#2c4a33]",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-[#211e1b] text-[#cfc7bb] border-[#2e2a26]",
    icon: CircleOff,
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-[#16222b] text-[#8fbfdc] border-[#2c4658]",
    icon: Clock3,
  },
  expired: {
    label: "Expired",
    className:
      "bg-[#2b1a18] text-[#f0a39d] border-[#5a2a27]",
    icon: Clock3,
  },
};

function formatDate(
  value: string | null,
) {
  if (!value) return "No expiry";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function getDiscountLabel(
  discount: Coupon,
) {
  if (
    discount.discountType ===
    "percentage"
  ) {
    return `${discount.discountValue}%`;
  }

  if (
    discount.discountType ===
    "fixed"
  ) {
    return formatCurrency(
      discount.discountValue,
    );
  }

  return "Free Shipping";
}

export default function DiscountDetail({
  discount,
  onToggleStatus,
  onDelete,
  actionLoading = false,
}: DiscountDetailProps) {
  const status =
    statusConfig[
      discount.lifecycleStatus
    ];

  const StatusIcon = status.icon;

  const usagePercentage =
    discount.usageLimit !== null &&
    discount.usageLimit > 0
      ? Math.min(
          100,
          Math.round(
            (discount.usedCount /
              discount.usageLimit) *
              100,
          ),
        )
      : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SmartBackLink
          href="/admin/discounts"
          className="inline-flex w-fit items-center gap-2 text-sm text-[#cfc7bb] transition hover:text-[#f8f3f1]"
        >
          <ArrowLeft size={16} />
          Back to Discounts
        </SmartBackLink>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/discounts/${discount._id}/edit`}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm font-medium text-[#f8f3f1] shadow-sm transition hover:bg-[#111111]"
          >
            <Pencil size={15} />
            Edit
          </Link>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onToggleStatus}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm font-medium text-[#f8f3f1] shadow-sm transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {discount.isActive ? (
              <CircleOff size={15} />
            ) : (
              <CheckCircle2 size={15} />
            )}

            {discount.isActive
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#5a2a27] bg-[#1a1816] px-3 text-sm font-medium text-[#e08b84] transition hover:bg-[#2b1a18] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#2a241b] px-3 py-2 font-mono text-lg font-bold tracking-wider text-[#f8f3f1]">
                <Tag size={18} />
                {discount.code}
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
              >
                <StatusIcon size={14} />
                {status.label}
              </span>
            </div>

            {discount.description && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#cfc7bb]">
                {discount.description}
              </p>
            )}
          </div>

          <div className="rounded-[14px] bg-[#111111] px-5 py-4 text-center sm:min-w-[150px]">
            <p className="text-xs font-medium uppercase tracking-wide text-[#cfc7bb]">
              Discount
            </p>

            <p className="mt-1 text-2xl font-bold text-[#f8f3f1]">
              {getDiscountLabel(
                discount,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#cfc7bb]">
            <ShoppingBag size={17} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Usage
            </span>
          </div>

          <p className="mt-2 text-xl font-semibold text-[#f8f3f1]">
            {discount.usedCount}
            {discount.usageLimit !==
            null
              ? ` / ${discount.usageLimit}`
              : " / Unlimited"}
          </p>

          {discount.usageLimit !==
            null && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#211e1b]">
              <div
                className="h-full rounded-full bg-[#b79a6a]"
                style={{
                  width: `${usagePercentage}%`,
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#cfc7bb]">
            <Percent size={17} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Type
            </span>
          </div>

          <p className="mt-2 text-base font-semibold capitalize text-[#f8f3f1]">
            {discount.discountType ===
            "free_shipping"
              ? "Free Shipping"
              : discount.discountType}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#cfc7bb]">
            <ShoppingBag size={17} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Minimum Order
            </span>
          </div>

          <p className="mt-2 text-base font-semibold text-[#f8f3f1]">
            {discount.minimumOrderValue >
            0
              ? formatCurrency(
                  discount.minimumOrderValue,
                )
              : "No minimum"}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#cfc7bb]">
            <Users size={17} />
            <span className="text-xs font-medium uppercase tracking-wide">
              Per Customer
            </span>
          </div>

          <p className="mt-2 text-base font-semibold text-[#f8f3f1]">
            {discount.usageLimitPerCustomer ??
              "Unlimited"}
          </p>
        </div>
      </div>

      {/* Schedule */}
      <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2">
          <CalendarDays
            size={18}
            className="text-[#f8f3f1]"
          />

          <h2 className="text-base font-semibold text-[#f8f3f1]">
            Schedule
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-lg bg-[#111111] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#cfc7bb]">
              Starts At
            </p>

            <p className="mt-1 text-sm font-semibold text-[#f8f3f1]">
              {formatDate(
                discount.startsAt,
              )}
            </p>
          </div>

          <div className="rounded-lg bg-[#111111] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#cfc7bb]">
              Ends At
            </p>

            <p className="mt-1 text-sm font-semibold text-[#f8f3f1]">
              {formatDate(
                discount.endsAt,
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Additional settings */}
      <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-[#f8f3f1]">
          Additional Settings
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-[#2e2a26] px-4 py-3">
            <span className="text-sm text-[#cfc7bb]">
              First Order Only
            </span>

            <span className="text-sm font-semibold text-[#f8f3f1]">
              {discount.firstOrderOnly
                ? "Yes"
                : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#2e2a26] px-4 py-3">
            <span className="text-sm text-[#cfc7bb]">
              Maximum Discount
            </span>

            <span className="text-sm font-semibold text-[#f8f3f1]">
              {discount.maxDiscountAmount !==
              null
                ? formatCurrency(
                    discount.maxDiscountAmount,
                  )
                : "Not set"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}