"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/** In-app replacement for window.confirm. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <button
        type="button"
        aria-label="Close"
        onClick={() => !busy && onCancel()}
        className="absolute inset-0 bg-black/65"
      />

      <div className="surface relative w-full max-w-md p-6 shadow-2xl">
        <h2 id="confirm-title" className="display text-3xl font-semibold leading-tight text-[#f8f3f1]">
          {title}
        </h2>

        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#cfc7bb]">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 rounded-lg border border-[#3a352f] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-[#111111] transition disabled:opacity-60 ${
              tone === "danger" ? "bg-[#e08b84] hover:bg-[#f0a39d]" : "bg-[#b79a6a] hover:bg-[#c8ad7f]"
            }`}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
