"use client";

import Link from "next/link";
import {
  Plus,
  RefreshCw,
} from "lucide-react";

type DiscountHeaderProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function DiscountHeader({
  refreshing,
  onRefresh,
}: DiscountHeaderProps) {
  return (
    <div className="flex flex-col gap-5 pb-2 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        {/* Breadcrumb */}
        <div className="mb-2 hidden items-center gap-2 text-xs text-[#5f584d]">
          <Link
            href="/admin"
            className="transition hover:text-[#26221d]"
          >
            Admin
          </Link>

          <span>/</span>

          <span className="text-[#2a2520]">
            Discounts
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">Offers</p>
            <h1 className="mt-1 text-[#2a2520]">
              Discounts
            </h1>

            <p className="mt-1 text-sm text-[#5f584d]">
              Manage discount coupons, offers and promotional codes.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Refresh */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:bg-[#f1ead9] disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* Create Discount */}
        <Link
          href="/admin/discounts/create"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#26221d] px-4 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#3d372f]"
        >
          <Plus size={17} />

          New Discount
        </Link>
      </div>
    </div>
  );
}