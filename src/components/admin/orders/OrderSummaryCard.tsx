import type { AdminOrder } from "@/types/order";

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

export function OrderSummaryCard({ order }: { order: AdminOrder }) {
  const saved = (order.productDiscount ?? 0) + (order.couponDiscount ?? 0);

  const rows: Array<{ label: string; value: string; tone?: "save" }> = [
    { label: "Subtotal", value: money(order.subtotal) },
  ];

  if (order.productDiscount > 0) {
    rows.push({ label: "Product discount", value: `− ${money(order.productDiscount)}`, tone: "save" });
  }

  if (order.couponDiscount > 0) {
    rows.push({
      label: order.couponCode ? `Coupon ${order.couponCode}` : "Coupon discount",
      value: `− ${money(order.couponDiscount)}`,
      tone: "save",
    });
  }

  rows.push({ label: "Shipping", value: order.shippingAmount > 0 ? money(order.shippingAmount) : "Free" });

  return (
    <section className="surface p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Payment</p>
      <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#2a2520]">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-[#5f584d]">{row.label}</dt>
            <dd className={row.tone === "save" ? "font-semibold text-[#2f7d4f]" : "font-medium text-[#2a2520]"}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#e6dfcf] pt-4">
        <span className="text-sm font-semibold text-[#2a2520]">Total</span>
        <span className="display text-4xl font-semibold leading-none text-[#2a2520]">{money(order.total)}</span>
      </div>

      {saved > 0 ? (
        <p className="mt-4 rounded-lg bg-[#e8f5ec] px-3 py-2 text-xs font-semibold text-[#276541]">
          The customer saved {money(saved)} on this order.
        </p>
      ) : null}
    </section>
  );
}
