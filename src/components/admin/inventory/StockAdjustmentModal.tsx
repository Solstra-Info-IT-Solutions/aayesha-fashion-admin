"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import { adjustStock } from "@/services/inventory.service";

import type {
  InventoryItem,
  InventoryReferenceType,
} from "@/types/inventory";

interface StockAdjustmentModalProps {
  item: InventoryItem | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

export default function StockAdjustmentModal({
  item,
  open,
  onClose,
  onSuccess,
}: StockAdjustmentModalProps) {
  const { accessToken } = useAdminAuth();

  const [quantity, setQuantity] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [referenceType, setReferenceType] =
    useState<InventoryReferenceType>(
      "manual",
    );

  const [referenceId, setReferenceId] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuantity("");
    setReason("");
    setReferenceType("manual");
    setReferenceId("");
    setNotes("");
    setSaving(false);
  }, [open, item]);

  if (!open || !item) {
    return null;
  }

  const submit = async () => {
    if (!accessToken) {
      toast.error(
        "Your admin session has expired. Please login again.",
      );
      return;
    }

    const parsedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity === 0
    ) {
      toast.error(
        "Quantity must be a non-zero whole number.",
      );
      return;
    }

    if (reason.trim().length < 3) {
      toast.error(
        "Please enter a reason with at least 3 characters.",
      );
      return;
    }

    if (
      parsedQuantity < 0 &&
      Math.abs(parsedQuantity) >
        item.stock - item.reserved
    ) {
      toast.error(
        "Stock cannot be reduced below the reserved quantity.",
      );
      return;
    }

    setSaving(true);

    try {
      await adjustStock(
        {
          productId: item.productId,
          variantId: item.variantId,
          quantity: parsedQuantity,
          reason: reason.trim(),
          referenceType,
          ...(referenceId.trim()
            ? {
                referenceId:
                  referenceId.trim(),
              }
            : {}),
          ...(notes.trim()
            ? {
                notes: notes.trim(),
              }
            : {}),
        },
        accessToken,
      );

      toast.success(
        "Stock updated successfully.",
      );

      await onSuccess();

      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update stock.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              Adjust Stock
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              {item.productName} ·{" "}
              {item.sku}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#969696] transition hover:bg-[#f5f1ec] hover:text-[#292c2c] disabled:opacity-50"
            aria-label="Close stock adjustment"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-[#969696]">
                  Stock
                </p>

                <p className="mt-1 font-semibold text-[#171717]">
                  {item.stock}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#969696]">
                  Reserved
                </p>

                <p className="mt-1 font-semibold text-[#171717]">
                  {item.reserved}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#969696]">
                  Available
                </p>

                <p className="mt-1 font-semibold text-[#171717]">
                  {item.available}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value,
                )
              }
              disabled={saving}
              placeholder="e.g. 10 or -2"
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none transition placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
            />

            <p className="mt-1.5 text-xs text-[#969696]">
              Positive quantity adds stock.
              Negative quantity removes stock.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Reason
            </label>

            <input
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value,
                )
              }
              disabled={saving}
              placeholder="Why is the stock changing?"
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Reference Type
              </label>

              <select
                value={referenceType}
                onChange={(event) =>
                  setReferenceType(
                    event.target
                      .value as InventoryReferenceType,
                  )
                }
                disabled={saving}
                className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
              >
                <option value="manual">
                  Manual
                </option>
                <option value="order">
                  Order
                </option>
                <option value="return">
                  Return
                </option>
                <option value="exchange">
                  Exchange
                </option>
                <option value="system">
                  System
                </option>
                <option value="bulk">
                  Bulk
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Reference ID
              </label>

              <input
                value={referenceId}
                onChange={(event) =>
                  setReferenceId(
                    event.target.value,
                  )
                }
                disabled={saving}
                placeholder="Optional"
                className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value,
                )
              }
              disabled={saving}
              rows={3}
              placeholder="Optional notes..."
              className="w-full resize-none rounded-xl border border-[#d8d1ca] px-3 py-2.5 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
            />
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
            onClick={() =>
              void submit()
            }
            disabled={saving}
            className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#292c2c] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Update Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}