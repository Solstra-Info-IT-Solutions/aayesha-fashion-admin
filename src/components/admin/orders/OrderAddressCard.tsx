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
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
        Delivery
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
        Shipping address
      </h2>

      <div className="mt-6 flex gap-3">
        <MapPin
          size={17}
          className="mt-0.5 shrink-0 text-[#958781]"
        />

        <div className="text-sm leading-6 text-[#70635d]">
          {address?.name && (
            <p className="font-medium text-[#3f2d2a]">
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