import type {
  AdminOrder,
} from "@/types/order";

export function OrderSummaryCard({
  order,
}: {
  order: AdminOrder;
}) {
  const rows = [
    {
      label: "MRP total",
      value: order.mrpTotal,
    },
    {
      label: "Product discount",
      value:
        -order.productDiscount,
    },
    {
      label: "Coupon discount",
      value:
        -order.couponDiscount,
    },
    {
      label: "Shipping",
      value:
        order.shippingAmount,
    },
  ];

  return (
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
        Payment
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
        Order summary
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#70635d]">
            Subtotal
          </span>

          <span className="text-[#3f2d2a]">
            ₹
            {order.subtotal.toLocaleString(
              "en-IN",
            )}
          </span>
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between gap-4 text-sm"
          >
            <span className="text-[#70635d]">
              {row.label}
            </span>

            <span
              className={
                row.value < 0
                  ? "text-[#a98282]"
                  : "text-[#3f2d2a]"
              }
            >
              ₹
              {Math.abs(
                row.value,
              ).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        ))}

        <div className="border-t border-[#e6ddd4] pt-4">
          <div className="flex justify-between gap-4">
            <span className="font-medium text-[#3f2d2a]">
              Total
            </span>

            <span className="font-serif text-2xl text-[#3f2d2a]">
              ₹
              {order.total.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}