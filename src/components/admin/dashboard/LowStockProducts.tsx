import Link from "next/link";

import type { LowStockProduct } from "@/types/dashboard";

export function LowStockProducts({
  products,
  loading,
}: {
  products: LowStockProduct[];
  loading: boolean;
}) {
  return (
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
            Stock
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
            Low stock
          </h2>
        </div>

        <Link
          href="/admin/products"
          className="text-xs text-[#70635d] hover:text-[#3f2d2a]"
        >
          View
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-[#958781]">
            Loading stock...
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#958781]">
            No low-stock items.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6ddd4] pb-4 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#3f2d2a]">
                  {product.name}
                </p>

                <p className="mt-1 text-xs text-[#958781]">
                  {product.sku}
                </p>
              </div>

              <span className="shrink-0 text-sm font-medium text-[#a98282]">
                {product.stock}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}