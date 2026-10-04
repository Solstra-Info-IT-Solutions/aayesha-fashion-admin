"use client";

import {
  IndianRupee,
  Package,
  Receipt,
  RefreshCw,
  ShoppingBag,
  UserPlus,
  Users,
} from "lucide-react";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { DashboardData } from "@/types/dashboard";

import { AttentionCard } from "./AttentionCard";
import { ExportMenu } from "./ExportMenu";
import { KpiCard } from "./KpiCard";
import { LowStockProducts } from "./LowStockProducts";
import { PaymentMethodsChart } from "./PaymentMethodsChart";
import { RecentOrders } from "./RecentOrders";
import { RevenueChart } from "./RevenueChart";
import { StatusDonut } from "./StatusDonut";
import { TopProductsChart } from "./TopProductsChart";
import { delta, money } from "./format";

type DashboardHeaderProps = DashboardData & {
  days: number;
  setDays: (days: number) => void;
  loading: boolean;
  error?: string | undefined;
  onRefresh: () => void;
};

const RANGES = [7, 30, 90] as const;

export function AdminDashboard({
  summary,
  range,
  current,
  previous,
  trend,
  revenue,
  paymentMethods,
  orderStatus,
  recentOrders,
  lowStockProducts,
  topProducts,
  days,
  setDays,
  loading,
  error,
  onRefresh,
}: DashboardHeaderProps) {
  const { user } = useAdminAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = (user?.name || user?.firstName || "").split(" ")[0];
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const series = trend ?? revenue ?? [];
  const now = current ?? { revenue: 0, paidOrders: 0, orders: 0, newCustomers: 0 };
  const before = previous ?? { revenue: 0, paidOrders: 0, orders: 0, newCustomers: 0 };

  const aov = now.paidOrders ? now.revenue / now.paidOrders : 0;
  const aovBefore = before.paidOrders ? before.revenue / before.paidOrders : 0;

  const vs = `vs previous ${days} days`;
  const window = range ? `from=${range.from}&to=${range.to}` : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">{today}</p>

          <h1 className="mt-1 text-[#f8f3f1]">
            {greeting}{first ? `, ${first}` : ""}
          </h1>

          <p className="mt-2 text-sm text-[#cfc7bb]">
            Here is how the store is doing. Every card, chart and row opens its details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#2e2a26] bg-[#1a1816] p-0.5 text-xs font-semibold" role="tablist" aria-label="Date range">
            {RANGES.map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={days === value}
                onClick={() => setDays(value)}
                className={`rounded-md px-3.5 py-2 transition ${
                  days === value ? "bg-[#b79a6a] text-[#111111]" : "text-[#cfc7bb] hover:text-[#f8f3f1]"
                }`}
              >
                {value}D
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <ExportMenu from={range?.from} to={range?.to} />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 text-sm text-[#f0a39d]">{error}</div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          href={`/admin/orders?paymentStatus=paid${window ? `&${window}` : ""}`}
          label="Revenue"
          value={money(now.revenue)}
          icon={IndianRupee}
          change={delta(now.revenue, before.revenue)}
          caption={vs}
          spark={series.map((point) => point.revenue)}
          loading={loading}
        />

        <KpiCard
          href={`/admin/orders${window ? `?${window}` : ""}`}
          label="Orders"
          value={`${now.orders}`}
          icon={ShoppingBag}
          change={delta(now.orders, before.orders)}
          caption={vs}
          spark={series.map((point) => point.orders)}
          loading={loading}
        />

        <KpiCard
          href={`/admin/orders?paymentStatus=paid${window ? `&${window}` : ""}`}
          label="Avg. order value"
          value={money(aov)}
          icon={Receipt}
          change={delta(aov, aovBefore)}
          caption={vs}
          loading={loading}
        />

        <KpiCard
          href="/admin/customers"
          label="New customers"
          value={`${now.newCustomers}`}
          icon={UserPlus}
          change={delta(now.newCustomers, before.newCustomers)}
          caption={vs}
          loading={loading}
        />

        <KpiCard
          href="/admin/customers"
          label="All customers"
          value={`${summary.customers}`}
          icon={Users}
          caption="Registered"
          loading={loading}
        />

        <KpiCard
          href="/admin/products"
          label="Products"
          value={`${summary.products}`}
          icon={Package}
          caption="In catalog"
          loading={loading}
        />
      </div>

      <AttentionCard />

      <div className="grid gap-6 xl:grid-cols-3">
        <RevenueChart trend={series} loading={loading} />

        <StatusDonut statuses={orderStatus} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentMethodsChart
          methods={paymentMethods ?? []}
          from={range?.from}
          to={range?.to}
          loading={loading}
        />

        <TopProductsChart products={topProducts} loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentOrders orders={recentOrders} loading={loading} />

        <LowStockProducts products={lowStockProducts} loading={loading} />
      </div>

      <p className="pb-2 text-center text-xs text-[#9a9185]">
        Revenue counts paid, non-cancelled orders. Period: {range ? `${range.from} → ${range.to}` : "—"}.
      </p>
    </div>
  );
}
