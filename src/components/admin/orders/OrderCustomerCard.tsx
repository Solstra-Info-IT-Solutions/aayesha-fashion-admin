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
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
        Customer
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
        Customer details
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <User
            size={17}
            className="text-[#958781]"
          />

          <div>
            <p className="text-sm text-[#3f2d2a]">
              {order.customerName}
            </p>

            <p className="text-xs text-[#958781]">
              Customer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail
            size={17}
            className="text-[#958781]"
          />

          <p className="break-all text-sm text-[#70635d]">
            {order.customerEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone
            size={17}
            className="text-[#958781]"
          />

          <p className="text-sm text-[#70635d]">
            {order.customerPhone}
          </p>
        </div>
      </div>
    </section>
  );
}