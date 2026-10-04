"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, Clock3, ShoppingBag, WalletCards } from "lucide-react";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getAbandonedCarts } from "@/services/abandoned-cart.service";
import { getAdminOrders } from "@/services/order.service";
import { getStockAlertDemand } from "@/services/stock-alert.service";

type Counts = {
  awaiting: number;
  reported: number;
  abandoned: number;
  waiting: number;
};

/** What needs the store's attention today, with links to act on it. */
export function AttentionCard() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    const base = { page: 1, limit: 1 } as const;

    Promise.allSettled([
      getAdminOrders(
        { ...base, paymentStatus: "pending", paymentMethod: "bank_upi" },
        accessToken,
      ),
      getAdminOrders(
        {
          ...base,
          paymentStatus: "pending",
          paymentMethod: "bank_upi",
          paymentClaimed: true,
        },
        accessToken,
      ),
      getAbandonedCarts(accessToken),
      getStockAlertDemand(accessToken),
    ]).then(([awaiting, reported, abandoned, stock]) => {
      if (cancelled) return;

      setCounts({
        awaiting:
          awaiting.status === "fulfilled" ? awaiting.value.pagination.total : 0,
        reported:
          reported.status === "fulfilled" ? reported.value.pagination.total : 0,
        abandoned:
          abandoned.status === "fulfilled" ? abandoned.value.summary.carts : 0,
        waiting:
          stock.status === "fulfilled"
            ? stock.value.reduce((sum, row) => sum + row.waiting, 0)
            : 0,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  const items = [
    {
      href: "/admin/orders?quick=reported",
      icon: WalletCards,
      label: "Payments to verify",
      value: counts?.reported,
      hint: "Customer sent a UTR",
      hot: (counts?.reported ?? 0) > 0,
    },
    {
      href: "/admin/orders?quick=awaiting",
      icon: Clock3,
      label: "Awaiting payment",
      value: counts?.awaiting,
      hint: "Auto-cancel after 30 min",
      hot: false,
    },
    {
      href: "/admin/abandoned-carts",
      icon: ShoppingBag,
      label: "Abandoned carts",
      value: counts?.abandoned,
      hint: "Idle for 24 h or more",
      hot: false,
    },
    {
      href: "/admin/stock-alerts",
      icon: BellRing,
      label: "Back-in-stock requests",
      value: counts?.waiting,
      hint: "Customers waiting",
      hot: false,
    },
  ];

  return (
    <section className="surface p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">
        Action centre
      </p>

      <h2 className="mt-1 text-lg font-bold text-[#f8f3f1]">Needs attention today</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.hot
                  ? "rounded-xl border border-amber-300 bg-amber-50 p-4 transition hover:border-amber-500 hover:shadow-md"
                  : "rounded-xl border border-[#2e2a26] p-4 transition hover:border-[#b79a6a] hover:shadow-md"
              }
            >
              <div className="flex items-center justify-between text-[#cfc7bb]">
                <Icon size={18} strokeWidth={1.5} />

                <span className="text-3xl font-bold text-[#f8f3f1]">
                  {item.value ?? "–"}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-[#f8f3f1]">
                {item.label}
              </p>

              <p className="text-xs text-[#9a9185]">{item.hint}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
