"use client";

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

import type { OrderListFilters } from "@/types/order";

export function OrdersPage({
  initialQuick = "all",
  initialFilters = {},
}: {
  initialQuick?: OrderQuickFilter;
  initialFilters?: Partial<OrderListFilters>;
}) {
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

  const activeQuick =
    activeQuickFilter(filters);

  const filtered = Boolean(
    filters.search ||
      filters.status ||
      filters.paymentStatus ||
      filters.paymentMethod ||
      filters.paymentClaimed ||
      filters.customerEmail ||
      filters.customerPhone ||
      filters.from ||
      filters.to,
  );

  return (
    <div className="space-y-6">
      <OrdersHeader
        total={pagination.total}
        loading={loading}
        onRefresh={() =>
          void refresh()
        }
      />

      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((quick) => (
          <button
            key={quick.id}
            type="button"
            title={quick.hint}
            onClick={() =>
              updateFilters(
                quickFilterToFilters(
                  quick.id,
                ),
              )
            }
            className={
              activeQuick === quick.id
                ? "h-9 border border-[#26221d] bg-[#26221d] px-4 text-xs font-medium uppercase tracking-[0.08em] text-white"
                : "h-9 border border-[#d6ccb6] bg-[#fffdf8] px-4 text-xs font-medium uppercase tracking-[0.08em] text-[#2a2520] hover:border-[#2a2520]"
            }
          >
            {quick.label}
          </button>
        ))}
      </div>

      {filters.from || filters.to ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#5f584d]">
          <span className="inline-flex items-center gap-2 border border-[#d6ccb6] bg-white px-3 py-1.5 font-medium text-[#2a2520]">
            {filters.from === filters.to
              ? filters.from
              : `${filters.from ?? "…"} → ${filters.to ?? "…"}`}

            <button
              type="button"
              aria-label="Clear date filter"
              onClick={() => updateFilters({ from: undefined, to: undefined })}
              className="text-[#756d62] hover:text-[#2a2520]"
            >
              ×
            </button>
          </span>
        </div>
      ) : null}

      <OrdersToolbar
        filters={filters}
        onChange={
          updateFilters
        }
      />

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading &&
      orders.length === 0 ? (
        <OrdersEmptyState
          filtered={filtered}
        />
      ) : (
        <>
          <OrdersTable
            orders={orders}
            loading={loading}
          />

          <OrdersPagination
            pagination={pagination}
            onPageChange={
              setPage
            }
          />
        </>
      )}
    </div>
  );
}