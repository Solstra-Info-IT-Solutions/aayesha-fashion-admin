"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";

import type { OrderListFilters, OrderStatus, PaymentStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "exchanged",
];

const paymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded", "partially_refunded"];

const label = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const control =
  "h-11 w-full rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#8c847d] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#b79a6a]/20";

export const EMPTY_FILTERS: Partial<OrderListFilters> = {
  search: undefined,
  status: undefined,
  paymentStatus: undefined,
  paymentMethod: undefined,
  paymentClaimed: undefined,
  customerEmail: undefined,
  customerPhone: undefined,
  from: undefined,
  to: undefined,
  sort: "newest",
};

export function OrdersToolbar({
  filters,
  onChange,
}: {
  filters: OrderListFilters;
  onChange: (changes: Partial<OrderListFilters>) => void;
}) {
  // Search is debounced so we do not hit the API on every keystroke.
  const [text, setText] = useState(filters.search ?? "");
  const [open, setOpen] = useState(false);
  const lastSent = useRef(filters.search ?? "");

  useEffect(() => {
    // Keep the box in step when filters are reset from outside.
    if ((filters.search ?? "") !== lastSent.current) {
      lastSent.current = filters.search ?? "";
      setText(filters.search ?? "");
    }
  }, [filters.search]);

  useEffect(() => {
    if (text === lastSent.current) return;

    const timer = window.setTimeout(() => {
      lastSent.current = text;
      onChange({ search: text.trim() || undefined });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [text, onChange]);

  const chips: Array<{ key: string; text: string; clear: Partial<OrderListFilters> }> = [];

  if (filters.status) chips.push({ key: "status", text: `Status: ${label(filters.status)}`, clear: { status: undefined } });
  if (filters.paymentStatus) chips.push({ key: "pay", text: `Payment: ${label(filters.paymentStatus)}`, clear: { paymentStatus: undefined } });
  if (filters.paymentMethod) chips.push({ key: "method", text: `Method: ${label(filters.paymentMethod)}`, clear: { paymentMethod: undefined } });
  if (filters.paymentClaimed) chips.push({ key: "claimed", text: "Customer reported paid", clear: { paymentClaimed: undefined } });
  if (filters.customerEmail) chips.push({ key: "email", text: filters.customerEmail, clear: { customerEmail: undefined } });
  if (filters.customerPhone) chips.push({ key: "phone", text: filters.customerPhone, clear: { customerPhone: undefined } });

  const filtered = chips.length > 0 || Boolean(filters.search || filters.from || filters.to);

  return (
    <div className="surface p-4">
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a9185]" />

          <input
            type="search"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Search order no., customer, email or phone"
            aria-label="Search orders"
            className={`${control} pl-10`}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] text-sm font-semibold text-[#f8f3f1] lg:hidden"
        >
          <SlidersHorizontal size={15} />
          {open ? "Hide filters" : `Filters${chips.length || filters.from || filters.to ? " •" : ""}`}
        </button>

        <div className={`${open ? "grid" : "hidden"} gap-3 lg:contents`}>
        <select
          value={filters.status ?? ""}
          onChange={(event) => onChange({ status: (event.target.value || undefined) as OrderStatus | undefined })}
          aria-label="Order status"
          className={control}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {label(status)}
            </option>
          ))}
        </select>

        <select
          value={filters.paymentStatus ?? ""}
          onChange={(event) => onChange({ paymentStatus: (event.target.value || undefined) as PaymentStatus | undefined })}
          aria-label="Payment status"
          className={control}
        >
          <option value="">All payments</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {label(status)}
            </option>
          ))}
        </select>

        <select
          value={filters.paymentMethod ?? ""}
          onChange={(event) => onChange({ paymentMethod: event.target.value || undefined })}
          aria-label="Payment method"
          className={control}
        >
          <option value="">All methods</option>
          <option value="bank_upi">Bank / UPI</option>
          <option value="online">Online (Razorpay)</option>
          <option value="cod">Cash on Delivery</option>
        </select>
        </div>
      </div>

      <div className={`${open ? "flex" : "hidden"} mt-3 flex-wrap items-center gap-3 lg:flex`}>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#cfc7bb]">
          <CalendarDays size={16} className="text-[#9a9185]" />

          <input
            type="date"
            value={filters.from ?? ""}
            max={filters.to || undefined}
            onChange={(event) => onChange({ from: event.target.value || undefined })}
            aria-label="From date"
            className={`${control} !h-10 !w-auto`}
          />

          <span>to</span>

          <input
            type="date"
            value={filters.to ?? ""}
            min={filters.from || undefined}
            onChange={(event) => onChange({ to: event.target.value || undefined })}
            aria-label="To date"
            className={`${control} !h-10 !w-auto`}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-[#cfc7bb]">
            Sort
            <select
              value={filters.sort ?? "newest"}
              onChange={(event) => onChange({ sort: event.target.value as OrderListFilters["sort"] })}
              aria-label="Sort orders"
              className={`${control} !h-10 !w-auto`}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest_value">Highest value</option>
              <option value="lowest_value">Lowest value</option>
            </select>
          </label>

          {filtered ? (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="h-10 rounded-lg px-3 text-sm font-semibold text-[#d9c7a3] hover:bg-[#2a241b]"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-[#2e2a26] pt-3">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2a241b] py-1 pl-3 pr-1.5 text-xs font-semibold text-[#d9c7a3]"
            >
              {chip.text}
              <button
                type="button"
                onClick={() => onChange(chip.clear)}
                aria-label={`Remove filter ${chip.text}`}
                className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-[#3a352f]"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
