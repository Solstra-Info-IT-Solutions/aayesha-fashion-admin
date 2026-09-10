"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import type { Review } from "@/types/review";

type ReviewTableProps = {
  reviews: Review[];
  onToggleFeatured: (review: Review) => void;
  onDelete: (review: Review) => void;
};

function getStatusClasses(status: Review["status"]) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          className={
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewTable({
  reviews,
  onToggleFeatured,
  onDelete,
}: ReviewTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-gray-50/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Review
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Rating
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Featured
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--color-border)]">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="transition hover:bg-gray-50/50"
              >
                {/* Review */}
                <td className="max-w-[360px] px-5 py-4">
                  <div>
                    <p className="truncate font-medium text-[var(--color-ink)]">
                      {review.title || "Untitled Review"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-secondary)]">
                      {review.body || "No review text"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-secondary)]">
                      <span>User: {review.userId}</span>

                      {review.orderNumber && (
                        <>
                          <span>•</span>
                          <span>Order: {review.orderNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    {renderStars(review.rating)}

                    <span className="text-xs font-medium text-[var(--color-secondary)]">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* Product */}
                <td className="px-5 py-4">
                  <span className="block max-w-[170px] truncate text-sm font-medium text-[var(--color-ink)]">
                    {review.productId}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      review.status,
                    )}`}
                  >
                    {review.status.replace("_", " ")}
                  </span>
                </td>

                {/* Featured */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(review)}
                    title={
                      review.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"
                    }
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                      review.isFeatured
                        ? "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100"
                        : "border-[var(--color-border)] bg-white text-gray-400 hover:bg-gray-50 hover:text-amber-500"
                    }`}
                  >
                    {review.isFeatured ? (
                      <Star size={17} className="fill-current" />
                    ) : (
                      <StarOff size={17} />
                    )}
                  </button>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--color-secondary)]">
                  {formatDate(review.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="View review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-gray-50 hover:text-[#9f1239]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="Edit review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-gray-50 hover:text-[#9f1239]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(review)}
                      title="Delete review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}