"use client";

import Link from "next/link";
import { MessageSquareText, RotateCcw } from "lucide-react";

type ReviewEmptyStateProps = {
  hasFilters: boolean;
  onReset: () => void;
};

export default function ReviewEmptyState({
  hasFilters,
  onReset,
}: ReviewEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-rose-light)] text-[#9f1239]">
        <MessageSquareText size={26} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[var(--color-ink)]">
        {hasFilters ? "No reviews found" : "No reviews yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-secondary)]">
        {hasFilters
          ? "No reviews match your current search or filters. Try changing the filters or clearing them."
          : "Customer reviews will appear here once customers start submitting reviews."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Clear Filters
        </button>
      )}

      {!hasFilters && (
        <Link
          href="/admin"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#9f1239] px-5 text-sm font-medium text-white transition hover:bg-[#881337]"
        >
          Back to Admin
        </Link>
      )}
    </div>
  );
}