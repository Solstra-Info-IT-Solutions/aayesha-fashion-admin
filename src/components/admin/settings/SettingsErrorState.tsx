"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

type SettingsErrorStateProps = {
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
};

export default function SettingsErrorState({
  message = "Failed to load settings.",
  onRetry,
  retrying = false,
}: SettingsErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        Something went wrong
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#9f1239] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
        />
        {retrying ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );
}