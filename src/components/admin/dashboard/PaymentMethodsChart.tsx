"use client";

import Link from "next/link";
import type { PaymentMethodSummary } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { methodColor, methodLabel, money } from "./format";

/** Horizontal bars (HTML) - one row per method, labelled with its value. */
export function PaymentMethodsChart({
  methods,
  from,
  to,
  loading,
}: {
  methods: PaymentMethodSummary[];
  from?: string | undefined;
  to?: string | undefined;
  loading?: boolean;
}) {
  const max = Math.max(...methods.map((method) => method.total), 1);
  const total = methods.reduce((sum, method) => sum + method.total, 0);
  const range = from && to ? `&from=${from}&to=${to}` : "";

  return (
    <ChartCard eyebrow="Payments" title="Sales by payment method">
      {loading ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">Loading…</p>
      ) : methods.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">No orders in this period.</p>
      ) : (
        <ul className="space-y-4">
          {methods.map((method) => (
            <li key={method.method}>
              <Link
                href={`/admin/orders?paymentMethod=${encodeURIComponent(method.method)}${range}`}
                className="group block"
              >
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-[#f8f3f1] group-hover:text-[#d9c7a3]">
                    {methodLabel(method.method)}
                  </span>

                  <span className="text-[#cfc7bb]">
                    <span className="font-semibold text-[#f8f3f1]">{money(method.total)}</span>{" "}
                    · {method.count} order{method.count === 1 ? "" : "s"} ·{" "}
                    {total ? Math.round((method.total / total) * 100) : 0}%
                  </span>
                </div>

                <div className="mt-1.5 h-2 w-full rounded-full bg-[#211e1b]">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${Math.max(3, (method.total / max) * 100)}%`, background: methodColor(method.method) }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
