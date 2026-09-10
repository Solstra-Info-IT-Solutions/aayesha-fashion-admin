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

type ReviewMobileCardProps = {
  review: Review;
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

export default function ReviewMobileCard({
  review,
  onToggleFeatured,
  onDelete,
}: ReviewMobileCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm lg:hidden">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[var(--color-ink)]">
            {review.title || "Untitled Review"}
          </h3>

          <p className="mt-1 line-clamp-3 text-sm leading-6 text-[var(--color-secondary)]">
            {review.body || "No review text"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onToggleFeatured(review)}
          title={
            review.isFeatured
              ? "Remove from featured"
              : "Mark as featured"
          }
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
            review.isFeatured
              ? "border-amber-200 bg-amber-50 text-amber-500"
              : "border-[var(--color-border)] text-gray-400"
          }`}
        >
          {review.isFeatured ? (
            <Star size={17} className="fill-current" />
          ) : (
            <StarOff size={17} />
          )}
        </button>
      </div>

      {/* Rating + Status */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {renderStars(review.rating)}

          <span className="text-xs font-medium text-[var(--color-secondary)]">
            {review.rating}/5
          </span>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
            review.status,
          )}`}
        >
          {review.status.replace("_", " ")}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Product
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
            {review.productId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            User
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
            {review.userId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
            {review.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(review)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
          title="Delete review"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}