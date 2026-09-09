"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Archive,
  Pencil,
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
}

function getPrimaryImage(
  product: Product,
): string {
  return (
    product.media?.find(
      (media) =>
        media.type ===
          "image" &&
        media.isPrimary,
    )?.src ??
    product.media?.find(
      (media) =>
        media.type === "image",
    )?.src ??
    ""
  );
}

function getStartingPrice(
  product: Product,
): number {
  const prices =
    product.variants
      .filter(
        (variant) =>
          variant.status ===
          "active",
      )
      .map(
        (variant) =>
          variant.pricing
            .sellingPrice,
      );

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

export default function ProductTable({
  products,
  loading,
  onArchive,
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

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
            <tr className="text-xs uppercase tracking-[0.1em] text-[#969696]">
              <th className="px-5 py-4 font-medium">
                Product
              </th>
              <th className="px-5 py-4 font-medium">
                Type
              </th>
              <th className="px-5 py-4 font-medium">
                Price
              </th>
              <th className="px-5 py-4 font-medium">
                Variants
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
                  getStartingPrice(
                    product,
                  );

                return (
                  <tr
                    key={
                      product.id
                    }
                    className="hover:bg-[#fcfbf9]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e7e2dd] bg-[#f5f1ec]">
                          {image ? (
                            <Image
                              src={
                                image
                              }
                              alt={
                                product.name
                              }
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-[#969696]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${encodeURIComponent(
                              product.id,
                            )}`}
                            className="block truncate text-sm font-semibold text-[#171717] hover:text-[#d98791]"
                          >
                            {
                              product.name
                            }
                          </Link>

                          <p className="mt-0.5 truncate text-xs text-[#969696]">
                            {
                              product.slug
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6f706f]">
                      {
                        product.productType
                      }
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#171717]">
                      ₹
                      {price.toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6f706f]">
                      {
                        product
                          .variants
                          .length
                      }
                    </td>

                    <td className="px-5 py-4">
                      <ProductStatusBadge
                        status={
                          product.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${encodeURIComponent(
                            product.id,
                          )}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d8d1ca] px-3 text-xs font-medium text-[#292c2c] hover:bg-[#fcfbf9]"
                        >
                          <Pencil
                            size={13}
                          />
                          Edit
                        </Link>

                        {product.status !==
                          "archived" && (
                          <button
                            type="button"
                            onClick={() =>
                              onArchive(
                                product,
                              )
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#efd2d2] px-3 text-xs font-medium text-[#a33a3a] hover:bg-[#fff5f5]"
                          >
                            <Archive
                              size={
                                13
                              }
                            />
                            Archive
                          </button>
                        )}
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