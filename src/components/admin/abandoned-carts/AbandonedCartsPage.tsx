"use client";

import { useEffect, useState } from "react";
import { MessageCircle, RefreshCw } from "lucide-react";
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
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">Recovery</p>
            <h1 className="mt-1 text-[#2a2520]">
              Abandoned carts
            </h1>

            <p className="mt-1 text-sm text-[#5f584d]">
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
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] hover:bg-[#f1ead9] disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {data === null && !failed ? (
        <p className="text-sm text-[#5f584d]">Loading…</p>
      ) : failed ? (
        <p className="text-sm text-[#b3261e]">Unable to load abandoned carts.</p>
      ) : data && data.carts.length === 0 ? (
        <p className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-8 text-center text-sm text-[#5f584d]">
          No abandoned carts right now.
        </p>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#756d62]">
                Abandoned bags
              </p>
              <p className="display mt-1 text-4xl font-semibold text-[#2a2520]">
                {data.summary.carts}
              </p>
            </div>

            <div className="surface p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#756d62]">
                Value waiting
              </p>
              <p className="display mt-1 text-4xl font-semibold text-[#2a2520]">
                {money(data.summary.value)}
              </p>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {data.carts.map((cart) => {
              const digits = cart.phone.replace(/\D/g, "");
              const wa = digits
                ? `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(
                    `Hi ${cart.customerName}, you left some lovely pieces in your Aayesha Fashion bag. Need any help completing your order?`,
                  )}`
                : "";

              return (
                <div key={cart.cartId} className="surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#2a2520]">{cart.customerName}</p>
                      <p className="truncate text-xs text-[#756d62]">{cart.email}</p>
                    </div>
                    <p className="shrink-0 font-semibold text-[#2a2520]">{money(cart.total)}</p>
                  </div>

                  <div className="mt-3 space-y-0.5 text-sm text-[#5f584d]">
                    {cart.items.slice(0, 3).map((item) => (
                      <p key={item.name}>
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                    {cart.items.length > 3 ? (
                      <p className="text-xs">+{cart.items.length - 3} more</p>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e6dfcf] pt-3 text-xs text-[#5f584d]">
                    <span>
                      Idle {idleLabel(cart.idleHours)} ·{" "}
                      {cart.remindersSent === 0 ? "no reminders yet" : `${cart.remindersSent} of 2 sent`}
                    </span>
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ccb6] px-3 text-xs font-semibold text-[#2a2520] hover:bg-[#f1ead9]"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto surface md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#e6dfcf] text-xs uppercase tracking-wide text-[#5f584d]">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Bag</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                  <th className="px-5 py-3 font-medium">Idle</th>
                  <th className="px-5 py-3 font-medium">Reminders</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e6dfcf]">
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
                        <p className="font-medium text-[#2a2520]">
                          {cart.customerName}
                        </p>
                        <p className="text-xs text-[#5f584d]">
                          {cart.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[#5f584d]">
                        {cart.items.slice(0, 3).map((item) => (
                          <p key={item.name}>
                            {item.name} × {item.quantity}
                          </p>
                        ))}

                        {cart.items.length > 3 ? (
                          <p className="text-xs">+{cart.items.length - 3} more</p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#2a2520]">
                        {money(cart.total)}
                      </td>

                      <td className="px-5 py-4 text-[#5f584d]">
                        {idleLabel(cart.idleHours)}
                      </td>

                      <td className="px-5 py-4 text-[#5f584d]">
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
                            className="inline-flex items-center gap-2 rounded-lg border border-[#e6dfcf] px-3 py-2 text-xs font-medium text-[#2a2520] hover:bg-[#f7f2e7]"
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
