import {
  RefreshCw,
} from "lucide-react";

import type {
  DashboardData,
} from "@/types/dashboard";

import { StatsGrid } from "./StatsGrid";
import { RevenueCard } from "./RevenueCard";
import { OrderStatusCard } from "./OrderStatusCard";
import { RecentOrders } from "./RecentOrders";
import { LowStockProducts } from "./LowStockProducts";
import { TopProducts } from "./TopProducts";

type DashboardHeaderProps =
  DashboardData & {
    loading: boolean;
    error?: string;
    onRefresh: () => void;
  };

export function AdminDashboard({
  summary,
  revenue,
  orderStatus,
  recentOrders,
  lowStockProducts,
  topProducts,
  loading,
  error,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#969696]">
            Overview
          </p>

          <h1 className="mt-1 font-serif text-4xl text-[#171717]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-[#6f706f]">
            A live view of your store
            operations and performance.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 border border-[#d8d1ca] bg-white px-4 text-sm text-[#292c2c] transition hover:border-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          KPI STATS
      ===================================================== */}

      <StatsGrid
        summary={summary}
        loading={loading}
      />

      {/* =====================================================
          REVENUE + ORDER STATUS
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <RevenueCard
          revenue={revenue}
          loading={loading}
        />

        <OrderStatusCard
          statuses={orderStatus}
          loading={loading}
        />
      </div>

      {/* =====================================================
          RECENT ORDERS + LOW STOCK
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <RecentOrders
          orders={recentOrders}
          loading={loading}
        />

        <LowStockProducts
          products={lowStockProducts}
          loading={loading}
        />
      </div>

      {/* =====================================================
          TOP PRODUCTS
      ===================================================== */}

      <TopProducts
        products={topProducts}
        loading={loading}
      />
    </div>
  );
}