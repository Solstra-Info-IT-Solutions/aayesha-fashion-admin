"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  createDiscount,
  deleteDiscount,
  getDiscountStats,
  getDiscounts,
  updateDiscountStatus,
} from "@/services/discount.service";

import type {
  Coupon,
  CouponDiscountType,
  CouponSort,
  CouponStats,
  CouponStatus,
} from "@/types/discount";

import DiscountHeader from "./DiscountHeader";
import DiscountStats from "./DiscountStats";
import DiscountFilters from "./DiscountFilters";
import DiscountTable from "./DiscountTable";
import DiscountMobileCard from "./DiscountMobileCard";
import DiscountPagination from "./DiscountPagination";
import DiscountTableSkeleton from "./DiscountTableSkeleton";
import DiscountEmptyState from "./DiscountEmptyState";

const PAGE_LIMIT = 10;

export default function DiscountPage() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading: authLoading,
  } = useAdminAuth();

  const [stats, setStats] =
    useState<CouponStats | null>(null);

  const [discounts, setDiscounts] =
    useState<Coupon[]>([]);

  const [page, setPage] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [loadingDiscounts, setLoadingDiscounts] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [discountType, setDiscountType] =
    useState<CouponDiscountType | "">("");

  const [status, setStatus] =
    useState<CouponStatus | "">("");

  const [sort, setSort] =
    useState<CouponSort>("newest");

  const [actionLoadingId, setActionLoadingId] =
    useState<string | null>(null);

  const loadStats = useCallback(
    async (showError = true) => {
      if (!accessToken) return;

      setLoadingStats(true);

      try {
        const response =
          await getDiscountStats(
            accessToken,
          );

        setStats(response);
      } catch (error) {
        console.error(
          "Failed to load discount stats:",
          error,
        );

        if (showError) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load discount statistics.",
          );
        }
      } finally {
        setLoadingStats(false);
      }
    },
    [accessToken],
  );

  const loadDiscounts = useCallback(
    async (showError = true) => {
      if (!accessToken) return;

      setLoadingDiscounts(true);

      try {
        const response =
          await getDiscounts(
            accessToken,
            {
              page,
              limit: PAGE_LIMIT,
              search:
                search.trim() || undefined,
              discountType:
                discountType || undefined,
              status:
                status || undefined,
              sort,
            },
          );

        setDiscounts(
          response.items,
        );

        setTotal(
          response.pagination.total,
        );

        setTotalPages(
          response.pagination.totalPages,
        );
      } catch (error) {
        console.error(
          "Failed to load discounts:",
          error,
        );

        setDiscounts([]);
        setTotal(0);
        setTotalPages(0);

        if (showError) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load discounts.",
          );
        }
      } finally {
        setLoadingDiscounts(false);
      }
    },
    [
      accessToken,
      page,
      search,
      discountType,
      status,
      sort,
    ],
  );

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    void loadStats();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadStats,
  ]);

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    void loadDiscounts();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadDiscounts,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleDiscountTypeChange = (
    value: CouponDiscountType | "",
  ) => {
    setDiscountType(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: CouponStatus | "",
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (
    value: CouponSort,
  ) => {
    setSort(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDiscountType("");
    setStatus("");
    setSort("newest");
    setPage(1);
  };

  const handleRefresh = async () => {
    if (!accessToken) return;

    setRefreshing(true);

    try {
      await Promise.all([
        loadStats(false),
        loadDiscounts(false),
      ]);

      toast.success(
        "Discounts refreshed.",
      );
    } catch (error) {
       setRefreshing(false);
    }
  };

  const handleToggleStatus = async (
    discount: Coupon,
  ) => {
    if (!accessToken) return;

    setActionLoadingId(
      discount._id,
    );

    try {
      await updateDiscountStatus(
        accessToken,
        discount._id,
        {
          isActive:
            !discount.isActive,
        },
      );

      toast.success(
        discount.isActive
          ? "Discount deactivated."
          : "Discount activated.",
      );

      await Promise.all([
        loadStats(false),
        loadDiscounts(false),
      ]);
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
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (
    discount: Coupon,
  ) => {
    if (!accessToken) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete coupon "${discount.code}"?`,
      );

    if (!confirmed) return;

    setActionLoadingId(
      discount._id,
    );

    try {
      await deleteDiscount(
        accessToken,
        discount._id,
      );

      toast.success(
        "Discount deleted.",
      );

      /*
       * If the current page becomes empty after
       * deleting the last item, move back one page.
       */
      if (
        discounts.length === 1 &&
        page > 1
      ) {
        setPage(
          (currentPage) =>
            currentPage - 1,
        );
      } else {
        await Promise.all([
          loadStats(false),
          loadDiscounts(false),
        ]);
      }
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
      setActionLoadingId(null);
    }
  };

  const hasFilters =
    search.trim() !== "" ||
    discountType !== "" ||
    status !== "" ||
    sort !== "newest";

  /*
   * Auth loading
   */
  if (
    authLoading ||
    !isInitialized
  ) {
    return (
      <div className="space-y-6">
        <div className="h-28 animate-pulse rounded-xl bg-gray-100" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>

        <DiscountTableSkeleton />
      </div>
    );
  }

  /*
   * Not authenticated
   */
  if (!isAuthenticated || !accessToken) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DiscountHeader
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Stats */}
      <DiscountStats
        stats={stats}
        loading={loadingStats}
      />

      {/* Filters */}
      <DiscountFilters
        search={search}
        discountType={discountType}
        status={status}
        sort={sort}
        onSearchChange={
          handleSearchChange
        }
        onDiscountTypeChange={
          handleDiscountTypeChange
        }
        onStatusChange={
          handleStatusChange
        }
        onSortChange={
          handleSortChange
        }
        onReset={
          handleResetFilters
        }
      />

      {/* Content */}
      {loadingDiscounts ? (
        <DiscountTableSkeleton />
      ) : discounts.length === 0 ? (
        <DiscountEmptyState
          hasFilters={hasFilters}
          onReset={
            handleResetFilters
          }
        />
      ) : (
        <>
          {/* Desktop */}
          <DiscountTable
            discounts={discounts}
            onToggleStatus={
              handleToggleStatus
            }
            onDelete={
              handleDelete
            }
            actionLoadingId={
              actionLoadingId
            }
          />

          {/* Mobile / Tablet */}
          <div className="space-y-3 lg:hidden">
            {discounts.map(
              (discount) => (
                <DiscountMobileCard
                  key={discount._id}
                  discount={
                    discount
                  }
                  onToggleStatus={
                    handleToggleStatus
                  }
                  onDelete={
                    handleDelete
                  }
                  actionLoadingId={
                    actionLoadingId
                  }
                />
              ),
            )}
          </div>

          {/* Pagination */}
          <DiscountPagination
            page={page}
            totalPages={
              totalPages
            }
            total={total}
            limit={PAGE_LIMIT}
            onPageChange={
              setPage
            }
          />
        </>
      )}
    </div>
  );
}