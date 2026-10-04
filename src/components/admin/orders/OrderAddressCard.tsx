"use client";

import { useState } from "react";
import { Check, Copy, MapPin } from "lucide-react";

import type { AdminOrder } from "@/types/order";

export function OrderAddressCard({ order }: { order: AdminOrder }) {
  const address = order.shippingAddress;
  const [copied, setCopied] = useState(false);

  const lines = [
    address?.name,
    address?.addressLine1,
    address?.addressLine2,
    [address?.city, address?.state, address?.pincode || address?.postalCode].filter(Boolean).join(", "),
    address?.country,
    address?.phone,
  ].filter(Boolean) as string[];

  async function copy() {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: ignore */
    }
  }

  return (
    <section className="surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Delivery</p>
          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#f8f3f1]">Shipping address</h2>
        </div>

        {lines.length > 0 ? (
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#3a352f] px-2.5 text-xs font-semibold text-[#cfc7bb] transition hover:border-[#b79a6a] hover:text-[#f8f3f1]"
          >
            {copied ? <Check size={13} className="text-[#8fb08a]" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex gap-3">
        <MapPin size={17} className="mt-0.5 shrink-0 text-[#d9c7a3]" />

        {lines.length === 0 ? (
          <p className="text-sm text-[#9a9185]">No address on this order.</p>
        ) : (
          <address className="text-sm not-italic leading-6 text-[#cfc7bb]">
            {lines.map((line, index) => (
              <p key={`${line}-${index}`} className={index === 0 ? "font-semibold text-[#f8f3f1]" : ""}>
                {line}
              </p>
            ))}
          </address>
        )}
      </div>
    </section>
  );
}
