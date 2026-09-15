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

const inputClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]";

const selectClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]";

const labelClassName =
  "mb-1.5 block break-words text-sm font-medium leading-5 text-[#292c2c]";

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
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
          Product Basics
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#6f706f]">
          Core product identity and
          catalog information.
        </p>
      </div>

      {/* FORM */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {/* PRODUCT NAME */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Product Name
          </span>

          <input
            value={name}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
            placeholder="Rose Garden Anarkali"
            className={inputClassName}
          />
        </label>

        {/* SLUG */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Slug
          </span>

          <input
            value={slug}
            onChange={(event) =>
              onChange({
                slug: event.target.value
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
            className={`${inputClassName} overflow-hidden text-ellipsis`}
          />
        </label>

        {/* PRODUCT TYPE */}
        <label className="block min-w-0">
          <span className={labelClassName}>
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
            className={selectClassName}
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

        {/* CATEGORY */}
        <label className="block min-w-0">
          <span className={labelClassName}>
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
            className={selectClassName}
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

        {/* SUBCATEGORY */}
        <label className="block min-w-0 md:col-span-2">
          <span className={labelClassName}>
            Subcategory
          </span>

          <input
            value={subcategory}
            onChange={(event) =>
              onChange({
                subcategory:
                  event.target.value,
              })
            }
            placeholder="Optional"
            className={inputClassName}
          />
        </label>

        {/* TAGS */}
        <label className="block min-w-0 md:col-span-2">
          <span className={labelClassName}>
            Tags
          </span>

          <input
            value={tags.join(", ")}
            onChange={(event) =>
              onChange({
                tags: event.target.value
                  .split(",")
                  .map(
                    (item) =>
                      item.trim(),
                  )
                  .filter(Boolean),
              })
            }
            placeholder="anarkali, festive, embroidered"
            className={inputClassName}
          />

          <p className="mt-1.5 max-w-full break-words text-xs leading-5 text-[#969696]">
            Separate tags using commas.
          </p>
        </label>
      </div>
    </section>
  );
}