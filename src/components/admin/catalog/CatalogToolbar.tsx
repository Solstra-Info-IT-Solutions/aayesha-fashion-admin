"use client";

import {
  ChevronDown,
  Search,
  X,
} from "lucide-react";

import type {
  CatalogSort,
  CatalogStatusFilter,
} from "@/types/catalog";

type Props = {
  searchInput: string;
  search: string;
  isActive: CatalogStatusFilter;
  sort: CatalogSort;
  onSearchInputChange: (
    value: string,
  ) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onStatusChange: (
    value: CatalogStatusFilter,
  ) => void;
  onSortChange: (
    value: CatalogSort,
  ) => void;
};

export default function CatalogToolbar({
  searchInput,
  search,
  isActive,
  sort,
  onSearchInputChange,
  onSearch,
  onClearSearch,
  onStatusChange,
  onSortChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex min-w-0 flex-1 gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

            <input
              value={searchInput}
              onChange={(event) =>
                onSearchInputChange(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  onSearch();
                }
              }}
              placeholder="Search..."
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="h-11 shrink-0 rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Search
          </button>

          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-neutral-200 px-3.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              value={isActive}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as CatalogStatusFilter,
                )
              }
              className="h-11 min-w-[145px] appearance-none rounded-xl border border-neutral-200 bg-white px-3 pr-9 text-sm text-neutral-700 outline-none focus:border-neutral-400"
            >
              <option value="all">
                All Status
              </option>

              <option value="true">
                Active
              </option>

              <option value="false">
                Inactive
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(event) =>
                onSortChange(
                  event.target.value as CatalogSort,
                )
              }
              className="h-11 min-w-[155px] appearance-none rounded-xl border border-neutral-200 bg-white px-3 pr-9 text-sm text-neutral-700 outline-none focus:border-neutral-400"
            >
              <option value="sort_order">
                Sort Order
              </option>

              <option value="name">
                Name
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}