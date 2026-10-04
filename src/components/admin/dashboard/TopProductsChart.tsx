"use client";

import Link from "next/link";
import type { TopProduct } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";
import { money } from "./format";

/** Best sellers by revenue; each row opens the product. */
export function TopProductsChart({
  products,
  loading,
}: {
  products: TopProduct[];
  loading?: boolean;
}) {
  const top = products.slice(0, 6);
  const max = Math.max(...top.map((product) => product.revenue), 1);

  return (
    <ChartCard eyebrow="Catalog" title="Top products" href="/admin/products" hrefLabel="All products">
      {loading ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">Loading…</p>
      ) : top.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">No sales yet.</p>
      ) : (
        <ol className="space-y-4">
          {top.map((product, index) => (
            <li key={`${product.id}-${index}`}>
              <Link
                href={product.id ? `/admin/products/${encodeURIComponent(product.id)}` : "/admin/products"}
                className="group block"
              >
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate font-medium text-[#f8f3f1] group-hover:text-[#d9c7a3]">
                    <span className="mr-2 text-[#9a9185]">{index + 1}.</span>
                    {product.name}
                  </span>

                  <span className="shrink-0 text-[#cfc7bb]">
                    <span className="font-semibold text-[#f8f3f1]">{money(product.revenue)}</span>{" "}
                    · {product.unitsSold} sold
                  </span>
                </div>

                <div className="mt-1.5 h-2 w-full rounded-full bg-[#211e1b]">
                  <div
                    className="h-2 rounded-full bg-[#b79a6a] transition-all group-hover:bg-[#b79a6a]"
                    style={{ width: `${Math.max(3, (product.revenue / max) * 100)}%` }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </ChartCard>
  );
}
