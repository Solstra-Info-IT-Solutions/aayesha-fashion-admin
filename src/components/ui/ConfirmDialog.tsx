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
        className="absolute inset-0 bg-[#2a2520]/45"
      />

      <div className="surface relative w-full max-w-md p-6 shadow-2xl">
        <h2 id="confirm-title" className="display text-3xl font-semibold leading-tight text-[#2a2520]">
          {title}
        </h2>

        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5f584d]">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-10 rounded-lg border border-[#d6ccb6] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white transition disabled:opacity-60 ${
              tone === "danger" ? "bg-[#b3261e] hover:bg-[#8f1f19]" : "bg-[#26221d] hover:bg-[#3d372f]"
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
