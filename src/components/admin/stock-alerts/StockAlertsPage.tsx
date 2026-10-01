"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BellRing, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  getStockAlertDemand,
  type StockAlertDemand,
} from "@/services/stock-alert.service";

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function StockAlertsPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [rows, setRows] = useState<StockAlertDemand[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;

    try {
      setRows(await getStockAlertDemand(accessToken));
      setFailed(false);
    } catch (error) {
      setFailed(true);
      toast.error(
        error instanceof Error ? error.message : "Unable to load stock alerts.",
      );
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    getStockAlertDemand(accessToken)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const waitingTotal = (rows ?? []).reduce((sum, row) => sum + row.waiting, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#9f1239]">
            <BellRing size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Back-in-stock requests
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Customers who asked to be told when a sold-out product returns.
              They are emailed automatically when you restock it.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {rows === null && !failed ? (
        <p className="text-sm text-[var(--color-secondary)]">Loading…</p>
      ) : failed ? (
        <p className="text-sm text-red-600">Unable to load stock alerts.</p>
      ) : rows && rows.length === 0 ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center text-sm text-[var(--color-secondary)]">
          No back-in-stock requests yet.
        </p>
      ) : (
        <>
          <p className="text-sm text-[var(--color-secondary)]">
            <strong className="text-[var(--color-ink)]">{waitingTotal}</strong>{" "}
            customer{waitingTotal === 1 ? " is" : "s are"} waiting across{" "}
            {rows?.length} product{rows?.length === 1 ? "" : "s"}.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-secondary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">In stock</th>
                  <th className="px-5 py-3 font-medium">Waiting</th>
                  <th className="px-5 py-3 font-medium">Notified</th>
                  <th className="px-5 py-3 font-medium">Last request</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-border)]">
                {rows?.map((row) => (
                  <tr key={row.productId}>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${row.productId}`}
                        className="flex items-center gap-3 font-medium text-[var(--color-ink)] hover:underline"
                      >
                        {row.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={row.image}
                            alt=""
                            className="h-12 w-10 rounded object-cover"
                          />
                        ) : null}

                        {row.productName}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          row.stock > 0
                            ? "font-medium text-emerald-700"
                            : "font-medium text-red-600"
                        }
                      >
                        {row.stock > 0 ? row.stock : "Sold out"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[var(--color-ink)]">
                      {row.waiting}
                    </td>

                    <td className="px-5 py-4 text-[var(--color-secondary)]">
                      {row.notified}
                    </td>

                    <td className="px-5 py-4 text-[var(--color-secondary)]">
                      {formatDate(row.latestRequestAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
