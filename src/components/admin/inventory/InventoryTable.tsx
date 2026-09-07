"use client";

import {
  History,
  PackagePlus,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import InventoryStatusBadge from "./InventoryStatusBadge";

import type { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  loading?: boolean;
  onAdjust: (item: InventoryItem) => void;
  onReserve: (item: InventoryItem) => void;
  onThreshold: (item: InventoryItem) => void;
  onLedger: (item: InventoryItem) => void;
}

function getDisplayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const object = value as Record<string, unknown>;

    const preferredKeys = [
      "label",
      "name",
      "value",
      "code",
      "title",
    ];

    for (const key of preferredKeys) {
      if (
        typeof object[key] === "string" &&
        object[key]
      ) {
        return object[key] as string;
      }
    }

    return "—";
  }

  return String(value);
}

function getPrice(item: InventoryItem) {
  const pricing = item.pricing;

  if (!pricing) {
    return "—";
  }

  const value =
    pricing.salePrice ??
    pricing.price ??
    pricing.mrp;

  if (typeof value !== "number") {
    return "—";
  }

  return `₹${new Intl.NumberFormat("en-IN").format(value)}`;
}

export default function InventoryTable({
  items,
  loading = false,
  onAdjust,
  onReserve,
  onThreshold,
  onLedger,
}: InventoryTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white">
        <div className="space-y-3 p-5">
          {Array.from({ length: 8 }).map((_, index) => (
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
        <table className="min-w-[1200px] w-full">
          <thead>
            <tr className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Product
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Variant
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Price
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Stock
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Reserved
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Available
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                Threshold
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
            {items.map((item) => (
              <tr
                key={`${item.productId}-${item.variantId}`}
                className="border-b border-[#f0ece8] last:border-b-0 hover:bg-[#fcfbf9]"
              >
                <td className="px-5 py-4">
                  <div className="max-w-[270px]">
                    <p className="truncate text-sm font-semibold text-[#171717]">
                      {item.productName}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#969696]">
                      {item.productType}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-[#292c2c]">
                      {item.sku}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#6f706f]">
                      {item.size !== undefined && (
                        <span>
                          Size: {getDisplayValue(item.size)}
                        </span>
                      )}

                      {item.color !== undefined && (
                        <span>
                          Color: {getDisplayValue(item.color)}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-[#292c2c]">
                  {getPrice(item)}
                </td>

                <td className="px-4 py-4 text-right text-sm font-semibold text-[#171717]">
                  {item.stock}
                </td>

                <td className="px-4 py-4 text-right text-sm text-[#6f706f]">
                  {item.reserved}
                </td>

                <td className="px-4 py-4 text-right text-sm font-semibold text-[#292c2c]">
                  {item.available}
                </td>

                <td className="px-4 py-4 text-right text-sm text-[#6f706f]">
                  {item.lowStockThreshold}
                </td>

                <td className="px-4 py-4">
                  <InventoryStatusBadge status={item.status} />
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1">
                    <button
  type="button"
  title="Adjust stock"
  onClick={() => onAdjust(item)}
  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] hover:border-[#d98791] hover:text-[#d98791]"
>
  <SlidersHorizontal size={16} />
</button>

<button
  type="button"
  title="Reserve or release stock"
  onClick={() => onReserve(item)}
  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] hover:border-[#d98791] hover:text-[#d98791]"
>
  <PackagePlus size={16} />
</button>

<button
  type="button"
  title="Set threshold"
  onClick={() => onThreshold(item)}
  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] hover:border-[#d98791] hover:text-[#d98791]"
>
  <Target size={16} />
</button>

<button
  type="button"
  title="View ledger"
  onClick={() => onLedger(item)}
  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e2dd] text-[#6f706f] hover:border-[#d98791] hover:text-[#d98791]"
>
  <History size={16} />
</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}