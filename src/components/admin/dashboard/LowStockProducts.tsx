import Link from "next/link";

import type {
  LowStockProduct,
} from "@/types/dashboard";

export function LowStockProducts({
  products,
  loading,
}: {
  products: LowStockProduct[];
  loading: boolean;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
            Inventory
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#171717]">
            Low stock
          </h2>
        </div>

        <Link
          href="/admin/inventory"
          className="text-xs text-[#6f706f] hover:text-[#171717]"
        >
          View
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-[#969696]">
            Loading inventory...
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#969696]">
            No low-stock items.
          </p>
        ) : (
          products.map(
            (product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 border-b border-[#f0ece8] pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#171717]">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-[#969696]">
                    {product.sku}
                  </p>
                </div>

                <span className="shrink-0 text-sm font-medium text-[#d98791]">
                  {product.stock}
                </span>
              </div>
            ),
          )
        )}
      </div>
    </section>
  );
}