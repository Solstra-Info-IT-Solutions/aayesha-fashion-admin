import type {
  AdminOrder,
} from "@/types/order";

export function OrderItemsCard({
  order,
}: {
  order: AdminOrder;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white">
      <div className="border-b border-[#eee9e4] px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
          Order items
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#171717]">
          Products
        </h2>
      </div>

      <div className="divide-y divide-[#f0ece8]">
        {order.items.map(
          (item, index) => {
            const lineTotal =
              item.total ??
              (item.sellingPrice ??
                0) *
                item.quantity;

            return (
              <div
                key={`${item.variantId}-${index}`}
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#171717]">
                    {item.productName ||
                      "Product"}
                  </p>

                  {item.sku && (
                    <p className="mt-1 text-xs text-[#969696]">
                      SKU:{" "}
                      {item.sku}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#6f706f]">
                    Qty:{" "}
                    {item.quantity}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-[#171717]">
                    ₹
                    {lineTotal.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  {item.sellingPrice !==
                    undefined && (
                    <p className="mt-1 text-xs text-[#969696]">
                      ₹
                      {item.sellingPrice.toLocaleString(
                        "en-IN",
                      )}{" "}
                      each
                    </p>
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}