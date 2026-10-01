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
    <section className="border border-[#e5e7ec] bg-[#ffffff] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
        Payment
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#0f172a]">
        Order summary
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#5b6270]">
            Subtotal
          </span>

          <span className="text-[#0f172a]">
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
            <span className="text-[#5b6270]">
              {row.label}
            </span>

            <span
              className={
                row.value < 0
                  ? "text-[#4338ca]"
                  : "text-[#0f172a]"
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

        <div className="border-t border-[#e5e7ec] pt-4">
          <div className="flex justify-between gap-4">
            <span className="font-medium text-[#0f172a]">
              Total
            </span>

            <span className="font-serif text-2xl text-[#0f172a]">
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