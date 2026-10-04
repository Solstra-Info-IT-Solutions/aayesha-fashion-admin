"use client";

import Link from "next/link";
import {
  Megaphone,
  Plus,
  Search,
} from "lucide-react";

type MarketingEmptyStateProps = {
  filtered: boolean;
  onClearFilters: () => void;
};

export default function MarketingEmptyState({
  filtered,
  onClearFilters,
}: MarketingEmptyStateProps) {
  return (
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2a241b] text-[#d9c7a3]">
        {filtered ? (
          <Search size={24} />
        ) : (
          <Megaphone size={24} />
        )}
      </div>

      <h3 className="mt-5 text-base font-semibold text-[#f8f3f1]">
        {filtered
          ? "No campaigns found"
          : "No marketing campaigns yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
        {filtered
          ? "No campaigns match your current search or filters. Try changing the filters or search term."
          : "Create your first marketing campaign to start managing your promotional activities."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {filtered ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center rounded-lg border border-[#2e2a26] px-4 py-2.5 text-sm font-medium text-[#f8f3f1] transition hover:border-[#d9c7a3] hover:text-[#d9c7a3]"
          >
            Clear Filters
          </button>
        ) : (
          <Link
            href="/admin/marketing/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b79a6a] px-4 py-2.5 text-sm font-medium text-[#111111] transition hover:opacity-90"
          >
            <Plus size={16} />
            New Campaign
          </Link>
        )}
      </div>
    </div>
  );
}