"use client";

import type {
  ProductCategory,
  ProductListParams,
  ProductSort,
  ProductStatus,
  ProductType,
} from "@/types/admin-product";

interface ProductToolbarProps {
  filters: ProductListParams;
  onChange: (
    filters: ProductListParams,
  ) => void;
}

const categories: Array<{
  value: ProductCategory;
  label: string;
}> = [
  {
    value: "festive",
    label: "Festive",
  },
  {
    value: "ethnic",
    label: "Ethnic",
  },
  {
    value: "contemporary",
    label: "Contemporary",
  },
  {
    value: "new-arrival",
    label: "New Arrival",
  },
];

const types: Array<{
  value: ProductType;
  label: string;
}> = [
  ["anarkali", "Anarkali"],
  ["kurta", "Kurta"],
  ["kurta-set", "Kurta Set"],
  ["suit-set", "Suit Set"],
  ["lehenga", "Lehenga"],
  ["saree", "Saree"],
  ["dress", "Dress"],
  ["top", "Top"],
  ["bottom", "Bottom"],
  ["co-ord", "Co-ord"],
  ["jacket", "Jacket"],
  ["dupatta", "Dupatta"],
  ["other", "Other"],
].map(
  ([value, label]) => ({
    value: value as ProductType,
    label,
  }),
);

const statuses: Array<{
  value: ProductStatus;
  label: string;
}> = [
  ["draft", "Draft"],
  ["active", "Active"],
  ["archived", "Archived"],
  [
    "discontinued",
    "Discontinued",
  ],
].map(
  ([value, label]) => ({
    value: value as ProductStatus,
    label,
  }),
);

export default function ProductToolbar({
  filters,
  onChange,
}: ProductToolbarProps) {
  const update =
    (
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
      <div className="grid gap-3 lg:grid-cols-[1.7fr_repeat(4,1fr)]">
        <input
          value={
            filters.search ?? ""
          }
          onChange={(event) =>
            update({
              search:
                event.target.value,
            })
          }
          placeholder="Search products..."
          className="h-10 rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
        />

        <select
          value={
            filters.status ?? ""
          }
          onChange={(event) =>
            update({
              status:
                event.target
                  .value
                  ? (event.target
                      .value as ProductStatus)
                  : undefined,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="">
            All Status
          </option>

          {statuses.map(
            (status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ),
          )}
        </select>

        <select
          value={
            filters.category ?? ""
          }
          onChange={(event) =>
            update({
              category:
                event.target
                  .value
                  ? (event.target
                      .value as ProductCategory)
                  : undefined,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="">
            All Categories
          </option>

          {categories.map(
            (category) => (
              <option
                key={
                  category.value
                }
                value={
                  category.value
                }
              >
                {category.label}
              </option>
            ),
          )}
        </select>

        <select
          value={
            filters.productType ??
            ""
          }
          onChange={(event) =>
            update({
              productType:
                event.target
                  .value
                  ? (event.target
                      .value as ProductType)
                  : undefined,
            })
          }
          className="h-10 rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
        >
          <option value="">
            All Types
          </option>

          {types.map((type) => (
            <option
              key={type.value}
              value={type.value}
            >
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={
            filters.sort ??
            "newest"
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
          <option value="rating">
            Rating
          </option>
          <option value="best-selling">
            Best Selling
          </option>
          <option value="featured">
            Featured
          </option>
        </select>
      </div>
    </div>
  );
}