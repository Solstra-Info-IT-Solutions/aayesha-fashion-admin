"use client";

import type {
  ProductCategory,
  ProductType,
} from "@/types/admin-product";

interface ProductBasicSectionProps {
  name: string;
  slug: string;
  productType: ProductType;
  category: ProductCategory;
  subcategory: string;
  tags: string[];
  onChange: (
    values: {
      name?: string;
      slug?: string;
      productType?: ProductType;
      category?: ProductCategory;
      subcategory?: string;
      tags?: string[];
    },
  ) => void;
}

const productTypes: Array<
  [ProductType, string]
> = [
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
];

const categories: Array<
  [ProductCategory, string]
> = [
  ["festive", "Festive"],
  ["ethnic", "Ethnic"],
  [
    "contemporary",
    "Contemporary",
  ],
  [
    "new-arrival",
    "New Arrival",
  ],
];

export default function ProductBasicSection({
  name,
  slug,
  productType,
  category,
  subcategory,
  tags,
  onChange,
}: ProductBasicSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <div>
        <h2 className="text-base font-semibold text-[#171717]">
          Product Basics
        </h2>

        <p className="mt-1 text-sm text-[#6f706f]">
          Core product identity and
          catalog information.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Product Name
          </span>

          <input
            value={name}
            onChange={(event) =>
              onChange({
                name: event.target
                  .value,
              })
            }
            placeholder="Rose Garden Anarkali"
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Slug
          </span>

          <input
            value={slug}
            onChange={(event) =>
              onChange({
                slug: event.target
                  .value
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9-]/g,
                    "-",
                  )
                  .replace(
                    /-+/g,
                    "-",
                  ),
              })
            }
            placeholder="rose-garden-anarkali"
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Product Type
          </span>

          <select
            value={productType}
            onChange={(event) =>
              onChange({
                productType:
                  event.target
                    .value as ProductType,
              })
            }
            className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
          >
            {productTypes.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Category
          </span>

          <select
            value={category}
            onChange={(event) =>
              onChange({
                category:
                  event.target
                    .value as ProductCategory,
              })
            }
            className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
          >
            {categories.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Subcategory
          </span>

          <input
            value={subcategory}
            onChange={(event) =>
              onChange({
                subcategory:
                  event.target
                    .value,
              })
            }
            placeholder="Optional"
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Tags
          </span>

          <input
            value={tags.join(", ")}
            onChange={(event) =>
              onChange({
                tags:
                  event.target.value
                    .split(",")
                    .map(
                      (item) =>
                        item.trim(),
                    )
                    .filter(Boolean),
              })
            }
            placeholder="anarkali, festive, embroidered"
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
          />

          <p className="mt-1.5 text-xs text-[#969696]">
            Separate tags using commas.
          </p>
        </label>
      </div>
    </section>
  );
}