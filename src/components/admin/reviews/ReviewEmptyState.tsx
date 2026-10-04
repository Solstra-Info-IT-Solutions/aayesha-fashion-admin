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
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#2a241b] text-[#f8f3f1]">
        <MessageSquareText size={26} />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#f8f3f1]">
        {hasFilters ? "No reviews found" : "No reviews yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
        {hasFilters
          ? "No reviews match your current search or filters. Try changing the filters or clearing them."
          : "Customer reviews will appear here once customers start submitting reviews."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-4 text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111]"
        >
          <RotateCcw size={16} />
          Clear Filters
        </button>
      )}

      {!hasFilters && (
        <Link
          href="/admin"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#b79a6a] px-5 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f]"
        >
          Back to Admin
        </Link>
      )}
    </div>
  );
}