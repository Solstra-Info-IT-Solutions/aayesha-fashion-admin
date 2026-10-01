import type { AdminOrder } from "@/types/order";

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

export function OrderItemsCard({ order }: { order: AdminOrder }) {
  const count = order.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  return (
    <section className="surface overflow-hidden">
      <div className="flex items-end justify-between gap-3 border-b border-[#e6dfcf] px-5 py-5 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Order items</p>
          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#2a2520]">Products</h2>
        </div>

        <span className="rounded-full bg-[#f1ead9] px-3 py-1 text-xs font-bold text-[#6f542f]">
          {count} item{count === 1 ? "" : "s"}
        </span>
      </div>

      <ul className="divide-y divide-[#e6dfcf]">
        {order.items.map((item, index) => {
          const lineTotal = item.total ?? (item.sellingPrice ?? 0) * item.quantity;
          const saved =
            item.mrp !== undefined && item.sellingPrice !== undefined
              ? Math.max(0, (item.mrp - item.sellingPrice) * item.quantity)
              : 0;

          return (
            <li key={`${item.productId}-${index}`} className="flex gap-4 px-5 py-5 sm:px-6">
              <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#e6dfcf] bg-[#f1ead9]">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#8a6a3b]">No image</span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2a2520]">{item.productName || "Product"}</p>

                  {item.sku ? <p className="mt-0.5 text-xs text-[#756d62]">SKU {item.sku}</p> : null}

                  <p className="mt-2 inline-flex rounded-full border border-[#e6dfcf] bg-[#faf6ec] px-2.5 py-0.5 text-xs font-semibold text-[#5f584d]">
                    Qty {item.quantity}
                    {item.sellingPrice !== undefined ? ` × ${money(item.sellingPrice)}` : ""}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-base font-bold text-[#2a2520]">{money(lineTotal)}</p>

                  {saved > 0 ? (
                    <p className="mt-0.5 text-xs font-semibold text-[#2f7d4f]">Saved {money(saved)}</p>
                  ) : null}

                  {item.mrp !== undefined && item.sellingPrice !== undefined && item.mrp > item.sellingPrice ? (
                    <p className="text-xs text-[#756d62] line-through">{money(item.mrp * item.quantity)}</p>
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
