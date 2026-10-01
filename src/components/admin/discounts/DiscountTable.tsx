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
      "bg-[#e8f5ec] text-[#276541]",
  },
  inactive: {
    label: "Inactive",
    className:
      "bg-[#efe8d8] text-[#5f584d]",
  },
  scheduled: {
    label: "Scheduled",
    className:
      "bg-[#e6f0f7] text-[#1f5f86]",
  },
  expired: {
    label: "Expired",
    className:
      "bg-[#fdecec] text-[#8f1f19]",
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
    <div className="hidden overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]/80">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Coupon
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Discount
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Usage
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Start Date
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                End Date
              </th>

              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
                Status
              </th>

              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#5f584d]">
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
                  className="border-b border-[#e6dfcf] last:border-b-0 transition hover:bg-[#f7f2e7]/60"
                >
                  {/* Coupon */}
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/discounts/${discount._id}`}
                        className="inline-flex max-w-[240px] items-center rounded-md bg-[#f1ead9] px-2.5 py-1 font-mono text-sm font-semibold tracking-wide text-[#26221d] transition hover:bg-pink-100"
                      >
                        {discount.code}
                      </Link>

                      {discount.description && (
                        <p className="mt-1.5 max-w-[260px] truncate text-xs text-[#5f584d]">
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
                    <div className="text-sm font-semibold text-[#2a2520]">
                      {formatDiscount(
                        discount,
                      )}
                    </div>

                    {discount.minimumOrderValue >
                      0 && (
                      <p className="mt-1 text-xs text-[#5f584d]">
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
                    <span className="text-sm font-medium text-[#2a2520]">
                      {usageText(
                        discount,
                      )}
                    </span>

                    {discount.usageLimitPerCustomer !==
                      null && (
                      <p className="mt-1 text-xs text-[#5f584d]">
                        {discount.usageLimitPerCustomer}{" "}
                        per customer
                      </p>
                    )}
                  </td>

                  {/* Start */}
                  <td className="px-5 py-4 text-sm text-[#2a2520]">
                    {formatDate(
                      discount.startsAt,
                    )}
                  </td>

                  {/* End */}
                  <td className="px-5 py-4 text-sm text-[#2a2520]">
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#efe8d8] hover:text-[#2a2520]"
                      >
                        <Eye size={16} />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/admin/discounts/${discount._id}/edit`}
                        title="Edit discount"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#f1ead9] hover:text-[#26221d]"
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#efe8d8] hover:text-[#2a2520] disabled:cursor-not-allowed disabled:opacity-40"
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5f584d] transition hover:bg-[#fdecec] hover:text-[#b3261e] disabled:cursor-not-allowed disabled:opacity-40"
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