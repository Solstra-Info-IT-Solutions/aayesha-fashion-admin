"use client";

import { RefreshCw } from "lucide-react";

interface HomepageHeaderProps {
  onRefresh: () => void | Promise<void>;
  refreshing?: boolean;
}

export function HomepageHeader({
  onRefresh,
  refreshing = false,
}: HomepageHeaderProps) {
  return (
    <header>
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">
            Storefront CMS
          </p>

          <h1 className="mt-1 text-[#f8f3f1]">
            Homepage
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#cfc7bb]">
            Manage the content and presentation of your
            Aayesha Fashion homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:bg-[#2a241b] disabled:cursor-not-allowed disabled:opacity-50 rounded-lg"
        >
          <RefreshCw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>
    </header>
  );
}