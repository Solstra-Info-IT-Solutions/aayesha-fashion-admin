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
    <section className="border border-[#e7e2dd] bg-white p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
        Needs attention
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#171717]">Today</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.hot
                  ? "border border-amber-300 bg-amber-50 p-4 transition hover:border-amber-500"
                  : "border border-[#e7e2dd] p-4 transition hover:border-[#292c2c]"
              }
            >
              <div className="flex items-center justify-between text-[#6f706f]">
                <Icon size={18} strokeWidth={1.5} />

                <span className="font-serif text-3xl text-[#171717]">
                  {item.value ?? "–"}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-[#171717]">
                {item.label}
              </p>

              <p className="text-xs text-[#969696]">{item.hint}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
