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
    <div className="rounded-xl border border-[var(--color-border)] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-rose-light)] text-[var(--color-rose-dark)]">
        {filtered ? (
          <Search size={24} />
        ) : (
          <Megaphone size={24} />
        )}
      </div>

      <h3 className="mt-5 text-base font-semibold text-[var(--color-ink)]">
        {filtered
          ? "No campaigns found"
          : "No marketing campaigns yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-secondary)]">
        {filtered
          ? "No campaigns match your current search or filters. Try changing the filters or search term."
          : "Create your first marketing campaign to start managing your promotional activities."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {filtered ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
          >
            Clear Filters
          </button>
        ) : (
          <Link
            href="/admin/marketing/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-rose-dark)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={16} />
            New Campaign
          </Link>
        )}
      </div>
    </div>
  );
}