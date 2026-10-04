"use client";

import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  COUPON_DISCOUNT_TYPES,
  COUPON_STATUSES,
  COUPON_SORTS,
  type CouponDiscountType,
  type CouponSort,
  type CouponStatus,
} from "@/types/discount";

type DiscountFiltersProps = {
  search: string;
  discountType: CouponDiscountType | "";
  status: CouponStatus | "";
  sort: CouponSort;

  onSearchChange: (value: string) => void;
  onDiscountTypeChange: (
    value: CouponDiscountType | "",
  ) => void;
  onStatusChange: (
    value: CouponStatus | "",
  ) => void;
  onSortChange: (value: CouponSort) => void;
  onReset: () => void;
};

const discountTypeLabels: Record<
  CouponDiscountType,
  string
> = {
  percentage: "Percentage",
  fixed: "Fixed Amount",
  free_shipping: "Free Shipping",
};

const statusLabels: Record<
  CouponStatus,
  string
> = {
  active: "Active",
  inactive: "Inactive",
  expired: "Expired",
  scheduled: "Scheduled",
};

const sortLabels: Record<
  CouponSort,
  string
> = {
  newest: "Newest",
  oldest: "Oldest",
  highest_usage: "Highest Usage",
  lowest_usage: "Lowest Usage",
};

export default function DiscountFilters({
  search,
  discountType,
  status,
  sort,
  onSearchChange,
  onDiscountTypeChange,
  onStatusChange,
  onSortChange,
  onReset,
}: DiscountFiltersProps) {
  const hasFilters =
    search.trim() !== "" ||
    discountType !== "" ||
    status !== "" ||
    sort !== "newest";

  return (
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter
            size={18}
            className="text-[#f8f3f1]"
          />

          <h2 className="text-sm font-semibold text-[#f8f3f1]">
            Filters
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#cfc7bb] transition hover:text-[#f8f3f1]"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#cfc7bb]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search coupon code..."
            className="h-10 w-full rounded-lg border border-[#2e2a26] bg-[#1a1816] pl-9 pr-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#f8f3f1] focus:ring-1 focus:ring-[#f8f3f1]"
          />
        </div>

        {/* Discount Type */}
        <select
          value={discountType}
          onChange={(event) =>
            onDiscountTypeChange(
              event.target
                .value as CouponDiscountType | "",
            )
          }
          className="h-10 w-full rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-1 focus:ring-[#f8f3f1]"
        >
          <option value="">
            All Discount Types
          </option>

          {COUPON_DISCOUNT_TYPES.map(
            (type) => (
              <option
                key={type}
                value={type}
              >
                {discountTypeLabels[type]}
              </option>
            ),
          )}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target
                .value as CouponStatus | "",
            )
          }
          className="h-10 w-full rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-1 focus:ring-[#f8f3f1]"
        >
          <option value="">
            All Statuses
          </option>

          {COUPON_STATUSES.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {statusLabels[item]}
              </option>
            ),
          )}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target
                .value as CouponSort,
            )
          }
          className="h-10 w-full rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-1 focus:ring-[#f8f3f1]"
        >
          {COUPON_SORTS.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                Sort: {sortLabels[item]}
              </option>
            ),
          )}
        </select>
      </div>
    </div>
  );
}