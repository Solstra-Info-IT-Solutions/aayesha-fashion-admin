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
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Customer</p>

      <div className="mt-4 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1ead9] text-lg font-bold text-[#6f542f]">
          {initials(order.customerName || "")}
        </span>

        <div className="min-w-0">
          <p className="display truncate text-2xl font-semibold leading-tight text-[#2a2520]">
            {order.customerName || "Guest customer"}
          </p>
          <p className="text-xs text-[#756d62]">{order.customerEmail ? "Registered contact" : "Guest checkout"}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        {order.customerEmail ? (
          <div className="flex items-center gap-3">
            <Mail size={16} className="shrink-0 text-[#8a8275]" />
            <a href={`mailto:${order.customerEmail}`} className="break-all text-[#2a2520] hover:text-[#8a6a3b]">
              {order.customerEmail}
            </a>
          </div>
        ) : null}

        {order.customerPhone ? (
          <div className="flex items-center gap-3">
            <Phone size={16} className="shrink-0 text-[#8a8275]" />
            <a href={`tel:${order.customerPhone}`} className="text-[#2a2520] hover:text-[#8a6a3b]">
              {order.customerPhone}
            </a>
          </div>
        ) : null}

        {order.paymentWhatsapp ? (
          <div className="flex items-center gap-3">
            <MessageCircle size={16} className="shrink-0 text-[#2a9a68]" />
            <span className="text-[#2a2520]">
              {order.paymentWhatsapp} <span className="text-xs text-[#756d62]">(bill sent here)</span>
            </span>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
