"use client";

import Link from "next/link";
import {
  Percent,
  Plus,
  RefreshCw,
} from "lucide-react";

type DiscountHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function DiscountHeader({
  refreshing,
  onRefresh,
}: DiscountHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <Link
            href="/admin"
            className="transition hover:text-[#9f1239]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[var(--color-ink)]">
            Discounts
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#9f1239]">
            <Percent size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Discounts
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Manage discount coupons, offers and promotional codes.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

        {/* Create Discount */}
        <Link
          href="/admin/discounts/create"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#000000] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#881337]"
        >
          <Plus size={17} />

          New Discount
        </Link>
      </div>
    </div>
  );
}