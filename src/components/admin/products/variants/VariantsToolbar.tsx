"use client";

import { Search } from "lucide-react";

interface VariantsToolbarProps {
  search: string;
  status: string;
  onSearchChange: (
    value: string,
  ) => void;
  onStatusChange: (
    value: string,
  ) => void;
}

export default function VariantsToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: VariantsToolbarProps) {
  return (
    <div className="rounded-2xl border border-[#e7e2dd] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#969696]"
          />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Search SKU, size or color..."
            className="h-10 w-full rounded-xl border border-[#d8d1ca] bg-white pl-10 pr-4 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value,
            )
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791]"
        >
          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>

          <option value="discontinued">
            Discontinued
          </option>
        </select>
      </div>
    </div>
  );
}