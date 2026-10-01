import type {
  AdminOrder,
} from "@/types/order";

export function OrderItemsCard({
  order,
}: {
  order: AdminOrder;
}) {
  return (
    <section className="border border-[#e6ddd4] bg-[#fbf9f5]">
      <div className="border-b border-[#e6ddd4] px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
          Order items
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
          Products
        </h2>
      </div>

      <div className="divide-y divide-[#e6ddd4]">
        {order.items.map(
          (item, index) => {
            const lineTotal =
              item.total ??
              (item.sellingPrice ??
                0) *
                item.quantity;

            return (
              <div
                key={`${item.productId}-${index}`}
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#3f2d2a]">
                    {item.productName ||
                      "Product"}
                  </p>

                  {item.sku && (
                    <p className="mt-1 text-xs text-[#958781]">
                      SKU:{" "}
                      {item.sku}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#70635d]">
                    Qty:{" "}
                    {item.quantity}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium text-[#3f2d2a]">
                    ₹
                    {lineTotal.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  {item.sellingPrice !==
                    undefined && (
                    <p className="mt-1 text-xs text-[#958781]">
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