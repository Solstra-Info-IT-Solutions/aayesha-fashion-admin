"use client";

import type {
  ProductListParams,
  ProductSort,
  ProductStatus,
} from "@/types/admin-product";

interface ProductToolbarProps {
  filters: ProductListParams;
  onChange: (
    filters: ProductListParams,
  ) => void;
}

const statuses: Array<{
  value: ProductStatus;
  label: string;
}> = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "archived",
    label: "Archived",
  },
  {
    value: "discontinued",
    label: "Discontinued",
  },
];

export default function ProductToolbar({
  filters,
  onChange,
}: ProductToolbarProps) {
  const update = (
    patch: Partial<ProductListParams>,
  ) => {
    onChange({
      ...filters,
      ...patch,
      page: 1,
    });
  };

  return (
    <div className="rounded-2xl border border-[#e7e2dd] bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[1.7fr_repeat(5,1fr)]">
        {/* SEARCH */}
        <input
          value={filters.search ?? ""}
          onChange={(event) =>
            update({
              search:
                event.target.value,
            })
          }
          placeholder="Search products..."
          className="h-10 rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
        />

        {/* STATUS */}
        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            update({
              status: event.target.value
                ? (event.target.value as ProductStatus)
                : undefined,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="">
            All Status
          </option>

          {statuses.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>

        {/* CATEGORY */}
        <input
          value={filters.categoryId ?? ""}
          onChange={(event) =>
            update({
              categoryId:
                event.target.value ||
                undefined,
            })
          }
          placeholder="Category ID"
          className="h-10 rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
        />

        {/* STOCK */}
        <select
          value={
            filters.inStockOnly
              ? "in-stock"
              : ""
          }
          onChange={(event) =>
            update({
              inStockOnly:
                event.target.value ===
                "in-stock"
                  ? true
                  : undefined,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="">
            All Stock
          </option>

          <option value="in-stock">
            In Stock
          </option>
        </select>

        {/* SORT */}
        <select
          value={
            filters.sort ?? "newest"
          }
          onChange={(event) =>
            update({
              sort:
                event.target
                  .value as ProductSort,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="featured">
            Featured
          </option>

          <option value="best-selling">
            Best Selling
          </option>
        </select>

        {/* MERCHANDISING */}
        <div className="flex min-w-0 gap-2">
          <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#d8d1ca] px-3 text-xs text-[#292c2c]">
            <input
              type="checkbox"
              checked={
                filters.isNew === true
              }
              onChange={(event) =>
                update({
                  isNew: event.target
                    .checked
                    ? true
                    : undefined,
                })
              }
              className="h-4 w-4 accent-[#171717]"
            />
            <span>New</span>
          </label>

          <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#d8d1ca] px-3 text-xs text-[#292c2c]">
            <input
              type="checkbox"
              checked={
                filters.isFeatured ===
                true
              }
              onChange={(event) =>
                update({
                  isFeatured:
                    event.target.checked
                      ? true
                      : undefined,
                })
              }
              className="h-4 w-4 accent-[#171717]"
            />
            <span>Featured</span>
          </label>

          <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#d8d1ca] px-3 text-xs text-[#292c2c]">
            <input
              type="checkbox"
              checked={
                filters.isBestSeller ===
                true
              }
              onChange={(event) =>
                update({
                  isBestSeller:
                    event.target.checked
                      ? true
                      : undefined,
                })
              }
              className="h-4 w-4 accent-[#171717]"
            />
            <span>Best</span>
          </label>
        </div>
      </div>
    </div>
  );
}