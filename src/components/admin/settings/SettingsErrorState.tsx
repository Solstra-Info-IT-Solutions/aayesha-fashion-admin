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
    <div className="rounded-[14px] border border-[#5a2a27] bg-[#1a1816] px-6 py-14 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#2b1a18]">
        <AlertCircle className="h-7 w-7 text-[#e08b84]" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#f8f3f1]">
        Something went wrong
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9a9185]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#b79a6a] px-4 py-2.5 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
        />
        {retrying ? "Retrying..." : "Try Again"}
      </button>
    </div>
  );
}