"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import type { Coupon } from "@/types/discount";

type DiscountTableProps = {
  discounts: Coupon[];
  onToggleStatus: (
    discount: Coupon,
  ) => void;
  onDelete: (
    discount: Coupon,
  ) => void;
  actionLoadingId?: string | null;
};

const statusConfig: Record<
  Coupon["lifecycleStatus"],
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-gray-100 text-gray-600",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-50 text-blue-700",
  },
  expired: {
    label: "Expired",
    className:
      "bg-red-50 text-red-700",
  },
};

function formatDate(
  value: string | null,
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDiscount(
  discount: Coupon,
) {
  switch (discount.discountType) {
    case "percentage":
      return `${discount.discountValue}%`;

    case "fixed":
      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        },
      ).format(
        discount.discountValue,
      );

    case "free_shipping":
      return "Free Shipping";

    default:
      return "—";
  }
}

function usageText(
  discount: Coupon,
) {
  if (discount.usageLimit === null) {
    return `${discount.usedCount} / Unlimited`;
  }

  return `${discount.usedCount} / ${discount.usageLimit}`;
}

export default function DiscountTable({
  discounts,
  onToggleStatus,
  onDelete,
  actionLoadingId = null,
}: DiscountTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-gray-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Coupon
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Discount
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Usage
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Start Date
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                End Date
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Status
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {discounts.map((discount) => {
              const status =
                statusConfig[
                  discount.lifecycleStatus
                ];

              const isLoading =
                actionLoadingId ===
                discount._id;

              return (
                <tr
                  key={discount._id}
                  className="border-b border-[var(--color-border)] last:border-b-0 transition hover:bg-gray-50/60"
                >
                  {/* Coupon */}
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/discounts/${discount._id}`}
                        className="inline-flex max-w-[240px] items-center rounded-md bg-[var(--color-rose-light)] px-2.5 py-1 font-mono text-sm font-semibold tracking-wide text-[#9f1239] transition hover:bg-pink-100"
                      >
                        {discount.code}
                      </Link>

                      {discount.description && (
                        <p className="mt-1.5 max-w-[260px] truncate text-xs text-[var(--color-secondary)]">
                          {discount.description}
                        </p>
                      )}

                      {discount.firstOrderOnly && (
                        <span className="mt-2 inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700">
                          First Order
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-[var(--color-ink)]">
                      {formatDiscount(
                        discount,
                      )}
                    </div>

                    {discount.minimumOrderValue >
                      0 && (
                      <p className="mt-1 text-xs text-[var(--color-secondary)]">
                        Min. order{" "}
                        {new Intl.NumberFormat(
                          "en-IN",
                          {
                            style:
                              "currency",
                            currency:
                              "INR",
                            maximumFractionDigits: 0,
                          },
                        ).format(
                          discount.minimumOrderValue,
                        )}
                      </p>
                    )}
                  </td>

                  {/* Usage */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[var(--color-ink)]">
                      {usageText(
                        discount,
                      )}
                    </span>

                    {discount.usageLimitPerCustomer !==
                      null && (
                      <p className="mt-1 text-xs text-[var(--color-secondary)]">
                        {discount.usageLimitPerCustomer}{" "}
                        per customer
                      </p>
                    )}
                  </td>

                  {/* Start */}
                  <td className="px-5 py-4 text-sm text-[var(--color-ink)]">
                    {formatDate(
                      discount.startsAt,
                    )}
                  </td>

                  {/* End */}
                  <td className="px-5 py-4 text-sm text-[var(--color-ink)]">
                    {formatDate(
                      discount.endsAt,
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <Link
                        href={`/admin/discounts/${discount._id}`}
                        title="View discount"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition hover:bg-gray-100 hover:text-[var(--color-ink)]"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/admin/discounts/${discount._id}/edit`}
                        title="Edit discount"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition hover:bg-[var(--color-rose-light)] hover:text-[#9f1239]"
                      >
                        <Pencil size={16} />
                      </Link>

                      {/* Activate / Deactivate */}
                      <button
                        type="button"
                        title={
                          discount.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                        disabled={isLoading}
                        onClick={() =>
                          onToggleStatus(
                            discount,
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition hover:bg-gray-100 hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Power
                          size={16}
                        />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete discount"
                        disabled={isLoading}
                        onClick={() =>
                          onDelete(
                            discount,
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-secondary)] transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}