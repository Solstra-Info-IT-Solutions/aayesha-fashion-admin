"use client";

import {
  Edit3,
  Trash2,
} from "lucide-react";

import VariantStatusBadge from "./VariantStatusBadge";

import type {
  ProductVariant,
} from "@/types/product-variant";

interface VariantsTableProps {
  variants: ProductVariant[];
  loading?: boolean;
  onEdit: (
    variant: ProductVariant,
  ) => void;
  onDelete: (
    variant: ProductVariant,
  ) => void;
}

export default function VariantsTable({
  variants,
  loading = false,
  onEdit,
  onDelete,
}: VariantsTableProps) {
  if (loading) {
    return (
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
        <div className="space-y-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-[#f5f1ec]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white shadow-sm">
      <div className="min-w-0 max-w-full overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#969696] sm:px-5">
                SKU
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Color
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Size
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                MRP
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Selling Price
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Stock
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Available
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Status
              </th>

              <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#969696]">
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {variants.map((variant) => {
              const available =
                Math.max(
                  0,
                  variant.inventory.stock -
                    variant.inventory.reserved,
                );

              return (
                <tr
                  key={variant.id}
                  className="border-b border-[#f0ece8] last:border-b-0 hover:bg-[#fcfbf9]"
                >
                  {/* SKU */}
                  <td className="max-w-[180px] px-4 py-3.5 sm:px-5">
                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold leading-5 text-[#171717]">
                        {variant.sku}
                      </p>

                      {variant.barcode && (
                        <p className="mt-1 break-all text-[11px] leading-4 text-[#969696]">
                          Barcode:{" "}
                          {variant.barcode}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* COLOR */}
                  <td className="px-4 py-3.5">
                    <div className="flex min-w-[150px] items-center gap-2.5">
                      <span
                        className="h-7 w-7 shrink-0 rounded-full border border-[#d8d1ca]"
                        style={{
                          backgroundColor:
                            variant.color.hex ||
                            "#ffffff",
                        }}
                      />

                      <div className="min-w-0">
                        <p className="break-words text-sm leading-5 text-[#292c2c]">
                          {variant.color.name}
                        </p>

                        <p className="mt-0.5 break-all text-[11px] leading-4 text-[#969696]">
                          {variant.color.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SIZE */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex whitespace-nowrap rounded-lg bg-[#f5f1ec] px-2.5 py-1.5 text-xs font-medium text-[#292c2c]">
                      {variant.size.label}
                    </span>
                  </td>

                  {/* MRP */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm text-[#6f706f]">
                    ₹
                    {new Intl.NumberFormat(
                      "en-IN",
                    ).format(
                      variant.pricing.mrp,
                    )}
                  </td>

                  {/* SELLING PRICE */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-[#171717]">
                    ₹
                    {new Intl.NumberFormat(
                      "en-IN",
                    ).format(
                      variant.pricing
                        .sellingPrice,
                    )}
                  </td>

                  {/* STOCK */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm text-[#292c2c]">
                    {variant.inventory.stock}
                  </td>

                  {/* AVAILABLE */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-[#292c2c]">
                    {available}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3.5">
                    <div className="whitespace-nowrap">
                      <VariantStatusBadge
                        status={
                          variant.status
                        }
                      />
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Edit variant"
                        aria-label="Edit variant"
                        onClick={() =>
                          onEdit(
                            variant,
                          )
                        }
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e7e2dd] bg-white text-[#6f706f] transition hover:border-[#d98791] hover:bg-[#fffafa] hover:text-[#d98791]"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        type="button"
                        title="Delete variant"
                        aria-label="Delete variant"
                        onClick={() =>
                          onDelete(
                            variant,
                          )
                        }
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e7e2dd] bg-white text-[#6f706f] transition hover:border-red-300 hover:bg-[#fffafa] hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}