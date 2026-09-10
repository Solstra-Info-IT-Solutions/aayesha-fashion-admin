"use client";

import Link from "next/link";
import {
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

type ReviewHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function ReviewHeader({
  refreshing,
  onRefresh,
}: ReviewHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <Link
            href="/admin"
            className="transition hover:text-[#9f1239]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[var(--color-ink)]">
            Reviews
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#9f1239]">
            <MessageSquareText
              size={22}
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Reviews
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Manage customer reviews, moderation and featured reviews.
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
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>
    </div>
  );
}