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
    <header className="border-b border-[#e3ded8] bg-white">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-6 lg:px-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a928b]">
            Storefront CMS
          </p>

          <h1 className="mt-1 font-serif text-3xl text-[#262321]">
            Homepage
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736e]">
            Manage the content and presentation of your
            Aayesha Fashion homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 border border-[#cfc8c1] bg-white px-4 text-xs font-medium uppercase tracking-[0.14em] text-[#393532] transition hover:border-[#9f1239] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-50"
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