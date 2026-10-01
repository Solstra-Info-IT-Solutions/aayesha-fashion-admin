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
    <section className="border border-[#e6dfcf] bg-[#fffdf8] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#756d62]">
        Payment
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#2a2520]">
        Order summary
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#5f584d]">
            Subtotal
          </span>

          <span className="text-[#2a2520]">
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
            <span className="text-[#5f584d]">
              {row.label}
            </span>

            <span
              className={
                row.value < 0
                  ? "text-[#26221d]"
                  : "text-[#2a2520]"
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

        <div className="border-t border-[#e6dfcf] pt-4">
          <div className="flex justify-between gap-4">
            <span className="font-medium text-[#2a2520]">
              Total
            </span>

            <span className="font-serif text-2xl text-[#2a2520]">
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