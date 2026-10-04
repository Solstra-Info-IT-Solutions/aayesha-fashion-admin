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
    <div className="rounded-[14px] border border-dashed border-[#2e2a26] bg-[#1a1816] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#2a241b] text-[#f8f3f1]">
        <Percent size={26} />
      </div>

      {hasFilters ? (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[#f8f3f1]">
            No discounts found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
            No discount coupons match your current search or filters.
            Try changing your filters or clear them to see all discounts.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-4 text-sm font-medium text-[#f8f3f1] shadow-sm transition hover:bg-[#111111]"
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[#f8f3f1]">
            No discounts yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
            Create your first discount coupon to offer promotions
            and special deals to your customers.
          </p>

          <Link
            href="/admin/discounts/create"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#b79a6a] px-4 text-sm font-semibold text-[#111111] shadow-sm transition hover:bg-[#c8ad7f]"
          >
            <Plus size={17} />
            New Discount
          </Link>
        </>
      )}
    </div>
  );
}