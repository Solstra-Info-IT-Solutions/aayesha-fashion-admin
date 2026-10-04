"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { downloadRevenueCsv, type RevenueExportType } from "@/services/export.service";

/** Download the revenue for the selected range as a CSV (opens in Excel / Sheets). */
export function ExportMenu({ from, to }: { from?: string | undefined; to?: string | undefined }) {
  const { accessToken } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<RevenueExportType | null>(null);
  const [scope, setScope] = useState<"paid" | "all">("paid");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function run(type: RevenueExportType) {
    if (!accessToken || !from || !to || busy) return;

    setBusy(type);

    try {
      await downloadRevenueCsv(accessToken, { type, from, to, scope });
      toast.success("Revenue report downloaded.");
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        disabled={!from || !to}
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 bg-[#b79a6a] px-4 text-sm font-semibold text-[#111111] transition hover:bg-[#c8ad7f] disabled:opacity-50"
      >
        <Download size={15} />
        Download revenue
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-[#2e2a26] bg-[#1a1816] p-3 shadow-xl">
          <p className="px-1 text-xs text-[#cfc7bb]">
            {from} → {to}
          </p>

          <label className="mt-3 flex items-center gap-2 px-1 text-sm text-[#f8f3f1]">
            <input
              type="checkbox"
              checked={scope === "all"}
              onChange={(event) => setScope(event.target.checked ? "all" : "paid")}
            />
            Include unpaid (non-cancelled) orders
          </label>

          <div className="mt-3 grid gap-2">
            {(
              [
                ["daily", "Daily summary", "One row per day"],
                ["orders", "Order-level detail", "One row per order"],
              ] as const
            ).map(([type, title, hint]) => (
              <button
                key={type}
                type="button"
                onClick={() => run(type)}
                disabled={Boolean(busy)}
                className="flex items-center justify-between rounded-lg border border-[#2e2a26] px-3 py-2.5 text-left hover:border-[#b79a6a] hover:bg-[#2a241b] disabled:opacity-60"
              >
                <span>
                  <span className="block text-sm font-semibold text-[#f8f3f1]">{title}</span>
                  <span className="block text-xs text-[#cfc7bb]">{hint} · CSV</span>
                </span>

                {busy === type ? <Loader2 size={16} className="animate-spin text-[#d9c7a3]" /> : <Download size={16} className="text-[#d9c7a3]" />}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
