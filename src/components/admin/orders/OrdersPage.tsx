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

export function OrdersPage({
  initialQuick = "all",
}: {
  initialQuick?: OrderQuickFilter;
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
  } = useOrders(
    quickFilterToFilters(initialQuick),
  );

  const activeQuick =
    activeQuickFilter(filters);

  const filtered = Boolean(
    filters.search ||
      filters.status ||
      filters.paymentStatus ||
      filters.paymentMethod ||
      filters.paymentClaimed ||
      filters.customerEmail ||
      filters.customerPhone,
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
                ? "h-9 border border-[#7a5650] bg-[#7a5650] px-4 text-xs font-medium uppercase tracking-[0.08em] text-white"
                : "h-9 border border-[#d8cec5] bg-[#fbf9f5] px-4 text-xs font-medium uppercase tracking-[0.08em] text-[#3f2d2a] hover:border-[#3f2d2a]"
            }
          >
            {quick.label}
          </button>
        ))}
      </div>

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