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
        <p className="py-10 text-center text-sm text-[#737a8c]">Loading…</p>
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#737a8c]">Everything is well stocked.</p>
      ) : (
        <ul className="divide-y divide-[#e5e7ec]">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/products/${encodeURIComponent(product.id)}`}
                className="flex items-center justify-between gap-3 py-3 text-sm hover:text-[#4338ca]"
              >
                <span className="min-w-0 truncate font-medium text-[#0f172a]">{product.name}</span>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.stock === 0 ? "bg-[#fdecec] text-[#b3261e]" : "bg-[#fdf3e1] text-[#7f4806]"
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
