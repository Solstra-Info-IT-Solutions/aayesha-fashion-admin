"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  updateInventoryThreshold,
} from "@/services/inventory.service";

import type { InventoryItem } from "@/types/inventory";

interface ThresholdModalProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function ThresholdModal({
  item,
  open,
  onClose,
  onSuccess,
}: ThresholdModalProps) {
  const [threshold, setThreshold] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !item) {
      return;
    }

    setThreshold(
      String(item.lowStockThreshold),
    );

    setSaving(false);
  }, [open, item]);

  if (!open || !item) {
    return null;
  }

  const submit = async () => {
    const value = Number(threshold);

    if (!Number.isInteger(value) || value < 0) {
      toast.error(
        "Threshold must be a whole number greater than or equal to 0.",
      );
      return;
    }

    setSaving(true);

    try {
      await updateInventoryThreshold({
        productId: item.productId,
        variantId: item.variantId,
        lowStockThreshold: value,
      });

      toast.success(
        "Low-stock threshold updated.",
      );

      await onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update threshold.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              Low Stock Threshold
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              {item.productName} · {item.sku}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#969696] transition hover:bg-[#f5f1ec] hover:text-[#292c2c] disabled:opacity-50"
            aria-label="Close threshold"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] p-4">
            <p className="text-xs text-[#969696]">
              Current available stock
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#171717]">
              {item.available}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Low Stock Threshold
            </label>

            <input
              type="number"
              min={0}
              value={threshold}
              onChange={(event) =>
                setThreshold(event.target.value)
              }
              disabled={saving}
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
            />

            <p className="mt-2 text-xs leading-5 text-[#969696]">
              The SKU will be considered low stock when available units fall at or below this number.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e7e2dd] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#d8d1ca] px-4 py-2.5 text-sm font-medium text-[#292c2c] transition hover:bg-[#fcfbf9] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void submit()}
            disabled={saving}
            className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#292c2c] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Threshold"}
          </button>
        </div>
      </div>
    </div>
  );
}