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
      return "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]";
    case "rejected":
      return "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]";
    default:
      return "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]";
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
              ? "fill-[#b08d57] text-[#b08d57]"
              : "text-[#d6ccb6]"
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
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm lg:hidden">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[#2a2520]">
            {review.title || "Untitled Review"}
          </h3>

          <p className="mt-1 line-clamp-3 text-sm leading-6 text-[#5f584d]">
            {review.body || "No review text"}
          </p>

          {(review.media?.length ?? 0) > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-[#efe8d8] px-2 py-0.5 text-xs font-medium text-[#2a2520]">
              {review.media?.length} photo/video
              {review.media?.length === 1 ? "" : "s"}
            </span>
          )}
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
              ? "border-[#f6d08a] bg-[#fdf3e1] text-[#b08d57]"
              : "border-[#e6dfcf] text-[#756d62]"
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

          <span className="text-xs font-medium text-[#5f584d]">
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
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] bg-[#f7f2e7] p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Product
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#2a2520]">
            {review.productId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            User
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#2a2520]">
            {review.userId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#2a2520]">
            {review.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-[#2a2520]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e6dfcf] text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e6dfcf] text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(review)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#f5c2c0] text-[#b3261e] transition hover:bg-[#fdecec]"
          title="Delete review"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}