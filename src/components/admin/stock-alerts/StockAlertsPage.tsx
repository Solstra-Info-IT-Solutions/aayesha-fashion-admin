"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
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
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">Inventory</p>
            <h1 className="mt-1 text-[#f8f3f1]">
              Back-in-stock requests
            </h1>

            <p className="mt-1 text-sm text-[#cfc7bb]">
              Customers who asked to be told when a sold-out product returns.
              They are emailed automatically when you restock it.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b] disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {rows === null && !failed ? (
        <p className="text-sm text-[#cfc7bb]">Loading…</p>
      ) : failed ? (
        <p className="text-sm text-[#e08b84]">Unable to load stock alerts.</p>
      ) : rows && rows.length === 0 ? (
        <p className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-8 text-center text-sm text-[#cfc7bb]">
          No back-in-stock requests yet.
        </p>
      ) : (
        <>
          <p className="text-sm text-[#cfc7bb]">
            <strong className="text-[#f8f3f1]">{waitingTotal}</strong>{" "}
            customer{waitingTotal === 1 ? " is" : "s are"} waiting across{" "}
            {rows?.length} product{rows?.length === 1 ? "" : "s"}.
          </p>

          <div className="space-y-3 md:hidden">
            {rows?.map((row) => (
              <Link
                key={row.productId}
                href={`/admin/products/${encodeURIComponent(row.productCode)}`}
                className="surface surface-hover block p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#f8f3f1]">{row.productName}</p>
                  <span
                    className={
                      row.stock > 0
                        ? "text-sm font-semibold text-[#8fb08a]"
                        : "text-sm font-semibold text-[#e08b84]"
                    }
                  >
                    {row.stock > 0 ? `${row.stock} in stock` : "Sold out"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#2e2a26] pt-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9a9185]">Waiting</p>
                    <p className="font-semibold text-[#f8f3f1]">{row.waiting}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9a9185]">Notified</p>
                    <p className="font-semibold text-[#f8f3f1]">{row.notified}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9a9185]">Last request</p>
                    <p className="font-semibold text-[#f8f3f1]">{formatDate(row.latestRequestAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto surface md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#2e2a26] text-xs uppercase tracking-wide text-[#cfc7bb]">
                <tr>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">In stock</th>
                  <th className="px-5 py-3 font-medium">Waiting</th>
                  <th className="px-5 py-3 font-medium">Notified</th>
                  <th className="px-5 py-3 font-medium">Last request</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2e2a26]">
                {rows?.map((row) => (
                  <tr key={row.productId}>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/products/${encodeURIComponent(row.productCode)}`}
                        className="flex items-center gap-3 font-medium text-[#f8f3f1] hover:underline"
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
                            ? "font-medium text-[#8fb08a]"
                            : "font-medium text-[#e08b84]"
                        }
                      >
                        {row.stock > 0 ? row.stock : "Sold out"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#f8f3f1]">
                      {row.waiting}
                    </td>

                    <td className="px-5 py-4 text-[#cfc7bb]">
                      {row.notified}
                    </td>

                    <td className="px-5 py-4 text-[#cfc7bb]">
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
