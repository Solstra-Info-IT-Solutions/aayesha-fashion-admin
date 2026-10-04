"use client";

import Link from "next/link";
import {
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
    <div className="flex flex-col gap-5 pb-2 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-2 hidden items-center gap-2 text-xs text-[#cfc7bb]">
          <Link
            href="/admin"
            className="transition hover:text-[#f8f3f1]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[#f8f3f1]">
            Reviews
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">Moderation</p>
            <h1 className="mt-1 text-[#f8f3f1]">
              Reviews
            </h1>

            <p className="mt-1 text-sm text-[#cfc7bb]">
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
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:bg-[#2a241b] disabled:cursor-not-allowed disabled:opacity-60"
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