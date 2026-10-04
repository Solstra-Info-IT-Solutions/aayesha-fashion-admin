import Link from "next/link";

import type { LowStockProduct } from "@/types/dashboard";

import { ChartCard } from "./ChartCard";

export function LowStockProducts({
  products,
  loading,
}: {
  products: LowStockProduct[];
  loading?: boolean;
}) {
  return (
    <ChartCard eyebrow="Inventory" title="Low stock" href="/admin/products" hrefLabel="Manage">
      {loading ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">Loading…</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#9a9185]">Everything is well stocked.</p>
      ) : (
        <ul className="divide-y divide-[#2e2a26]">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${encodeURIComponent(product.id)}`}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:text-[#d9c7a3]"
              >
                <span className="min-w-0 truncate font-medium text-[#f8f3f1]">{product.name}</span>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.stock === 0 ? "bg-[#2b1a18] text-[#e08b84]" : "bg-[#2b2216] text-[#e0b56a]"
                  }`}
                >
                  {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
