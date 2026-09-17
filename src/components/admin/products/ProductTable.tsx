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
      <div className="rounded-2xl border border-[#e7e2dd] bg-white">
        <div className="space-y-2 p-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-[#f5f1ec]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e7e2dd] bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f4f0]">
          <Trash2
            size={20}
            className="text-[#aaa19a]"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-[#292c2c]">
          No products found
        </h3>

        <p className="mt-1 text-xs text-[#969696]">
          Try changing your filters or
          add a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
            <tr className="text-xs uppercase tracking-[0.1em] text-[#969696]">
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

          <tbody className="divide-y divide-[#eee9e4]">
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
                    className="transition-colors hover:bg-[#fcfbf9]"
                  >
                    {/* =================================================
                        PRODUCT
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e7e2dd] bg-[#f5f1ec]">
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
                            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#969696]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              product.id,
                            )}`}
                            className="block max-w-[260px] truncate text-sm font-semibold text-[#171717] transition-colors hover:text-[#d98791]"
                            title={
                              product.name
                            }
                          >
                            {
                              product.name
                            }
                          </Link>

                          <p
                            className="mt-0.5 max-w-[260px] truncate text-xs text-[#969696]"
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

                    <td className="px-5 py-4 text-sm text-[#6f706f]">
                      <span className="inline-block max-w-[160px] truncate">
                        {product.categoryId ||
                          "—"}
                      </span>
                    </td>

                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-[#171717]">
                        ₹
                        {price.toLocaleString(
                          "en-IN",
                        )}
                      </div>

                      {product.pricing
                        ?.mrp >
                        price && (
                        <div className="mt-0.5 text-xs text-[#969696] line-through">
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
                            ? "text-[#a33a3a]"
                            : stock <=
                                lowStockThreshold
                              ? "text-[#a06a00]"
                              : "text-[#292c2c]"
                        }`}
                      >
                        {stock}
                      </div>

                      <p className="mt-0.5 text-xs text-[#969696]">
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
                            border-[#d8d1ca]
                            bg-white
                            px-3
                            text-xs
                            font-medium
                            text-[#292c2c]
                            transition
                            hover:border-[#c9c0b8]
                            hover:bg-[#fcfbf9]
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
                              border-[#efd2d2]
                              bg-white
                              px-3
                              text-xs
                              font-medium
                              text-[#a33a3a]
                              transition
                              hover:bg-[#fff5f5]
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
                            border-[#e8c7c7]
                            bg-[#fffafa]
                            px-3
                            text-xs
                            font-medium
                            text-[#a33a3a]
                            transition
                            hover:border-[#dcaeae]
                            hover:bg-[#fff1f1]
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