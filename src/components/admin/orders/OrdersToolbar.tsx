"use client";

import type {
  OrderListFilters,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

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

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

export function OrdersToolbar({
  filters,
  onChange,
}: {
  filters: OrderListFilters;
  onChange: (
    changes: Partial<OrderListFilters>,
  ) => void;
}) {
  return (
    <div className="border border-[#e7e2dd] bg-white p-4">
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <input
          type="search"
          value={filters.search ?? ""}
          onChange={(event) =>
            onChange({
              search:
                event.target.value ||
                undefined,
            })
          }
          placeholder="Search order, customer, email or phone..."
          className="h-11 border border-[#d8d1ca] px-4 text-sm text-[#171717] outline-none focus:border-[#292c2c]"
        />

        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            onChange({
              status:
                (event.target.value ||
                  undefined) as
                  | OrderStatus
                  | undefined,
            })
          }
          className="h-11 border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#292c2c]"
        >
          <option value="">
            All statuses
          </option>

          {statuses.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace(
                  /_/g,
                  " ",
                )}
              </option>
            ),
          )}
        </select>

        <select
          value={
            filters.paymentStatus ??
            ""
          }
          onChange={(event) =>
            onChange({
              paymentStatus:
                (event.target.value ||
                  undefined) as
                  | PaymentStatus
                  | undefined,
            })
          }
          className="h-11 border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#292c2c]"
        >
          <option value="">
            All payments
          </option>

          {paymentStatuses.map(
            (status) => (
              <option
                key={status}
                value={status}
              >
                {status.replace(
                  /_/g,
                  " ",
                )}
              </option>
            ),
          )}
        </select>

        <select
          value={
            filters.sort ??
            "newest"
          }
          onChange={(event) =>
            onChange({
              sort:
                event.target
                  .value as OrderListFilters["sort"],
            })
          }
          className="h-11 border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#292c2c]"
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="highest_value">
            Highest value
          </option>

          <option value="lowest_value">
            Lowest value
          </option>
        </select>

        <button
          type="button"
          onClick={() =>
            onChange({
              search: undefined,
              status: undefined,
              paymentStatus:
                undefined,
              paymentMethod:
                undefined,
              customerEmail:
                undefined,
              customerPhone:
                undefined,
              sort: "newest",
            })
          }
          className="h-11 border border-[#d8d1ca] px-4 text-sm text-[#6f706f] hover:border-[#292c2c] hover:text-[#171717]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}