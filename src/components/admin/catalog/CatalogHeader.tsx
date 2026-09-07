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
  onRefresh: () => void;
  onAdd: () => void;
};

export default function CatalogHeader({
  title,
  description,
  addLabel,
  loading,
  onRefresh,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm text-neutral-500">
          Catalog / {title}
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" />

          {addLabel}
        </button>
      </div>
    </div>
  );
}