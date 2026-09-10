"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import {
  REVIEW_SORTS,
  REVIEW_STATUSES,
  type ReviewSort,
  type ReviewStatus,
} from "@/types/review";

type ReviewFiltersProps = {
  search: string;
  status: ReviewStatus | "";
  sort: ReviewSort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ReviewStatus | "") => void;
  onSortChange: (value: ReviewSort) => void;
  onReset: () => void;
};

const statusLabels: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const sortLabels: Record<ReviewSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  highest_rating: "Highest Rating",
  lowest_rating: "Lowest Rating",
};

export default function ReviewFilters({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: ReviewFiltersProps) {
  const hasFilters = Boolean(search || status || sort !== "newest");

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal
          size={17}
          className="text-[#9f1239]"
        />

        <h2 className="text-sm font-semibold text-[var(--color-ink)]">
          Filters
        </h2>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        {/* Search */}
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search reviews..."
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-gray-400 focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ReviewStatus | "")
          }
          className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
        >
          <option value="">All Statuses</option>

          {REVIEW_STATUSES.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as ReviewSort)
          }
          className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
        >
          {REVIEW_SORTS.map((item) => (
            <option key={item} value={item}>
              {sortLabels[item]}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}