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
    <header className="border-b border-[#e6ddd4] bg-[#fbf9f5]">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#958781]">
            Storefront CMS
          </p>

          <h1 className="mt-1 font-serif text-3xl text-[#3f2d2a]">
            Homepage
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70635d]">
            Manage the content and presentation of your
            Aayesha Fashion homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 border border-[#d8cec5] bg-[#fbf9f5] px-4 text-xs font-medium uppercase tracking-[0.14em] text-[#3f2d2a] transition hover:border-[#7a5650] hover:text-[#7a5650] disabled:cursor-not-allowed disabled:opacity-50"
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