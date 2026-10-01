"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Archive, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import type { Product } from "@/types/admin-product";

import ProductStatusBadge from "./ProductStatusBadge";

interface ProductTableProps {
  /** category id -> display name */
  categoryNames?: Map<string, string>;
  products: Product[];
  loading: boolean;
  view?: "table" | "grid";
  onArchive: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function primaryImage(product: Product): string {
  return (
    product.media?.find((media) => media.type === "image" && media.isPrimary)?.src ??
    product.media?.find((media) => media.type === "image")?.src ??
    ""
  );
}

const available = (product: Product) =>
  Math.max((product.inventory?.stock ?? 0) - (product.inventory?.reserved ?? 0), 0);

const discount = (product: Product) => {
  const mrp = product.pricing?.mrp ?? 0;
  const price = product.pricing?.sellingPrice ?? 0;

  return mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
};

const categoryOf = (product: Product, names?: Map<string, string>) =>
  (product.categoryId && names?.get(product.categoryId)) || product.categoryId || "—";

/** Thumbnail that falls back to a placeholder if the image cannot load. */
function Thumb({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative shrink-0 overflow-hidden bg-[#f1ead9] ${className}`}>
      {!src || failed ? (
        <div className="flex h-full items-center justify-center px-1 text-center text-[10px] font-semibold uppercase tracking-wide text-[#8a6a3b]">
          No image
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          // Hosted externally (Cloudinary); load directly rather than via the Next optimiser.
          unoptimized
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}

function StockPill({ product }: { product: Product }) {
  const stock = available(product);
  const low = product.inventory?.lowStockThreshold ?? 2;

  const tone =
    stock <= 0
      ? "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]"
      : stock <= low
        ? "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]"
        : "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]";

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      {stock <= 0 ? "Out of stock" : stock <= low ? `Low · ${stock} left` : `${stock} in stock`}
    </span>
  );
}

function Tags({ product }: { product: Product }) {
  const tags = [
    product.merchandising?.isNew ? "New" : "",
    product.merchandising?.isFeatured ? "Featured" : "",
    product.merchandising?.isBestSeller ? "Best seller" : "",
  ].filter(Boolean);

  return tags.length ? (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-[#f1ead9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6f542f]">
          {tag}
        </span>
      ))}
    </div>
  ) : null;
}

function RowMenu({ product, onArchive, onDelete }: Pick<ProductTableProps, "onArchive" | "onDelete"> & { product: Product }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`More actions for ${product.name}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d6ccb6] bg-[#fffdf8] text-[#5f584d] transition hover:border-[#b08d57] hover:text-[#2a2520]"
      >
        <MoreHorizontal size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-[#e6dfcf] bg-[#fffdf8] py-1 shadow-xl">
          {product.status !== "archived" ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onArchive(product);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#2a2520] hover:bg-[#f7f2e7]"
            >
              <Archive size={15} className="text-[#8a6a3b]" /> Archive
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(product);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#b3261e] hover:bg-[#fdecec]"
          >
            <Trash2 size={15} /> Delete permanently
          </button>
        </div>
      ) : null}
    </div>
  );
}

const editHref = (product: Product) => `/admin/products/${encodeURIComponent(product.id)}`;

export default function ProductTable({
  categoryNames,
  products,
  loading,
  view = "table",
  onArchive,
  onDelete,
}: ProductTableProps) {
  if (loading && products.length === 0) {
    return (
      <div className="surface space-y-2 p-4" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-xl bg-[#efe8d8]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  const dim = loading ? "opacity-60" : "";

  /* ---------------- Grid (gallery) ---------------- */
  if (view === "grid") {
    return (
      <ul className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 xl:grid-cols-4 ${dim}`}>
        {products.map((product) => (
          <li key={product.id} className="surface surface-hover group relative overflow-hidden">
            <Link href={editHref(product)} className="block">
              <Thumb src={primaryImage(product)} alt={product.name} sizes="(max-width: 768px) 50vw, 25vw" className="aspect-[4/5] w-full" />

              <div className="p-3.5">
                <p className="line-clamp-1 text-sm font-semibold text-[#2a2520]">{product.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-[#756d62]">{categoryOf(product, categoryNames)}</p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-[#2a2520]">{money(product.pricing?.sellingPrice ?? 0)}</span>

                  {discount(product) > 0 ? (
                    <>
                      <span className="text-xs text-[#756d62] line-through">{money(product.pricing.mrp)}</span>
                      <span className="text-xs font-bold text-[#2f7d4f]">{discount(product)}% off</span>
                    </>
                  ) : null}
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <ProductStatusBadge status={product.status} />
                  <StockPill product={product} />
                </div>
              </div>
            </Link>

            <div className="absolute right-2.5 top-2.5">
              <RowMenu product={product} onArchive={onArchive} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  /* ---------------- Table ---------------- */
  return (
    <div className={`transition-opacity ${dim}`}>
      <div className="surface hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]">
                {["Product", "Category", "Price", "Stock", "Status", ""].map((heading, index) => (
                  <th key={`${heading}-${index}`} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#756d62]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e6dfcf]">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-[#faf6ec]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <Thumb src={primaryImage(product)} alt={product.name} sizes="56px" className="h-[68px] w-14 rounded-lg border border-[#e6dfcf]" />

                      <div className="min-w-0">
                        <Link href={editHref(product)} title={product.name} className="block max-w-[280px] truncate text-sm font-semibold text-[#2a2520] transition-colors hover:text-[#8a6a3b]">
                          {product.name}
                        </Link>

                        <p title={product.slug} className="mt-0.5 max-w-[280px] truncate text-xs text-[#756d62]">
                          {product.slug}
                        </p>

                        <Tags product={product} />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-block max-w-[170px] truncate rounded-full bg-[#efe8d8] px-3 py-1 text-xs font-semibold text-[#5f584d]">
                      {categoryOf(product, categoryNames)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-[#2a2520]">{money(product.pricing?.sellingPrice ?? 0)}</p>

                    {discount(product) > 0 ? (
                      <p className="mt-0.5 text-xs">
                        <span className="text-[#756d62] line-through">{money(product.pricing.mrp)}</span>{" "}
                        <span className="font-bold text-[#2f7d4f]">{discount(product)}% off</span>
                      </p>
                    ) : null}
                  </td>

                  <td className="px-5 py-4">
                    <StockPill product={product} />
                  </td>

                  <td className="px-5 py-4">
                    <ProductStatusBadge status={product.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={editHref(product)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-3.5 text-xs font-semibold text-[#2a2520] transition hover:border-[#26221d] hover:bg-[#26221d] hover:text-[#fffdf8]"
                      >
                        <Pencil size={13} /> Edit
                      </Link>

                      <RowMenu product={product} onArchive={onArchive} onDelete={onDelete} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phones: cards */}
      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li key={product.id} className="surface relative p-3.5">
            <div className="flex gap-3.5">
              <Link href={editHref(product)} className="shrink-0">
                <Thumb src={primaryImage(product)} alt={product.name} sizes="80px" className="h-24 w-20 rounded-lg border border-[#e6dfcf]" />
              </Link>

              <div className="min-w-0 flex-1 pr-10">
                <Link href={editHref(product)} className="line-clamp-2 text-sm font-semibold text-[#2a2520]">
                  {product.name}
                </Link>

                <p className="mt-0.5 truncate text-xs text-[#756d62]">{categoryOf(product, categoryNames)}</p>

                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-base font-bold text-[#2a2520]">{money(product.pricing?.sellingPrice ?? 0)}</span>

                  {discount(product) > 0 ? (
                    <span className="text-xs font-bold text-[#2f7d4f]">{discount(product)}% off</span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <ProductStatusBadge status={product.status} />
                  <StockPill product={product} />
                </div>
              </div>
            </div>

            <div className="absolute right-3 top-3">
              <RowMenu product={product} onArchive={onArchive} onDelete={onDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
