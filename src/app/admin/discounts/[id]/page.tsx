"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  deleteDiscount,
  getDiscount,
  updateDiscountStatus,
} from "@/services/discount.service";

import type { Coupon } from "@/types/discount";

import DiscountDetail from "@/components/admin/discounts/DiscountDetail";

export default function DiscountDetailPage() {
  const params = useParams();
  const router = useRouter();

  const {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading: authLoading,
  } = useAdminAuth();

  const discountId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [discount, setDiscount] =
    useState<Coupon | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadDiscount =
    useCallback(async () => {
      if (
        !accessToken ||
        !discountId
      ) {
        return;
      }

      setLoading(true);

      try {
        const response =
          await getDiscount(
            accessToken,
            discountId,
          );

        setDiscount(response);
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
    }, [
      accessToken,
      discountId,
    ]);

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken ||
      !discountId
    ) {
      return;
    }

    void loadDiscount();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    discountId,
    loadDiscount,
  ]);

  const handleToggleStatus =
    async () => {
      if (
        !accessToken ||
        !discount
      ) {
        return;
      }

      setActionLoading(true);

      try {
        const updated =
          await updateDiscountStatus(
            accessToken,
            discount._id,
            {
              isActive:
                !discount.isActive,
            },
          );

        setDiscount(updated);

        toast.success(
          updated.isActive
            ? "Discount activated."
            : "Discount deactivated.",
        );
      } catch (error) {
        console.error(
          "Failed to update discount status:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update discount status.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleDelete =
    async () => {
      if (
        !accessToken ||
        !discount
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete coupon "${discount.code}"?`,
        );

      if (!confirmed) {
        return;
      }

      setActionLoading(true);

      try {
        await deleteDiscount(
          accessToken,
          discount._id,
        );

        toast.success(
          "Discount deleted.",
        );

        router.push(
          "/admin/discounts",
        );
      } catch (error) {
        console.error(
          "Failed to delete discount:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete discount.",
        );
      } finally {
        setActionLoading(false);
      }
    };

  if (
    authLoading ||
    !isInitialized ||
    loading
  ) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />

        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>

        <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (
    !isAuthenticated ||
    !accessToken
  ) {
    return null;
  }

  if (!discount) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-[var(--color-border)] bg-white px-6 py-12 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-[var(--color-ink)]">
          Discount not found
        </h1>

        <p className="mt-2 text-sm text-[var(--color-secondary)]">
          The requested discount coupon could not be found.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/discounts",
            )
          }
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#9f1239] px-4 text-sm font-semibold text-white transition hover:bg-[#881337]"
        >
          Back to Discounts
        </button>
      </div>
    );
  }

  return (
    <DiscountDetail
      discount={discount}
      onToggleStatus={
        handleToggleStatus
      }
      onDelete={handleDelete}
      actionLoading={
        actionLoading
      }
    />
  );
}