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
    <section className="border border-[#e7e2dd] bg-white p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
        Payment
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#171717]">
        Order summary
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-[#6f706f]">
            Subtotal
          </span>

          <span className="text-[#171717]">
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
            <span className="text-[#6f706f]">
              {row.label}
            </span>

            <span
              className={
                row.value < 0
                  ? "text-[#d98791]"
                  : "text-[#171717]"
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

        <div className="border-t border-[#e7e2dd] pt-4">
          <div className="flex justify-between gap-4">
            <span className="font-medium text-[#171717]">
              Total
            </span>

            <span className="font-serif text-2xl text-[#171717]">
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