"use client";

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

export function OrdersPage() {
  const {
    orders,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    refresh,
  } = useOrders();

  const filtered = Boolean(
    filters.search ||
      filters.status ||
      filters.paymentStatus ||
      filters.paymentMethod ||
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