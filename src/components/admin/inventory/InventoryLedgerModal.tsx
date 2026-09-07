"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getAccessToken } from "@/lib/api";
import {
  getInventoryLedger,
} from "@/services/inventory.service";

import type {
  InventoryItem,
  InventoryLedgerEntry,
} from "@/types/inventory";

interface InventoryLedgerModalProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatType(type: string) {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

export default function InventoryLedgerModal({
  item,
  open,
  onClose,
}: InventoryLedgerModalProps) {
  const [entries, setEntries] =
    useState<InventoryLedgerEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !item) {
      return;
    }

    const load = async () => {
      setLoading(true);

      try {
        const response =
          await getInventoryLedger(
            {
              productId: item.productId,
              variantId: item.variantId,
              page: 1,
              limit: 50,
            },
            getAccessToken(),
          );

        setEntries(response.data.entries);
      } catch (error) {
        console.error(
          "Failed to load inventory ledger:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [open, item]);

  if (!open || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              Inventory Ledger
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              {item.productName} · {item.sku}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#969696] hover:bg-[#f5f1ec]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-[#f5f1ec]"
                  />
                ),
              )}
            </div>
          ) : entries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-[#6f706f]">
                No inventory history available.
              </p>
            </div>
          ) : (
            <table className="min-w-[950px] w-full">
              <thead>
                <tr className="border-b border-[#e7e2dd] bg-[#fcfbf9]">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Type
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Quantity
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Stock
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Reserved
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#969696]">
                    Reason
                  </th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#f0ece8] last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm text-[#6f706f]">
                      {formatDate(entry.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#f5f1ec] px-2.5 py-1 text-xs font-medium text-[#6f706f]">
                        {formatType(entry.type)}
                      </span>
                    </td>

                    <td
                      className={`px-4 py-4 text-right text-sm font-semibold ${
                        entry.quantity >= 0
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {entry.quantity > 0
                        ? `+${entry.quantity}`
                        : entry.quantity}
                    </td>

                    <td className="px-4 py-4 text-sm text-[#292c2c]">
                      {entry.stockBefore} →{" "}
                      <span className="font-semibold">
                        {entry.stockAfter}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-[#292c2c]">
                      {entry.reservedBefore} →{" "}
                      <span className="font-semibold">
                        {entry.reservedAfter}
                      </span>
                    </td>

                    <td className="max-w-[300px] px-4 py-4 text-sm text-[#6f706f]">
                      <p className="truncate">
                        {entry.reason || "—"}
                      </p>

                      {entry.referenceId && (
                        <p className="mt-1 text-xs text-[#969696]">
                          Ref: {entry.referenceId}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}