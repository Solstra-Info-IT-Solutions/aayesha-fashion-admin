"use client";

import Link from "next/link";
import {
  Percent,
  Plus,
  RotateCcw,
} from "lucide-react";

type DiscountEmptyStateProps = {
  hasFilters: boolean;
  onReset: () => void;
};

export default function DiscountEmptyState({
  hasFilters,
  onReset,
}: DiscountEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-rose-light)] text-[#9f1239]">
        <Percent size={26} />
      </div>

      {hasFilters ? (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink)]">
            No discounts found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-secondary)]">
            No discount coupons match your current search or filters.
            Try changing your filters or clear them to see all discounts.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink)]">
            No discounts yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-secondary)]">
            Create your first discount coupon to offer promotions
            and special deals to your customers.
          </p>

          <Link
            href="/admin/discounts/create"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#000000] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#881337]"
          >
            <Plus size={17} />
            New Discount
          </Link>
        </>
      )}
    </div>
  );
}