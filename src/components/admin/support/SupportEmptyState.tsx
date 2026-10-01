"use client";

import Link from "next/link";
import { Inbox, RotateCcw } from "lucide-react";

type SupportEmptyStateProps = {
  hasFilters?: boolean;
  onReset?: () => void;
};

export default function SupportEmptyState({
  hasFilters = false,
  onReset,
}: SupportEmptyStateProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] px-6 py-12 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1ead9]">
        <Inbox className="h-8 w-8 text-[#6f542f]" />
      </div>

      <h3 className="text-lg font-semibold text-[#2a2520]">
        No support tickets found
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#756d62]">
        {hasFilters
          ? "No support tickets match your current filters. Try changing your search or filter options."
          : "There are currently no support tickets to display."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#3d372f] transition hover:bg-[#f7f2e7]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </button>
        )}

        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-lg bg-[#26221d] px-4 text-sm font-medium text-white transition hover:bg-[#3d372f]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}