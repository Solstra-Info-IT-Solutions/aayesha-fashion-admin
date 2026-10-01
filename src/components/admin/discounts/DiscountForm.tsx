"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  createDiscount,
  getDiscount,
  updateDiscount,
} from "@/services/discount.service";

import type {
  Coupon,
  CouponCreateInput,
  CouponDiscountType,
  CouponUpdateInput,
} from "@/types/discount";

type DiscountFormProps = {
  mode: "create" | "edit";
  discountId?: string;
};

type FormState = {
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: string;
  maxDiscountAmount: string;
  minimumOrderValue: string;
  usageLimit: string;
  usageLimitPerCustomer: string;
  firstOrderOnly: boolean;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

const initialForm: FormState = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  maxDiscountAmount: "",
  minimumOrderValue: "0",
  usageLimit: "",
  usageLimitPerCustomer: "",
  firstOrderOnly: false,
  startsAt: "",
  endsAt: "",
  isActive: true,
};

function toDateTimeLocal(
  value: string | null | undefined,
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}

function couponToForm(
  coupon: Coupon,
): FormState {
  return {
    code: coupon.code,
    description: coupon.description ?? "",
    discountType: coupon.discountType,
    discountValue:
      String(coupon.discountValue),
    maxDiscountAmount:
      coupon.maxDiscountAmount !== null
        ? String(coupon.maxDiscountAmount)
        : "",
    minimumOrderValue:
      String(coupon.minimumOrderValue),
    usageLimit:
      coupon.usageLimit !== null
        ? String(coupon.usageLimit)
        : "",
    usageLimitPerCustomer:
      coupon.usageLimitPerCustomer !== null
        ? String(
            coupon.usageLimitPerCustomer,
          )
        : "",
    firstOrderOnly:
      coupon.firstOrderOnly,
    startsAt: toDateTimeLocal(
      coupon.startsAt,
    ),
    endsAt: toDateTimeLocal(
      coupon.endsAt,
    ),
    isActive: coupon.isActive,
  };
}

function numberValue(
  value: string,
) {
  const number = Number(value);
  return Number.isFinite(number)
    ? number
    : 0;
}

function optionalNumber(
  value: string,
) {
  if (!value.trim()) {
    return null;
  }

  return numberValue(value);
}

export default function DiscountForm({
  mode,
  discountId,
}: DiscountFormProps) {
  const router = useRouter();

  const {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading: authLoading,
  } = useAdminAuth();

  const [form, setForm] =
    useState<FormState>(
      initialForm,
    );

  const [loading, setLoading] =
    useState(mode === "edit");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (
      mode !== "edit" ||
      !discountId ||
      !accessToken ||
      !isInitialized ||
      !isAuthenticated
    ) {
      return;
    }

    const loadDiscount = async () => {
      setLoading(true);

      try {
        const discount =
          await getDiscount(
            accessToken,
            discountId,
          );

        setForm(
          couponToForm(discount),
        );
      } catch (error) {
        console.error(
          "Failed to load discount:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load discount.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDiscount();
  }, [
    mode,
    discountId,
    accessToken,
    isInitialized,
    isAuthenticated,
  ]);

  const updateField = <
    K extends keyof FormState,
  >(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validate = () => {
    const code =
      form.code.trim();

    if (!code) {
      toast.error(
        "Coupon code is required.",
      );
      return false;
    }

    if (code.length > 40) {
      toast.error(
        "Coupon code cannot exceed 40 characters.",
      );
      return false;
    }

    const discountValue =
      numberValue(
        form.discountValue,
      );

    if (
      form.discountType !==
        "free_shipping" &&
      discountValue < 0
    ) {
      toast.error(
        "Discount value cannot be negative.",
      );
      return false;
    }

    if (
      form.discountType ===
        "percentage" &&
      discountValue > 100
    ) {
      toast.error(
        "Percentage discount cannot exceed 100%.",
      );
      return false;
    }

    if (
      form.discountType ===
        "free_shipping" &&
      discountValue !== 0
    ) {
      toast.error(
        "Free shipping discount value must be 0.",
      );
      return false;
    }

    if (
      form.discountType !==
        "percentage" &&
      form.maxDiscountAmount.trim()
    ) {
      toast.error(
        "Maximum discount amount is only valid for percentage discounts.",
      );
      return false;
    }

    if (!form.startsAt) {
      toast.error(
        "Start date is required.",
      );
      return false;
    }

    if (
      form.endsAt &&
      new Date(form.endsAt).getTime() <=
        new Date(form.startsAt).getTime()
    ) {
      toast.error(
        "End date must be after start date.",
      );
      return false;
    }

    if (
      numberValue(
        form.minimumOrderValue,
      ) < 0
    ) {
      toast.error(
        "Minimum order value cannot be negative.",
      );
      return false;
    }

    if (
      form.usageLimit.trim() &&
      numberValue(form.usageLimit) < 1
    ) {
      toast.error(
        "Usage limit must be at least 1.",
      );
      return false;
    }

    if (
      form.usageLimitPerCustomer.trim() &&
      numberValue(
        form.usageLimitPerCustomer,
      ) < 1
    ) {
      toast.error(
        "Per-customer usage limit must be at least 1.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!accessToken) return;

    if (!validate()) return;

    setSaving(true);

    try {
      const commonData = {
        code: form.code
          .trim()
          .toUpperCase(),
        description:
          form.description.trim(),
        discountType:
          form.discountType,
        discountValue:
          form.discountType ===
          "free_shipping"
            ? 0
            : numberValue(
                form.discountValue,
              ),
        maxDiscountAmount:
          form.discountType ===
          "percentage"
            ? optionalNumber(
                form.maxDiscountAmount,
              )
            : null,
        minimumOrderValue:
          numberValue(
            form.minimumOrderValue,
          ),
        usageLimit:
          optionalNumber(
            form.usageLimit,
          ),
        usageLimitPerCustomer:
          optionalNumber(
            form.usageLimitPerCustomer,
          ),
        firstOrderOnly:
          form.firstOrderOnly,
        startsAt: new Date(
          form.startsAt,
        ).toISOString(),
        endsAt: form.endsAt
          ? new Date(
              form.endsAt,
            ).toISOString()
          : null,
        isActive:
          form.isActive,
      };

      if (mode === "create") {
        const input: CouponCreateInput =
          commonData;

        const created =
          await createDiscount(
            accessToken,
            input,
          );

        toast.success(
          `Discount ${created.code} created successfully.`,
        );

        router.replace(
          `/admin/discounts/${created._id}`,
        );
        return;
      }

      if (!discountId) {
        throw new Error(
          "Discount ID is missing.",
        );
      }

      const input: CouponUpdateInput =
        commonData;

      const updated =
        await updateDiscount(
          accessToken,
          discountId,
          input,
        );

      toast.success(
        `Discount ${updated.code} updated successfully.`,
      );

      router.replace(
        `/admin/discounts/${updated._id}`,
      );
    } catch (error) {
      console.error(
        "Failed to save discount:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save discount.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (
    authLoading ||
    !isInitialized ||
    loading
  ) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[#efe8d8]" />

        <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6">
          <div className="space-y-5">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <div className="h-3 w-28 animate-pulse rounded bg-[#e6dfcf]" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-[#efe8d8]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !accessToken
  ) {
    return null;
  }

  const isFreeShipping =
    form.discountType ===
    "free_shipping";

  const isPercentage =
    form.discountType ===
    "percentage";

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <SmartBackLink
          href="/admin/discounts"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[#5f584d] transition hover:text-[#26221d]"
        >
          <ArrowLeft size={16} />
          Back to Discounts
        </SmartBackLink>

        <h1 className="text-[#2a2520]">
          {mode === "create"
            ? "Create Discount"
            : "Edit Discount"}
        </h1>

        <p className="mt-1 text-sm text-[#5f584d]">
          {mode === "create"
            ? "Create a new promotional discount coupon."
            : "Update the settings and availability of this discount coupon."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[#2a2520]">
            Basic Information
          </h2>

          <p className="mt-1 text-xs text-[#5f584d]">
            Configure the coupon code and discount type.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Coupon Code
                <span className="ml-1 text-[#b3261e]">
                  *
                </span>
              </label>

              <input
                type="text"
                value={form.code}
                onChange={(event) =>
                  updateField(
                    "code",
                    event.target.value
                      .toUpperCase(),
                  )
                }
                placeholder="e.g. WELCOME10"
                maxLength={40}
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 font-mono text-sm uppercase text-[#2a2520] outline-none transition placeholder:normal-case placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />

              <p className="mt-1.5 text-xs text-[#5f584d]">
                Maximum 40 characters.
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Discount Type
                <span className="ml-1 text-[#b3261e]">
                  *
                </span>
              </label>

              <select
                value={
                  form.discountType
                }
                onChange={(event) =>
                  updateField(
                    "discountType",
                    event.target
                      .value as CouponDiscountType,
                  )
                }
                className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="fixed">
                  Fixed Amount
                </option>

                <option value="free_shipping">
                  Free Shipping
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Description
              </label>

              <textarea
                value={
                  form.description
                }
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe this discount..."
                maxLength={500}
                rows={3}
                className="w-full resize-none rounded-lg border border-[#e6dfcf] px-3 py-2.5 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>
          </div>
        </section>

        {/* Discount Rules */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[#2a2520]">
            Discount Rules
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Discount Value */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Discount Value
                <span className="ml-1 text-[#b3261e]">
                  *
                </span>
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={
                    isPercentage
                      ? "100"
                      : undefined
                  }
                  step="0.01"
                  disabled={
                    isFreeShipping
                  }
                  value={
                    isFreeShipping
                      ? "0"
                      : form.discountValue
                  }
                  onChange={(event) =>
                    updateField(
                      "discountValue",
                      event.target.value,
                    )
                  }
                  className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 pr-12 text-sm text-[#2a2520] outline-none transition disabled:bg-[#f7f2e7] disabled:text-[#756d62] focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#5f584d]">
                  {isPercentage
                    ? "%"
                    : isFreeShipping
                      ? ""
                      : "INR"}
                </span>
              </div>
            </div>

            {/* Maximum Discount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Maximum Discount Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                disabled={
                  !isPercentage
                }
                value={
                  form.maxDiscountAmount
                }
                onChange={(event) =>
                  updateField(
                    "maxDiscountAmount",
                    event.target.value,
                  )
                }
                placeholder={
                  isPercentage
                    ? "e.g. 500"
                    : "Only for percentage"
                }
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] disabled:bg-[#f7f2e7] disabled:text-[#756d62] focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>

            {/* Minimum Order */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Minimum Order Value
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  form.minimumOrderValue
                }
                onChange={(event) =>
                  updateField(
                    "minimumOrderValue",
                    event.target.value,
                  )
                }
                placeholder="0"
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[#2a2520]">
            Usage Limits
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Total usage */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Total Usage Limit
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  form.usageLimit
                }
                onChange={(event) =>
                  updateField(
                    "usageLimit",
                    event.target.value,
                  )
                }
                placeholder="Unlimited"
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>

            {/* Customer usage */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Usage Limit Per Customer
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={
                  form.usageLimitPerCustomer
                }
                onChange={(event) =>
                  updateField(
                    "usageLimitPerCustomer",
                    event.target.value,
                  )
                }
                placeholder="Unlimited"
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>

            {/* First order */}
            <label className="md:col-span-2 flex cursor-pointer items-center gap-3 rounded-lg border border-[#e6dfcf] p-3 transition hover:bg-[#f7f2e7]">
              <input
                type="checkbox"
                checked={
                  form.firstOrderOnly
                }
                onChange={(event) =>
                  updateField(
                    "firstOrderOnly",
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-[#26221d]"
              />

              <span>
                <span className="block text-sm font-medium text-[#2a2520]">
                  First Order Only
                </span>

                <span className="block text-xs text-[#5f584d]">
                  Allow this coupon only for a customer's first order.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Schedule */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-semibold text-[#2a2520]">
            Schedule
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Start */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                Start Date
                <span className="ml-1 text-[#b3261e]">
                  *
                </span>
              </label>

              <input
                type="datetime-local"
                value={
                  form.startsAt
                }
                onChange={(event) =>
                  updateField(
                    "startsAt",
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />
            </div>

            {/* End */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                End Date
              </label>

              <input
                type="datetime-local"
                value={
                  form.endsAt
                }
                onChange={(event) =>
                  updateField(
                    "endsAt",
                    event.target.value,
                  )
                }
                className="h-10 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]"
              />

              <p className="mt-1.5 text-xs text-[#5f584d]">
                Leave empty for no expiry.
              </p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField(
                  "isActive",
                  event.target.checked,
                )
              }
              className="mt-0.5 h-4 w-4 accent-[#26221d]"
            />

            <span>
              <span className="block text-sm font-medium text-[#2a2520]">
                Active Discount
              </span>

              <span className="mt-1 block text-xs leading-5 text-[#5f584d]">
                When enabled, the coupon can become active according to its schedule.
              </span>
            </span>
          </label>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/admin/discounts"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-5 text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save
              size={17}
              className={
                saving
                  ? "animate-pulse"
                  : ""
              }
            />

            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Discount"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}