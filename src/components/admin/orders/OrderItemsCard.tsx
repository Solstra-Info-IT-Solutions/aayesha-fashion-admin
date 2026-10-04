import type { AdminOrder } from "@/types/order";

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

export function OrderItemsCard({ order }: { order: AdminOrder }) {
  const count = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  return (
    <section className="surface overflow-hidden">
      <div className="flex items-end justify-between gap-3 border-b border-[#2e2a26] px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Order items</p>
          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#f8f3f1]">Products</h2>
        </div>

        <span className="rounded-full bg-[#2a241b] px-3 py-1 text-xs font-bold text-[#d9c7a3]">
          {count} item{count === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="divide-y divide-[#2e2a26]">
        {order.items.map((item, index) => {
          const lineTotal = item.total ?? (item.sellingPrice ?? 0) * item.quantity;
          const saved =
            item.mrp !== undefined && item.sellingPrice !== undefined
              ? Math.max(0, (item.mrp - item.sellingPrice) * item.quantity)
              : 0;

          return (
            <li key={`${item.productId}-${index}`} className="flex gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#2e2a26] bg-[#2a241b]">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#d9c7a3]">No image</span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#f8f3f1]">{item.productName || "Product"}</p>

                  {item.sku ? <p className="mt-0.5 text-xs text-[#9a9185]">SKU {item.sku}</p> : null}

                  <p className="mt-2 inline-flex rounded-full border border-[#2e2a26] bg-[#1a1816] px-2.5 py-0.5 text-xs font-semibold text-[#cfc7bb]">
                    Qty {item.quantity}
                    {item.sellingPrice !== undefined ? ` × ${money(item.sellingPrice)}` : ""}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-base font-bold text-[#f8f3f1]">{money(lineTotal)}</p>

                  {saved > 0 ? (
                    <p className="mt-0.5 text-xs font-semibold text-[#8fb08a]">Saved {money(saved)}</p>
                  ) : null}

                  {item.mrp !== undefined && item.sellingPrice !== undefined && item.mrp > item.sellingPrice ? (
                    <p className="text-xs text-[#9a9185] line-through">{money(item.mrp * item.quantity)}</p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
