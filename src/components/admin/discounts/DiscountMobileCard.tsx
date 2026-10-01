"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import type { Coupon } from "@/types/discount";

type DiscountMobileCardProps = {
  discount: Coupon;
  onToggleStatus: (
    discount: Coupon,
  ) => void;
  onDelete: (
    discount: Coupon,
  ) => void;
  actionLoadingId?: string | null;
};

const statusConfig: Record<
  Coupon["lifecycleStatus"],
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Active",
    className:
      "bg-[#e8f5ec] text-[#276541]",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-[#efe8d8] text-[#5f584d]",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-[#e6f0f7] text-[#1f5f86]",
  },
  expired: {
    label: "Expired",
    className:
      "bg-[#fdecec] text-[#8f1f19]",
  },
};

function formatDate(
  value: string | null,
) {
  if (!value) return "—";

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
    },
  ).format(date);
}

function formatDiscount(
  discount: Coupon,
) {
  if (
    discount.discountType ===
    "percentage"
  ) {
    return `${discount.discountValue}%`;
  }

  if (
    discount.discountType === "fixed"
  ) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      },
    ).format(
      discount.discountValue,
    );
  }

  return "Free Shipping";
}

function formatMinimumOrder(
  value: number,
) {
  if (value <= 0) return null;

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

export default function DiscountMobileCard({
  discount,
  onToggleStatus,
  onDelete,
  actionLoadingId = null,
}: DiscountMobileCardProps) {
  const status =
    statusConfig[
      discount.lifecycleStatus
    ];

  const isLoading =
    actionLoadingId === discount._id;

  const minimumOrder =
    formatMinimumOrder(
      discount.minimumOrderValue,
    );

  return (
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/discounts/${discount._id}`}
            className="inline-flex max-w-full items-center rounded-md bg-[#f1ead9] px-2.5 py-1 font-mono text-sm font-semibold tracking-wide text-[#26221d] transition hover:bg-pink-100"
          >
            <span className="truncate">
              {discount.code}
            </span>
          </Link>

          {discount.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#5f584d]">
              {discount.description}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Discount */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#f7f2e7] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Discount
          </p>

          <p className="mt-1 text-base font-semibold text-[#2a2520]">
            {formatDiscount(
              discount,
            )}
          </p>
        </div>

        <div className="rounded-lg bg-[#f7f2e7] p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Usage
          </p>

          <p className="mt-1 text-base font-semibold text-[#2a2520]">
            {discount.usedCount}
            {discount.usageLimit !==
              null
              ? ` / ${discount.usageLimit}`
              : " / ∞"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2.5 border-t border-[#e6dfcf] pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#5f584d]">
            Start Date
          </span>

          <span className="font-medium text-[#2a2520]">
            {formatDate(
              discount.startsAt,
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[#5f584d]">
            End Date
          </span>

          <span className="font-medium text-[#2a2520]">
            {formatDate(
              discount.endsAt,
            )}
          </span>
        </div>

        {minimumOrder && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#5f584d]">
              Minimum Order
            </span>

            <span className="font-medium text-[#2a2520]">
              {minimumOrder}
            </span>
          </div>
        )}

        {discount
          .usageLimitPerCustomer !==
          null && (
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#5f584d]">
              Per Customer
            </span>

            <span className="font-medium text-[#2a2520]">
              {discount.usageLimitPerCustomer}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {discount.firstOrderOnly && (
        <div className="mt-4">
          <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-medium text-purple-700">
            First Order Only
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-[#e6dfcf] pt-4">
        <Link
          href={`/admin/discounts/${discount._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e6dfcf] text-xs font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
        >
          <Eye size={15} />
          View
        </Link>

        <Link
          href={`/admin/discounts/${discount._id}/edit`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e6dfcf] text-xs font-medium text-[#26221d] transition hover:bg-[#f1ead9]"
        >
          <Pencil size={15} />
          Edit
        </Link>

        <button
          type="button"
          title={
            discount.isActive
              ? "Deactivate"
              : "Activate"
          }
          disabled={isLoading}
          onClick={() =>
            onToggleStatus(discount)
          }
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#2a2520] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Power size={15} />
        </button>

        <button
          type="button"
          title="Delete discount"
          disabled={isLoading}
          onClick={() =>
            onDelete(discount)
          }
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#fdecec] hover:text-[#b3261e] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}