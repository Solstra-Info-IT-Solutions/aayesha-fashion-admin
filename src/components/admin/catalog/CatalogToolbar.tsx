"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (searchInput.trim() === search) return;
    const timer = setTimeout(onSearch, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search, onSearch]);

  return (
    <div className="rounded-[14px] border border-[#3a352f] bg-[#1a1816] p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex min-w-0 flex-1 gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />

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
              placeholder="Search by name or identifier"
              className="h-11 w-full rounded-lg border border-[#3a352f] bg-[#1a1816] pl-9 pr-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#9a9185]"
            />
          </div>


          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-[#3a352f] px-3.5 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#111111]"
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
              className="h-11 min-w-[145px] appearance-none rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 pr-9 text-sm text-[#e6dfd4] outline-none focus:border-[#9a9185]"
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

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(event) =>
                onSortChange(
                  event.target.value as CatalogSort,
                )
              }
              className="h-11 min-w-[155px] appearance-none rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 pr-9 text-sm text-[#e6dfd4] outline-none focus:border-[#9a9185]"
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

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
          </div>
        </div>
      </div>
    </div>
  );
}