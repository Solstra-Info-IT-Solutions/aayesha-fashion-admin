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
                ? "h-9 border border-[#4338ca] bg-[#4338ca] px-4 text-xs font-medium uppercase tracking-[0.08em] text-white"
                : "h-9 border border-[#d3d7df] bg-[#ffffff] px-4 text-xs font-medium uppercase tracking-[0.08em] text-[#0f172a] hover:border-[#0f172a]"
            }
          >
            {quick.label}
          </button>
        ))}
      </div>

      {filters.from || filters.to ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#5b6270]">
          <span className="inline-flex items-center gap-2 border border-[#d3d7df] bg-white px-3 py-1.5 font-medium text-[#0f172a]">
            {filters.from === filters.to
              ? filters.from
              : `${filters.from ?? "…"} → ${filters.to ?? "…"}`}

            <button
              type="button"
              aria-label="Clear date filter"
              onClick={() => updateFilters({ from: undefined, to: undefined })}
              className="text-[#737a8c] hover:text-[#0f172a]"
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