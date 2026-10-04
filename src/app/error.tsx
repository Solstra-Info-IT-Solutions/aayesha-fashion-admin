"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ADMIN ERROR:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#111111] px-6 text-center text-[#f8f3f1]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9c7a3]">
        Aayesha Fashion Admin
      </p>

      <h1 className="font-serif text-4xl">Something went wrong</h1>

      <p className="max-w-md text-sm text-[#cfc7bb]">
        The page could not be shown. Your data has not been changed. Try again, or go back to the dashboard.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[#b79a6a] px-5 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#c8ad7f]"
        >
          Try again
        </button>

        <a
          href="/admin"
          className="rounded-lg border border-[#3a352f] px-5 py-2.5 text-sm font-medium text-[#f8f3f1] hover:border-[#b79a6a]"
        >
          Dashboard
        </a>
      </div>
    </main>
  );
}
