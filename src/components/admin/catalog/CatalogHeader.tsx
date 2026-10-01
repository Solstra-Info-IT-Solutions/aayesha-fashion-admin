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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">
          Catalog
        </p>

        <h1 className="mt-1 text-[#2a2520]">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#756d62]">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {typeof total === "number" && (
          <span className="rounded-full border border-[#e6dfcf] bg-[#fffdf8] px-3 py-1.5 text-xs font-semibold text-[#5f584d]">
            {total} total
          </span>
        )}
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-3.5 py-2.5 text-sm font-medium text-[#3d372f] transition hover:bg-[#f7f2e7] disabled:cursor-not-allowed disabled:opacity-50"
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
          className="inline-flex items-center gap-2 rounded-lg bg-[#26221d] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3d372f]"
        >
          <Plus className="h-4 w-4" />

          {addLabel}
        </button>
      </div>
    </div>
  );
}