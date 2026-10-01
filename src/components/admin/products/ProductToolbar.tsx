"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";

import type { ProductListParams, ProductSort } from "@/types/admin-product";

interface ProductToolbarProps {
  categories?: Array<{ id: string; name: string }>;
  filters: ProductListParams;
  onChange: (filters: ProductListParams) => void;
  view: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;
}

const control =
  "h-11 w-full rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#9a9184] focus:border-[#b08d57] focus:ring-2 focus:ring-[#b08d57]/20";

const FACETS: Array<{ key: "isNew" | "isFeatured" | "isBestSeller"; label: string }> = [
  { key: "isNew", label: "New" },
  { key: "isFeatured", label: "Featured" },
  { key: "isBestSeller", label: "Best seller" },
];

export default function ProductToolbar({
  categories = [],
  filters,
  onChange,
  view,
  onViewChange,
}: ProductToolbarProps) {
  const [text, setText] = useState(filters.search ?? "");
  const [open, setOpen] = useState(false);
  const lastSent = useRef(filters.search ?? "");
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  });

  const update = (patch: Partial<ProductListParams>) => onChange({ ...filtersRef.current, ...patch, page: 1 });

  // Debounced search: one request after typing stops.
  useEffect(() => {
    if (text === lastSent.current) return;

    const timer = window.setTimeout(() => {
      lastSent.current = text;
      onChange({ ...filtersRef.current, search: text.trim() || undefined, page: 1 });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [text, onChange]);

  const facetsOn = FACETS.filter((facet) => filters[facet.key] === true).length;
  const advanced = Boolean(filters.categoryId || filters.inStockOnly || filters.sort !== "newest" || facetsOn);

  return (
    <div className="surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8275]" />

          <input
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Search by product name"
            aria-label="Search products"
            className={`${control} pl-10`}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57] lg:hidden"
        >
          <SlidersHorizontal size={15} />
          Filters{advanced ? " •" : ""}
        </button>

        <div className="inline-flex rounded-lg border border-[#d6ccb6] bg-[#fffdf8] p-0.5" role="group" aria-label="View">
          {(
            [
              ["table", List, "Table view"],
              ["grid", LayoutGrid, "Grid view"],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-pressed={view === key}
              onClick={() => onViewChange(key)}
              className={`flex h-10 w-10 items-center justify-center rounded-md transition ${
                view === key ? "bg-[#26221d] text-[#fffdf8]" : "text-[#5f584d] hover:text-[#2a2520]"
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div className={`${open ? "grid" : "hidden"} mt-3 gap-3 sm:grid-cols-3 lg:grid`}>
        <select
          value={filters.categoryId ?? ""}
          onChange={(event) => update({ categoryId: event.target.value || undefined })}
          aria-label="Category"
          className={control}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.inStockOnly ? "in-stock" : ""}
          onChange={(event) => update({ inStockOnly: event.target.value === "in-stock" ? true : undefined })}
          aria-label="Stock"
          className={control}
        >
          <option value="">All stock levels</option>
          <option value="in-stock">In stock only</option>
        </select>

        <select
          value={filters.sort ?? "newest"}
          onChange={(event) => update({ sort: event.target.value as ProductSort })}
          aria-label="Sort"
          className={control}
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="featured">Featured first</option>
          <option value="best-selling">Best selling</option>
        </select>
      </div>

      <div className={`${open ? "flex" : "hidden"} mt-3 flex-wrap items-center gap-2 lg:flex`}>
        <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#756d62]">Merchandising</span>

        {FACETS.map((facet) => {
          const on = filters[facet.key] === true;

          return (
            <button
              key={facet.key}
              type="button"
              aria-pressed={on}
              onClick={() => update({ [facet.key]: on ? undefined : true })}
              className={`h-8 rounded-full border px-3.5 text-xs font-semibold transition ${
                on
                  ? "border-[#26221d] bg-[#26221d] text-[#fffdf8]"
                  : "border-[#d6ccb6] bg-[#fffdf8] text-[#5f584d] hover:border-[#b08d57]"
              }`}
            >
              {facet.label}
            </button>
          );
        })}

        {advanced || filters.search || filters.status ? (
          <button
            type="button"
            onClick={() => {
              lastSent.current = "";
              setText("");
              onChange({ page: 1, limit: filters.limit ?? 25, sort: "newest" });
            }}
            className="ml-auto h-8 rounded-lg px-3 text-sm font-semibold text-[#8a6a3b] hover:bg-[#f1ead9]"
          >
            Reset all
          </button>
        ) : null}
      </div>
    </div>
  );
}
