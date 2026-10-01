"use client";

import { useEffect, useState } from "react";
import { MessageCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  getAbandonedCarts,
  type AbandonedCartsResult,
} from "@/services/abandoned-cart.service";

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

const idleLabel = (hours: number) =>
  hours >= 48 ? `${Math.floor(hours / 24)} days` : `${hours} hours`;

export default function AbandonedCartsPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [data, setData] = useState<AbandonedCartsResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    let cancelled = false;

    getAbandonedCarts(accessToken)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFailed(false);
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(true);
        toast.error(
          error instanceof Error ? error.message : "Unable to load abandoned carts.",
        );
      })
      .finally(() => {
        if (!cancelled) setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken, reloadKey]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#2b3a55]">
            <ShoppingBag size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Abandoned carts
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Bags left untouched for 24 hours or more. Customers get an in-app
              reminder after 24 h and again after 72 h (plus an email if they
              opted in).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            setReloadKey((key) => key + 1);
          }}
          disabled={refreshing}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[#ffffff] px-4 text-sm font-medium text-[var(--color-ink)] hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {data === null && !failed ? (
        <p className="text-sm text-[var(--color-secondary)]">Loading…</p>
      ) : failed ? (
        <p className="text-sm text-red-600">Unable to load abandoned carts.</p>
      ) : data && data.carts.length === 0 ? (
        <p className="rounded-2xl border border-[var(--color-border)] bg-[#ffffff] p-8 text-center text-sm text-[var(--color-secondary)]">
          No abandoned carts right now.
        </p>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[#ffffff] p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-[var(--color-secondary)]">
                Abandoned bags
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">
                {data.summary.carts}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[#ffffff] p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-[var(--color-secondary)]">
                Value waiting
              </p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">
                {money(data.summary.value)}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[#ffffff] shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-secondary)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Bag</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                  <th className="px-5 py-3 font-medium">Idle</th>
                  <th className="px-5 py-3 font-medium">Reminders</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--color-border)]">
                {data.carts.map((cart) => {
                  const digits = cart.phone.replace(/\D/g, "");
                  const wa = digits
                    ? `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(
                        `Hi ${cart.customerName}, you left some lovely pieces in your Aayesha Fashion bag. Need any help completing your order?`,
                      )}`
                    : "";

                  return (
                    <tr key={cart.cartId} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-medium text-[var(--color-ink)]">
                          {cart.customerName}
                        </p>
                        <p className="text-xs text-[var(--color-secondary)]">
                          {cart.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[var(--color-secondary)]">
                        {cart.items.slice(0, 3).map((item) => (
                          <p key={item.name}>
                            {item.name} × {item.quantity}
                          </p>
                        ))}

                        {cart.items.length > 3 ? (
                          <p className="text-xs">+{cart.items.length - 3} more</p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[var(--color-ink)]">
                        {money(cart.total)}
                      </td>

                      <td className="px-5 py-4 text-[var(--color-secondary)]">
                        {idleLabel(cart.idleHours)}
                      </td>

                      <td className="px-5 py-4 text-[var(--color-secondary)]">
                        {cart.remindersSent === 0
                          ? "None yet"
                          : `${cart.remindersSent} of 2 sent`}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-ink)] hover:bg-gray-50"
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
