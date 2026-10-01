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
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Delivery</p>
          <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#2a2520]">Shipping address</h2>
        </div>

        {lines.length > 0 ? (
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#d6ccb6] px-2.5 text-xs font-semibold text-[#5f584d] transition hover:border-[#b08d57] hover:text-[#2a2520]"
          >
            {copied ? <Check size={13} className="text-[#2f7d4f]" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex gap-3">
        <MapPin size={17} className="mt-0.5 shrink-0 text-[#8a6a3b]" />

        {lines.length === 0 ? (
          <p className="text-sm text-[#756d62]">No address on this order.</p>
        ) : (
          <address className="text-sm not-italic leading-6 text-[#5f584d]">
            {lines.map((line, index) => (
              <p key={`${line}-${index}`} className={index === 0 ? "font-semibold text-[#2a2520]" : ""}>
                {line}
              </p>
            ))}
          </address>
        )}
      </div>
    </section>
  );
}
