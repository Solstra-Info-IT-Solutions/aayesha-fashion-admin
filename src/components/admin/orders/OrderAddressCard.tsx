import {
  MapPin,
} from "lucide-react";

import type {
  AdminOrder,
} from "@/types/order";

export function OrderAddressCard({
  order,
}: {
  order: AdminOrder;
}) {
  const address =
    order.shippingAddress;

  return (
    <section className="border border-[#e6dfcf] bg-[#fffdf8] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#756d62]">
        Delivery
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#2a2520]">
        Shipping address
      </h2>

      <div className="mt-6 flex gap-3">
        <MapPin
          size={17}
          className="mt-0.5 shrink-0 text-[#756d62]"
        />

        <div className="text-sm leading-6 text-[#5f584d]">
          {address?.name && (
            <p className="font-medium text-[#2a2520]">
              {address.name}
            </p>
          )}

          {address?.addressLine1 && (
            <p>{address.addressLine1}</p>
          )}

          {address?.addressLine2 && (
            <p>{address.addressLine2}</p>
          )}

          <p>
            {[
              address?.city,
              address?.state,
              address?.pincode ||
                address?.postalCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          {address?.country && (
            <p>
              {address.country}
            </p>
          )}

          {address?.phone && (
            <p className="mt-2">
              {address.phone}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}