"use client";

import { useEffect, useMemo, useState } from "react";

import {
  QUICK_FILTERS,
  activeQuickFilter,
  quickFilterToFilters,
  type OrderQuickFilter,
} from "@/lib/order-quick-filters";

import {
  OrdersHeader,
} from "./OrdersHeader";

import {
  EMPTY_FILTERS,
  OrdersToolbar,
} from "./OrdersToolbar";

import {
  OrdersTable,
} from "./OrdersTable";

import {
  OrdersPagination,
} from "./OrdersPagination";

import {
  OrdersEmptyState,
} from "./OrdersEmptyState";

import {
  useOrders,
} from "@/hooks/useOrders";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getAdminOrders } from "@/services/order.service";

import type { OrderListFilters } from "@/types/order";

export function OrdersPage({
  initialQuick = "all",
  initialFilters = {},
}: {
  initialQuick?: OrderQuickFilter;
  initialFilters?: Partial<OrderListFilters>;
}) {
  const { accessToken, isInitialized } = useAdminAuth();

  const {
    orders,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    refresh,
  } = useOrders({
    ...quickFilterToFilters(initialQuick),
    ...initialFilters,
  });

  const activeQuick = activeQuickFilter(filters);

  // Counts for the quick tabs (independent of the other filters).
  const [counts, setCounts] = useState<Partial<Record<OrderQuickFilter, number>>>({});

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    Promise.allSettled(
      QUICK_FILTERS.map((quick) =>
        getAdminOrders(
          { page: 1, limit: 1, sort: "newest", ...quickFilterToFilters(quick.id) } as OrderListFilters,
          accessToken,
        ),
      ),
    ).then((results) => {
      if (cancelled) return;

      const next: Partial<Record<OrderQuickFilter, number>> = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") next[QUICK_FILTERS[index]!.id] = result.value.pagination.total;
      });

      setCounts(next);
    });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const filtered = useMemo(
    () =>
      Boolean(
        filters.search ||
          filters.status ||
          filters.paymentStatus ||
          filters.paymentMethod ||
          filters.paymentClaimed ||
          filters.customerEmail ||
          filters.customerPhone ||
          filters.from ||
          filters.to,
      ),
    [filters],
  );

  return (
    <div className="space-y-6">
      <OrdersHeader total={pagination.total} loading={loading} onRefresh={() => void refresh()} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Quick filters">
        {QUICK_FILTERS.map((quick) => {
          const active = activeQuick === quick.id;
          const count = counts[quick.id];
          const attention = quick.id === "reported" && (count ?? 0) > 0;

          return (
            <button
              key={quick.id}
              type="button"
              role="tab"
              aria-selected={active}
              title={quick.hint}
              onClick={() => updateFilters({ ...quickFilterToFilters(quick.id), from: undefined, to: undefined })}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                active
                  ? "border-[#f8f3f1] bg-[#b79a6a] text-[#1a1816] shadow-[0_6px_14px_-8px_rgba(0,0,0,0.7)]"
                  : "border-[#3a352f] bg-[#1a1816] text-[#f8f3f1] hover:border-[#b79a6a]"
              }`}
            >
              {quick.label}

              {count !== undefined ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    active
                      ? "bg-[#1a1816]/15 text-[#1a1816]"
                      : attention
                        ? "bg-[#e0b56a] text-[#111111]"
                        : "bg-[#211e1b] text-[#cfc7bb]"
                  }`}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <OrdersToolbar filters={filters} onChange={updateFilters} />

      {error ? (
        <div role="alert" className="rounded-lg border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 text-sm text-[#f0a39d]">
          {error}
        </div>
      ) : null}

      {!loading && orders.length === 0 ? (
        <OrdersEmptyState filtered={filtered} onReset={() => updateFilters(EMPTY_FILTERS)} />
      ) : (
        <>
          <OrdersTable orders={orders} loading={loading} />

          <OrdersPagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
