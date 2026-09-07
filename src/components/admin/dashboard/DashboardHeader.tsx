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

export function AdminDashboard(
  dashboard: DashboardData & {
    loading?: boolean;
    error?: string;
    onRefresh?: () => void;
  },
) {
  return (
    <div className="space-y-7">
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
          onClick={dashboard.onRefresh}
          className="inline-flex h-10 items-center justify-center gap-2 border border-[#d8d1ca] bg-white px-4 text-sm text-[#292c2c] hover:border-[#292c2c]"
        >
          <RefreshCw
            size={16}
            className={
              dashboard.loading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>
      </div>

      {dashboard.error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {dashboard.error}
        </div>
      )}

      <StatsGrid
        summary={
          dashboard.summary
        }
        loading={
          dashboard.loading
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <RevenueCard
          revenue={
            dashboard.revenue
          }
          loading={
            dashboard.loading
          }
        />

        <OrderStatusCard
          statuses={
            dashboard.orderStatus
          }
          loading={
            dashboard.loading
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <RecentOrders
          orders={
            dashboard.recentOrders
          }
          loading={
            dashboard.loading
          }
        />

        <LowStockProducts
          products={
            dashboard.lowStockProducts
          }
          loading={
            dashboard.loading
          }
        />
      </div>

      <TopProducts
        products={
          dashboard.topProducts
        }
        loading={
          dashboard.loading
        }
      />
    </div>
  );
}