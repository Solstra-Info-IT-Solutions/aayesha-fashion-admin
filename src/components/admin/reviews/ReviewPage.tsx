"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  deleteReview,
  getReviewStats,
  getReviews,
  moderateReview,
  updateReviewFeatured,
} from "@/services/review.service";

import type {
  Review,
  ReviewSort,
  ReviewStatus,
  ReviewStats as ReviewStatsType,
} from "@/types/review";

import ReviewHeader from "./ReviewHeader";
import ReviewStats from "./ReviewStats";
import ReviewFilters from "./ReviewFilters";
import ReviewTable from "./ReviewTable";
import ReviewMobileCard from "./ReviewMobileCard";
import ReviewPagination from "./ReviewPagination";
import ReviewTableSkeleton from "./ReviewTableSkeleton";
import ReviewEmptyState from "./ReviewEmptyState";

const DEFAULT_LIMIT = 10;

export default function ReviewPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStatsType | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReviewStatus | "">("");
  const [sort, setSort] = useState<ReviewSort>("newest");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const hasFilters = Boolean(search || status || sort !== "newest");

  const loadStats = useCallback(async () => {
    if (!accessToken) return;

    try {
      setStatsLoading(true);

      const data = await getReviewStats(accessToken);

      setStats(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load review statistics.",
      );
    } finally {
      setStatsLoading(false);
    }
  }, [accessToken]);

  const loadReviews = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const response = await getReviews(accessToken, {
        page,
        limit: DEFAULT_LIMIT,
        search: search.trim() || undefined,
        status: status || undefined,
        sort,
      });

      setReviews(response.items);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search, sort, status]);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    void loadStats();
  }, [accessToken, isInitialized, loadStats]);

  useEffect(() => {
    if (!isInitialized || !accessToken) return;

    void loadReviews();
  }, [accessToken, isInitialized, loadReviews]);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([loadStats(), loadReviews()]);
      toast.success("Reviews refreshed.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: ReviewStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (value: ReviewSort) => {
    setSort(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setSort("newest");
    setPage(1);
  };

  const handleToggleFeatured = async (review: Review) => {
    if (!accessToken || actionId) return;

    setActionId(review._id);

    try {
      await updateReviewFeatured(accessToken, review._id, {
        isFeatured: !review.isFeatured,
      });

      setReviews((current) =>
        current.map((item) =>
          item._id === review._id
            ? {
                ...item,
                isFeatured: !item.isFeatured,
              }
            : item,
        ),
      );

      setStats((current) =>
        current
          ? {
              ...current,
              featured: Math.max(
                0,
                current.featured + (review.isFeatured ? -1 : 1),
              ),
            }
          : current,
      );

      toast.success(
        review.isFeatured
          ? "Review removed from featured."
          : "Review marked as featured.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update featured status.",
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!accessToken || actionId) return;

    const confirmed = window.confirm(
      `Delete review "${review.title || "Untitled Review"}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setActionId(review._id);

    try {
      await deleteReview(accessToken, review._id);

      toast.success("Review deleted.");

      if (reviews.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadReviews();
      }

      await loadStats();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete review.",
      );
    } finally {
      setActionId(null);
    }
  };

  const emptyState = useMemo(
    () => !loading && reviews.length === 0,
    [loading, reviews.length],
  );

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <ReviewHeader
          refreshing={false}
          onRefresh={() => undefined}
        />

        <ReviewStats stats={null} loading />

        <ReviewTableSkeleton />
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">
          Authentication required
        </h2>

        <p className="mt-2 text-sm text-[var(--color-secondary)]">
          Please sign in again to manage reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewHeader
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <ReviewStats
        stats={stats}
        loading={statsLoading}
      />

      <ReviewFilters
        search={search}
        status={status}
        sort={sort}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      {loading ? (
        <ReviewTableSkeleton />
      ) : emptyState ? (
        <ReviewEmptyState
          hasFilters={hasFilters}
          onReset={handleReset}
        />
      ) : (
        <>
          <ReviewTable
            reviews={reviews}
            onToggleFeatured={handleToggleFeatured}
            onDelete={handleDelete}
          />

          <div className="space-y-3 lg:hidden">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={
                  actionId === review._id
                    ? "pointer-events-none opacity-60"
                    : ""
                }
              >
                <ReviewMobileCard
                  review={review}
                  onToggleFeatured={handleToggleFeatured}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          <ReviewPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={DEFAULT_LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}