import { Mail, MessageCircle, Phone } from "lucide-react";

import type { AdminOrder } from "@/types/order";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("") || "G";

export function OrderCustomerCard({ order }: { order: AdminOrder }) {
  return (
    <section className="surface p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Customer</p>

      <div className="mt-4 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2a241b] text-lg font-bold text-[#d9c7a3]">
          {initials(order.customerName || "")}
        </span>

        <div className="min-w-0">
          <p className="display truncate text-2xl font-semibold leading-tight text-[#f8f3f1]">
            {order.customerName || "Guest customer"}
          </p>
          <p className="text-xs text-[#9a9185]">{order.customerEmail ? "Registered contact" : "Guest checkout"}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        {order.customerEmail ? (
          <div className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-[#9a9185]" />
            <a href={`mailto:${order.customerEmail}`} className="break-all text-[#f8f3f1] hover:text-[#d9c7a3]">
              {order.customerEmail}
            </a>
          </div>
        ) : null}

        {order.customerPhone ? (
          <div className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-[#9a9185]" />
            <a href={`tel:${order.customerPhone}`} className="text-[#f8f3f1] hover:text-[#d9c7a3]">
              {order.customerPhone}
            </a>
          </div>
        ) : null}

        {order.paymentWhatsapp ? (
          <div className="flex items-center gap-3">
            <MessageCircle size={16} className="shrink-0 text-[#8fb08a]" />
            <span className="text-[#f8f3f1]">
              {order.paymentWhatsapp} <span className="text-xs text-[#9a9185]">(bill sent here)</span>
            </span>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
