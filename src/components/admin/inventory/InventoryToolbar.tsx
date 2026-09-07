import { Search, X } from "lucide-react";

import type {
  InventorySort,
  InventoryStatusFilter,
} from "@/types/inventory";

interface InventoryToolbarProps {
  search: string;
  status: InventoryStatusFilter;
  sort: InventorySort;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: InventoryStatusFilter) => void;
  onSortChange: (value: InventorySort) => void;
  onReset: () => void;
}

export default function InventoryToolbar({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onReset,
}: InventoryToolbarProps) {
  const hasFilters =
    search.trim() !== "" ||
    status !== "all" ||
    sort !== "newest";

  return (
    <div className="rounded-2xl border border-[#e7e2dd] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#969696]"
          />

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search product, SKU or variant..."
            className="h-10 w-full rounded-xl border border-[#d8d1ca] bg-white pl-10 pr-4 text-sm text-[#171717] outline-none transition placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as InventoryStatusFilter,
            )
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791]"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target.value as InventorySort,
            )
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="stock-low">Stock: Low to High</option>
          <option value="stock-high">Stock: High to Low</option>
          <option value="reserved-high">
            Reserved: High to Low
          </option>
          <option value="sku">SKU</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e7e2dd] px-3 text-sm font-medium text-[#6f706f] hover:bg-[#fcfbf9]"
          >
            <X size={15} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}