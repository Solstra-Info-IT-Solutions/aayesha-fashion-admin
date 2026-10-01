"use client";

import type {
  ProductListParams,
  ProductSort,
  ProductStatus,
} from "@/types/admin-product";

interface ProductToolbarProps {
  categories?: Array<{ id: string; name: string }>;
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
  categories = [],
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
    <div className="w-full rounded-2xl border border-[#e5e7ec] bg-[#ffffff] p-3 sm:p-4">
      {/* =====================================================
          FILTER GRID
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-4
          xl:grid-cols-[1.7fr_1fr_1.2fr_1fr_1.25fr]
        "
      >
        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="relative sm:col-span-2 lg:col-span-4 xl:col-span-1">
          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(event) =>
              update({
                search:
                  event.target.value,
              })
            }
            placeholder="Search products..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-[#d3d7df]
              bg-[#ffffff]
              px-3.5
              text-sm
              text-[#0f172a]
              placeholder:text-[#737a8c]
              outline-none
              transition
              focus:border-[#818cf8]
              focus:ring-4
              focus:ring-[#eef2ff]
            "
          />
        </div>

        {/* ===================================================
            STATUS
        =================================================== */}

        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            update({
              status: event.target
                .value
                ? (event.target
                    .value as ProductStatus)
                : undefined,
            })
          }
          className="
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-[#d3d7df]
            bg-[#ffffff]
            px-3.5
            text-sm
            text-[#0f172a]
            outline-none
            transition
            focus:border-[#818cf8]
            focus:ring-4
            focus:ring-[#eef2ff]
          "
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

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <select
          value={filters.categoryId ?? ""}
          onChange={(event) =>
            update({
              categoryId:
                event.target.value ||
                undefined,
            })
          }
          aria-label="Category"
          className="
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-[#d3d7df]
            bg-[#ffffff]
            px-3.5
            text-sm
            text-[#0f172a]
            placeholder:text-[#737a8c]
            outline-none
            transition
            focus:border-[#818cf8]
            focus:ring-4
            focus:ring-[#eef2ff]
          "
        >
          <option value="">All categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* ===================================================
            STOCK
        =================================================== */}

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
          className="
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-[#d3d7df]
            bg-[#ffffff]
            px-3.5
            text-sm
            text-[#0f172a]
            outline-none
            transition
            focus:border-[#818cf8]
            focus:ring-4
            focus:ring-[#eef2ff]
          "
        >
          <option value="">
            All Stock
          </option>

          <option value="in-stock">
            In Stock
          </option>
        </select>

        {/* ===================================================
            SORT
        =================================================== */}

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
          className="
            h-11
            w-full
            min-w-0
            rounded-xl
            border
            border-[#d3d7df]
            bg-[#ffffff]
            px-3.5
            text-sm
            text-[#0f172a]
            outline-none
            transition
            focus:border-[#818cf8]
            focus:ring-4
            focus:ring-[#eef2ff]
          "
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
      </div>

      {/* =====================================================
          MERCHANDISING FILTERS
      ===================================================== */}

      <div className="mt-3 border-t border-[#e5e7ec] pt-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* LABEL */}

          <div className="shrink-0">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-[#737a8c]">
              Quick Filters
            </span>
          </div>

          {/* OPTIONS */}

          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
            {/* NEW */}

            <label
              className={`
                flex
                min-w-0
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-3
                py-2.5
                text-xs
                font-medium
                transition
                ${
                  filters.isNew === true
                    ? "border-[#818cf8] bg-[#eef2ff] text-[#3730a3]"
                    : "border-[#d3d7df] bg-[#ffffff] text-[#5b6270] hover:border-[#737a8c] hover:bg-[#f6f7fb]"
                }
              `}
            >
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
                className="
                  h-4
                  w-4
                  shrink-0
                  cursor-pointer
                  accent-[#818cf8]
                "
              />

              <span className="truncate">
                New
              </span>
            </label>

            {/* FEATURED */}

            <label
              className={`
                flex
                min-w-0
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-3
                py-2.5
                text-xs
                font-medium
                transition
                ${
                  filters.isFeatured ===
                  true
                    ? "border-[#818cf8] bg-[#eef2ff] text-[#3730a3]"
                    : "border-[#d3d7df] bg-[#ffffff] text-[#5b6270] hover:border-[#737a8c] hover:bg-[#f6f7fb]"
                }
              `}
            >
              <input
                type="checkbox"
                checked={
                  filters.isFeatured ===
                  true
                }
                onChange={(event) =>
                  update({
                    isFeatured:
                      event.target
                        .checked
                        ? true
                        : undefined,
                  })
                }
                className="
                  h-4
                  w-4
                  shrink-0
                  cursor-pointer
                  accent-[#818cf8]
                "
              />

              <span className="truncate">
                Featured
              </span>
            </label>

            {/* BEST SELLER */}

            <label
              className={`
                flex
                min-w-0
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-3
                py-2.5
                text-xs
                font-medium
                transition
                ${
                  filters.isBestSeller ===
                  true
                    ? "border-[#818cf8] bg-[#eef2ff] text-[#3730a3]"
                    : "border-[#d3d7df] bg-[#ffffff] text-[#5b6270] hover:border-[#737a8c] hover:bg-[#f6f7fb]"
                }
              `}
            >
              <input
                type="checkbox"
                checked={
                  filters.isBestSeller ===
                  true
                }
                onChange={(event) =>
                  update({
                    isBestSeller:
                      event.target
                        .checked
                        ? true
                        : undefined,
                  })
                }
                className="
                  h-4
                  w-4
                  shrink-0
                  cursor-pointer
                  accent-[#818cf8]
                "
              />

              <span className="truncate">
                Best Seller
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}