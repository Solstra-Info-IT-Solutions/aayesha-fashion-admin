"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  ProductVariant,
} from "@/types/product";

interface VariantTableProps {
  variants: ProductVariant[];
  onEdit: (
    variant: ProductVariant,
  ) => void;
  onDelete: (
    variant: ProductVariant,
  ) => void;
}

export default function VariantTable({
  variants,
  onEdit,
  onDelete,
}: VariantTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e7e2dd]">
      <table className="w-full min-w-[850px] text-left">
        <thead className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
          <tr className="text-xs uppercase tracking-[0.1em] text-[#969696]">
            <th className="px-4 py-3 font-medium">
              SKU
            </th>

            <th className="px-4 py-3 font-medium">
              Color
            </th>

            <th className="px-4 py-3 font-medium">
              Size
            </th>

            <th className="px-4 py-3 font-medium">
              Price
            </th>

            <th className="px-4 py-3 font-medium">
              Stock
            </th>

            <th className="px-4 py-3 font-medium">
              Status
            </th>

            <th className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#eee9e4]">
          {variants.map(
            (variant) => (
              <tr
                key={
                  variant.id
                }
                className="bg-white"
              >
                <td className="px-4 py-4 text-sm font-semibold text-[#171717]">
                  {variant.sku}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {variant.color
                      .hex && (
                      <span
                        className="h-4 w-4 rounded-full border border-[#d8d1ca]"
                        style={{
                          backgroundColor:
                            variant
                              .color
                              .hex,
                        }}
                      />
                    )}

                    <span className="text-sm text-[#6f706f]">
                      {
                        variant
                          .color
                          .name
                      }
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-[#6f706f]">
                  {
                    variant.size
                      .label
                  }
                </td>

                <td className="px-4 py-4 text-sm font-medium text-[#171717]">
                  ₹
                  {variant.pricing.sellingPrice.toLocaleString(
                    "en-IN",
                  )}
                </td>

                <td className="px-4 py-4 text-sm text-[#6f706f]">
                  {variant.inventory.stock -
                    variant.inventory.reserved}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-[#f5f1ec] px-2.5 py-1 text-xs font-medium text-[#6f706f]">
                    {
                      variant.status
                    }
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          variant,
                        )
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#d8d1ca] px-2.5 text-xs font-medium"
                    >
                      <Pencil
                        size={
                          13
                        }
                      />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        variants.length <=
                        1
                      }
                      onClick={() =>
                        onDelete(
                          variant,
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#efd2d2] text-[#a33a3a] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Delete variant"
                    >
                      <Trash2
                        size={
                          13
                        }
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}