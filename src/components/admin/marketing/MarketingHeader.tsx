"use client";

import Link from "next/link";
import {
  Megaphone,
  Plus,
  RefreshCw,
} from "lucide-react";

type MarketingHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function MarketingHeader({
  refreshing,
  onRefresh,
}: MarketingHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <Link
            href="/admin"
            className="transition hover:text-[var(--color-rose-dark)]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[var(--color-ink)]">
            Marketing
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[var(--color-rose-dark)]">
            <Megaphone size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Marketing
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Manage campaigns, promotions and
              marketing activities.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

        <Link
  href="/admin/marketing/create"
  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#000000] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#881337]"
>
  <Plus size={17} />
  New Campaign
</Link>
      </div>
    </div>
  );
}