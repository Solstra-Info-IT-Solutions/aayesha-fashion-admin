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
    <section className="border border-[#e5e7ec] bg-[#ffffff] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
        Customer
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
        Customer details
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <User
            size={17}
            className="text-[#737a8c]"
          />

          <div>
            <p className="text-sm text-[#1a1d24]">
              {order.customerName}
            </p>

            <p className="text-xs text-[#737a8c]">
              Customer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail
            size={17}
            className="text-[#737a8c]"
          />

          <p className="break-all text-sm text-[#5b6270]">
            {order.customerEmail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone
            size={17}
            className="text-[#737a8c]"
          />

          <p className="text-sm text-[#5b6270]">
            {order.customerPhone}
          </p>
        </div>
      </div>
    </section>
  );
}