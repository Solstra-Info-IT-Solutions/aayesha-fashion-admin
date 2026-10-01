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
    <div className="rounded-[14px] border border-dashed border-[#e6dfcf] bg-[#fffdf8] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#f1ead9] text-[#26221d]">
        <Percent size={26} />
      </div>

      {hasFilters ? (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[#2a2520]">
            No discounts found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5f584d]">
            No discount coupons match your current search or filters.
            Try changing your filters or clear them to see all discounts.
          </p>

          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#2a2520] shadow-sm transition hover:bg-[#f7f2e7]"
          >
            <RotateCcw size={16} />
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-5 text-lg font-semibold text-[#2a2520]">
            No discounts yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5f584d]">
            Create your first discount coupon to offer promotions
            and special deals to your customers.
          </p>

          <Link
            href="/admin/discounts/create"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-[#26221d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d372f]"
          >
            <Plus size={17} />
            New Discount
          </Link>
        </>
      )}
    </div>
  );
}