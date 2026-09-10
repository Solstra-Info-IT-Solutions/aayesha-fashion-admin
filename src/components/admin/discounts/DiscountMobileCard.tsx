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
      "bg-emerald-50 text-emerald-700",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-gray-100 text-gray-600",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-50 text-blue-700",
  },
  expired: {
    label: "Expired",
    className:
      "bg-red-50 text-red-700",
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
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/admin/discounts/${discount._id}`}
            className="inline-flex max-w-full items-center rounded-md bg-[var(--color-rose-light)] px-2.5 py-1 font-mono text-sm font-semibold tracking-wide text-[#9f1239] transition hover:bg-pink-100"
          >
            <span className="truncate">
              {discount.code}
            </span>
          </Link>

          {discount.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--color-secondary)]">
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
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Discount
          </p>

          <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">
            {formatDiscount(
              discount,
            )}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Usage
          </p>

          <p className="mt-1 text-base font-semibold text-[var(--color-ink)]">
            {discount.usedCount}
            {discount.usageLimit !==
              null
              ? ` / ${discount.usageLimit}`
              : " / ∞"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2.5 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-[var(--color-secondary)]">
            Start Date
          </span>

          <span className="font-medium text-[var(--color-ink)]">
            {formatDate(
              discount.startsAt,
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-[var(--color-secondary)]">
            End Date
          </span>

          <span className="font-medium text-[var(--color-ink)]">
            {formatDate(
              discount.endsAt,
            )}
          </span>
        </div>

        {minimumOrder && (
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[var(--color-secondary)]">
              Minimum Order
            </span>

            <span className="font-medium text-[var(--color-ink)]">
              {minimumOrder}
            </span>
          </div>
        )}

        {discount
          .usageLimitPerCustomer !==
          null && (
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-[var(--color-secondary)]">
              Per Customer
            </span>

            <span className="font-medium text-[var(--color-ink)]">
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
      <div className="mt-4 flex items-center gap-2 border-t border-[var(--color-border)] pt-4">
        <Link
          href={`/admin/discounts/${discount._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <Eye size={15} />
          View
        </Link>

        <Link
          href={`/admin/discounts/${discount._id}/edit`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[#9f1239] transition hover:bg-[var(--color-rose-light)]"
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
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-gray-50 hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
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
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}