import {
  Mail,
  Phone,
  User,
} from "lucide-react";

import type {
  AdminOrder,
} from "@/types/order";

export function OrderCustomerCard({
  order,
}: {
  order: AdminOrder;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
        Customer
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#171717]">
        Customer details
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <User
            size={17}
            className="text-[#969696]"
          />

          <div>
            <p className="text-sm text-[#171717]">
              {order.customerName}
            </p>

            <p className="text-xs text-[#969696]">
              Customer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail
            size={17}
            className="text-[#969696]"
          />

          <p className="break-all text-sm text-[#6f706f]">
            {order.customerEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone
            size={17}
            className="text-[#969696]"
          />

          <p className="text-sm text-[#6f706f]">
            {order.customerPhone}
          </p>
        </div>
      </div>
    </section>
  );
}