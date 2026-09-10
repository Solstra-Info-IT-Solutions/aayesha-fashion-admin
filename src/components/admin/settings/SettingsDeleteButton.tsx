"use client";

import { Loader2, Trash2 } from "lucide-react";

type SettingsDeleteButtonProps = {
  onClick: () => void;
  deleting?: boolean;
  disabled?: boolean;
};

export default function SettingsDeleteButton({
  onClick,
  deleting = false,
  disabled = false,
}: SettingsDeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || deleting}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}

      {deleting ? "Deleting..." : "Delete Setting"}
    </button>
  );
}