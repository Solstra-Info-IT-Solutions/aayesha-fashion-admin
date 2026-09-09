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
      <div className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
        <div className="space-y-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-[#f5f1ec]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1050px] w-full">
          <thead>
            <tr className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                SKU
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Color
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Size
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                MRP
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Selling Price
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Stock
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Available
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Status
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Actions
              </th>
            </tr>
          </thead>

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
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {variant.sku}
                      </p>

                      {variant.barcode && (
                        <p className="mt-1 text-xs text-[#969696]">
                          Barcode:{" "}
                          {variant.barcode}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-7 w-7 shrink-0 rounded-full border border-[#d8d1ca]"
                        style={{
                          backgroundColor:
                            variant.color.hex ||
                            "#ffffff",
                        }}
                      />

                      <div>
                        <p className="text-sm text-[#292c2c]">
                          {
                            variant.color
                              .name
                          }
                        </p>

                        <p className="text-xs text-[#969696]">
                          {
                            variant.color
                              .slug
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-lg bg-[#f5f1ec] px-2.5 py-1.5 text-sm font-medium text-[#292c2c]">
                      {
                        variant.size
                          .label
                      }
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-[#6f706f]">
                    ₹
                    {new Intl.NumberFormat(
                      "en-IN",
                    ).format(
                      variant.pricing.mrp,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-[#171717]">
                    ₹
                    {new Intl.NumberFormat(
                      "en-IN",
                    ).format(
                      variant.pricing
                        .sellingPrice,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-[#292c2c]">
                    {
                      variant
                        .inventory
                        .stock
                    }
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-[#292c2c]">
                    {available}
                  </td>

                  <td className="px-4 py-4">
                    <VariantStatusBadge
                      status={
                        variant.status
                      }
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Edit variant"
                        onClick={() =>
                          onEdit(
                            variant,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] transition hover:border-[#d98791] hover:text-[#d98791]"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete variant"
                        onClick={() =>
                          onDelete(
                            variant,
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] transition hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 size={16} />
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