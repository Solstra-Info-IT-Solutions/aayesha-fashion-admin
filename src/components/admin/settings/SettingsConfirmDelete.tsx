"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import type { StoreSetting } from "@/types/settings";

type SettingsConfirmDeleteProps = {
  setting: StoreSetting | null;
  open: boolean;
  deleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function SettingsConfirmDelete({
  setting,
  open,
  deleting = false,
  onConfirm,
  onCancel,
}: SettingsConfirmDeleteProps) {
  if (!open || !setting) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-setting-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5">
          <h2
            id="delete-setting-title"
            className="text-lg font-semibold text-gray-900"
          >
            Delete setting?
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            This will permanently remove the setting{" "}
            <span className="font-medium text-gray-800">
              &quot;{setting.key}&quot;
            </span>
            .
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {deleting ? "Deleting..." : "Delete Setting"}
          </button>
        </div>
      </div>
    </div>
  );
}