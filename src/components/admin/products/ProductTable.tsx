"use client";

import Image from "next/image";
import Link from "next/link";

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
  products: Product[];
  loading: boolean;

  onArchive: (
    product: Product,
  ) => void;

  onDelete: (
    product: Product,
  ) => void;
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
  products,
  loading,
  onArchive,
  onDelete,
}: ProductTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5]">
        <div className="space-y-2 p-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-[#efe8df]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5] px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f3ed]">
          <Trash2
            size={20}
            className="text-[#958781]"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#3f2d2a]">
          No products found
        </h3>

        <p className="mt-1 text-xs text-[#958781]">
          Try changing your filters or
          add a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-[#e6ddd4] bg-[#f7f3ed]">
            <tr className="text-xs uppercase tracking-[0.1em] text-[#958781]">
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

          <tbody className="divide-y divide-[#e6ddd4]">
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
                    className="transition-colors hover:bg-[#f7f3ed]"
                  >
                    {/* =================================================
                        PRODUCT
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e6ddd4] bg-[#efe8df]">
                          {image ? (
                            <Image
                              src={image}
                              alt={
                                product.name
                              }
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#958781]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              product.id,
                            )}`}
                            className="block max-w-[260px] truncate text-sm font-semibold text-[#3f2d2a] transition-colors hover:text-[#a98282]"
                            title={
                              product.name
                            }
                          >
                            {
                              product.name
                            }
                          </Link>

                          <p
                            className="mt-0.5 max-w-[260px] truncate text-xs text-[#958781]"
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

                    <td className="px-5 py-4 text-sm text-[#70635d]">
                      <span className="inline-block max-w-[160px] truncate">
                        {product.categoryId ||
                          "—"}
                      </span>
                    </td>

                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-[#3f2d2a]">
                        ₹
                        {price.toLocaleString(
                          "en-IN",
                        )}
                      </div>

                      {product.pricing
                        ?.mrp >
                        price && (
                        <div className="mt-0.5 text-xs text-[#958781] line-through">
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
                            ? "text-[#955c56]"
                            : stock <=
                                lowStockThreshold
                              ? "text-[#8a6a48]"
                              : "text-[#3f2d2a]"
                        }`}
                      >
                        {stock}
                      </div>

                      <p className="mt-0.5 text-xs text-[#958781]">
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
                            border-[#d8cec5]
                            bg-[#fbf9f5]
                            px-3
                            text-xs
                            font-medium
                            text-[#3f2d2a]
                            transition
                            hover:border-[#958781]
                            hover:bg-[#f7f3ed]
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
                              border-[#f5eae6]
                              bg-[#fbf9f5]
                              px-3
                              text-xs
                              font-medium
                              text-[#955c56]
                              transition
                              hover:bg-[#f5eae6]
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
                            border-[#f5eae6]
                            bg-[#f5eae6]
                            px-3
                            text-xs
                            font-medium
                            text-[#955c56]
                            transition
                            hover:border-[#f5eae6]
                            hover:bg-[#543c38]
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