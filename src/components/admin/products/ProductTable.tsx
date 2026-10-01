"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Archive,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Product,
} from "@/types/admin-product";

import ProductStatusBadge from "./ProductStatusBadge";

interface ProductTableProps {
  /** category id -> display name */
  categoryNames?: Map<string, string>;
  products: Product[];
  loading: boolean;

  onArchive: (
    product: Product,
  ) => void;

  onDelete: (
    product: Product,
  ) => void;
}

/** Thumbnail that falls back to a placeholder if the image cannot load. */
function ProductThumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#737a8c]">
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="48px"
      // Product media is hosted externally (Cloudinary); load it directly
      // instead of through the Next.js optimiser, which needs every host
      // whitelisted.
      unoptimized
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}

function getPrimaryImage(
  product: Product,
): string {
  return (
    product.media?.find(
      (media) =>
        media.type === "image" &&
        media.isPrimary,
    )?.src ??
    product.media?.find(
      (media) =>
        media.type === "image",
    )?.src ??
    ""
  );
}

function getProductPrice(
  product: Product,
): number {
  return (
    product.pricing?.sellingPrice ??
    0
  );
}

function getProductStock(
  product: Product,
): number {
  const stock =
    product.inventory?.stock ?? 0;

  const reserved =
    product.inventory?.reserved ?? 0;

  return Math.max(
    stock - reserved,
    0,
  );
}

function getStockLabel(
  product: Product,
): string {
  const available =
    getProductStock(product);

  if (available <= 0) {
    return "Out of stock";
  }

  return `${available} in stock`;
}

export default function ProductTable({
  categoryNames,
  products,
  loading,
  onArchive,
  onDelete,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e5e7ec] bg-[#ffffff]">
        <div className="space-y-2 p-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-[#eef0f4]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5e7ec] bg-[#ffffff] px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f5f7]">
          <Trash2
            size={20}
            className="text-[#737a8c]"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#1a1d24]">
          No products found
        </h3>

        <p className="mt-1 text-xs text-[#737a8c]">
          Try changing your filters or
          add a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7ec] bg-[#ffffff]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-[#e5e7ec] bg-[#f4f5f7]">
            <tr className="text-xs uppercase tracking-[0.1em] text-[#737a8c]">
              <th className="px-5 py-4 font-medium">
                Product
              </th>

              <th className="px-5 py-4 font-medium">
                Category
              </th>

              <th className="px-5 py-4 font-medium">
                Price
              </th>

              <th className="px-5 py-4 font-medium">
                Stock
              </th>

              <th className="px-5 py-4 font-medium">
                Status
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5e7ec]">
            {products.map(
              (product) => {
                const image =
                  getPrimaryImage(
                    product,
                  );

                const price =
                  getProductPrice(
                    product,
                  );

                const stock =
                  getProductStock(
                    product,
                  );

                const lowStockThreshold =
                  product.inventory
                    ?.lowStockThreshold ??
                  2;

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-[#f4f5f7]"
                  >
                    {/* =================================================
                        PRODUCT
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e5e7ec] bg-[#eef0f4]">
                          <ProductThumb
                            key={image}
                            src={image}
                            alt={product.name}
                          />
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              product.id,
                            )}`}
                            className="block max-w-[260px] truncate text-sm font-semibold text-[#1a1d24] transition-colors hover:text-[#7d8aa6]"
                            title={
                              product.name
                            }
                          >
                            {
                              product.name
                            }
                          </Link>

                          <p
                            className="mt-0.5 max-w-[260px] truncate text-xs text-[#737a8c]"
                            title={
                              product.slug
                            }
                          >
                            {
                              product.slug
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* =================================================
                        CATEGORY
                    ================================================= */}

                    <td className="px-5 py-4 text-sm text-[#5b6270]">
                      <span className="inline-block max-w-[160px] truncate">
                        {(product.categoryId &&
                          categoryNames?.get(product.categoryId)) ||
                          product.categoryId ||
                          "—"}
                      </span>
                    </td>

                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-[#1a1d24]">
                        ₹
                        {price.toLocaleString(
                          "en-IN",
                        )}
                      </div>

                      {product.pricing
                        ?.mrp >
                        price && (
                        <div className="mt-0.5 text-xs text-[#737a8c] line-through">
                          ₹
                          {product.pricing.mrp.toLocaleString(
                            "en-IN",
                          )}
                        </div>
                      )}
                    </td>

                    {/* =================================================
                        STOCK
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div
                        className={`text-sm font-semibold ${
                          stock <= 0
                            ? "text-[#b3261e]"
                            : stock <=
                                lowStockThreshold
                              ? "text-[#a15c07]"
                              : "text-[#1a1d24]"
                        }`}
                      >
                        {stock}
                      </div>

                      <p className="mt-0.5 text-xs text-[#737a8c]">
                        {getStockLabel(
                          product,
                        )}
                      </p>
                    </td>

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <td className="px-5 py-4">
                      <ProductStatusBadge
                        status={
                          product.status
                        }
                      />
                    </td>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* EDIT */}

                        <Link
                          href={`/admin/products/${encodeURIComponent(
                            product.id,
                          )}`}
                          className="
                            inline-flex
                            h-9
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-[#d3d7df]
                            bg-[#ffffff]
                            px-3
                            text-xs
                            font-medium
                            text-[#1a1d24]
                            transition
                            hover:border-[#737a8c]
                            hover:bg-[#f4f5f7]
                          "
                        >
                          <Pencil
                            size={13}
                          />

                          <span>
                            Edit
                          </span>
                        </Link>

                        {/* ARCHIVE */}

                        {product.status !==
                          "archived" && (
                          <button
                            type="button"
                            onClick={() =>
                              onArchive(
                                product,
                              )
                            }
                            className="
                              inline-flex
                              h-9
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-[#fdecec]
                              bg-[#ffffff]
                              px-3
                              text-xs
                              font-medium
                              text-[#b3261e]
                              transition
                              hover:bg-[#fdecec]
                            "
                          >
                            <Archive
                              size={13}
                            />

                            <span>
                              Archive
                            </span>
                          </button>
                        )}

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              product,
                            )
                          }
                          className="
                            inline-flex
                            h-9
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-[#fdecec]
                            bg-[#fdecec]
                            px-3
                            text-xs
                            font-medium
                            text-[#b3261e]
                            transition
                            hover:border-[#fdecec]
                            hover:bg-[#1e2a40]
                          "
                          title="Permanently delete product"
                        >
                          <Trash2
                            size={13}
                          />

                          <span>
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}