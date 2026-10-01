"use client";

import { goBackTo } from "@/lib/nav-history";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useConfirm } from "@/components/ui/useConfirm";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  deleteReview,
  getReview,
  moderateReview,
  updateReview,
  updateReviewFeatured,
} from "@/services/review.service";

import type {
  Review,
  ReviewStatus,
  ReviewUpdateInput,
} from "@/types/review";

import ReviewDetail from "@/components/admin/reviews/ReviewDetail";

type ReviewDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ReviewDetailPage({
  params,
}: ReviewDetailPageProps) {
  const router = useRouter();
  const { confirm, dialog: confirmDialog } = useConfirm();
  const { accessToken, isInitialized } = useAdminAuth();

  const [reviewId, setReviewId] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void params.then(({ id }) => {
      setReviewId(id);
    });
  }, [params]);

  const loadReview = useCallback(async () => {
    if (!accessToken || !reviewId) return;

    try {
      setLoading(true);

      const data = await getReview(accessToken, reviewId);

      setReview(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load review.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, reviewId]);

  useEffect(() => {
    if (!isInitialized || !accessToken || !reviewId) return;

    void loadReview();
  }, [
    accessToken,
    isInitialized,
    reviewId,
    loadReview,
  ]);

  const handleModerate = async (
    status: ReviewStatus,
    adminNote?: string,
  ) => {
    if (!accessToken || !review) return;

    try {
      setUpdating(true);

      const updatedReview = await moderateReview(
        accessToken,
        review._id,
        {
          status,
          adminNote,
        },
      );

      setReview(updatedReview);

      toast.success(`Review marked as ${status}.`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update review status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (
    data: ReviewUpdateInput,
  ) => {
    if (!accessToken || !review) return;

    try {
      setUpdating(true);

      const updatedReview = await updateReview(
        accessToken,
        review._id,
        data,
      );

      setReview(updatedReview);

      toast.success("Review updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update review.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleFeatured = async () => {
    if (!accessToken || !review) return;

    try {
      setUpdating(true);

      const updatedReview = await updateReviewFeatured(
        accessToken,
        review._id,
        {
          isFeatured: !review.isFeatured,
        },
      );

      setReview(updatedReview);

      toast.success(
        updatedReview.isFeatured
          ? "Review marked as featured."
          : "Review removed from featured.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update featured status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !review) return;

    const confirmed = await confirm({
      title: "Delete this review?",
      description: `"${review.title || "Untitled Review"}" will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete review",
    });

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteReview(accessToken, review._id);

      toast.success("Review deleted.");

      router.replace("/admin/reviews");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete review.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[#efe8d8]" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[420px] animate-pulse rounded-[14px] bg-[#efe8d8]" />

          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-[14px] bg-[#efe8d8]" />
            <div className="h-48 animate-pulse rounded-[14px] bg-[#efe8d8]" />
          </div>
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#2a2520]">
          Authentication required
        </h2>

        <p className="mt-2 text-sm text-[#5f584d]">
          Please sign in again to manage this review.
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#2a2520]">
          Review not found
        </h2>

        <p className="mt-2 text-sm text-[#5f584d]">
          The requested review could not be found.
        </p>

        <button
          type="button"
          onClick={() => goBackTo(router, "/admin/reviews")}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#26221d] px-5 text-sm font-medium text-white transition hover:bg-[#3d372f]"
        >
          Back to Reviews
        </button>
      </div>
    );
  }

  return (
    <>
    {confirmDialog}
    <ReviewDetail
      review={review}
      updating={updating}
      deleting={deleting}
      onModerate={handleModerate}
      onUpdate={handleUpdate}
      onToggleFeatured={handleToggleFeatured}
      onDelete={handleDelete}
    />
    </>
  );
}