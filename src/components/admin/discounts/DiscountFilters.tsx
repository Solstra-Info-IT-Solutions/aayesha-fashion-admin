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
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter
            size={18}
            className="text-[#26221d]"
          />

          <h2 className="text-sm font-semibold text-[#2a2520]">
            Filters
          </h2>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5f584d] transition hover:text-[#26221d]"
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
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5f584d]"
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
            className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] pl-9 pr-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
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
          className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
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
          className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
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
          className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
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