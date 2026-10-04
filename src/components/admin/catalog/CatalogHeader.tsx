"use client";

import {
  Plus,
  RefreshCw,
} from "lucide-react";

type Props = {
  title: string;
  description: string;
  addLabel: string;
  loading: boolean;
  total?: number;
  onRefresh: () => void;
  onAdd: () => void;
};

export default function CatalogHeader({
  title,
  description,
  addLabel,
  loading,
  total,
  onRefresh,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">
          Catalog
        </p>

        <h1 className="mt-1 text-[#f8f3f1]">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#9a9185]">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {typeof total === "number" && (
          <span className="rounded-full border border-[#2e2a26] bg-[#1a1816] px-3 py-1.5 text-xs font-semibold text-[#cfc7bb]">
            {total} total
          </span>
        )}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-3.5 py-2.5 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={
              loading
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          Refresh
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#b79a6a] px-4 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f]"
        >
          <Plus className="h-4 w-4" />

          {addLabel}
        </button>
      </div>
    </div>
  );
}