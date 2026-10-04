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
      return "bg-[#1a2419] text-[#8fb08a] border-[#2c4a33]";
    case "rejected":
      return "bg-[#2b1a18] text-[#f0a39d] border-[#5a2a27]";
    default:
      return "bg-[#2b2216] text-[#e0b56a] border-[#5a4420]";
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
              ? "fill-[#b79a6a] text-[#b79a6a]"
              : "text-[#8c847d]"
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
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-4 shadow-sm lg:hidden">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[#f8f3f1]">
            {review.title || "Untitled Review"}
          </h3>

          <p className="mt-1 line-clamp-3 text-sm leading-6 text-[#cfc7bb]">
            {review.body || "No review text"}
          </p>

          {(review.media?.length ?? 0) > 0 && (
            <span className="mt-2 inline-flex items-center rounded-full bg-[#211e1b] px-2 py-0.5 text-xs font-medium text-[#f8f3f1]">
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
              ? "border-[#5a4420] bg-[#2b2216] text-[#b79a6a]"
              : "border-[#2e2a26] text-[#9a9185]"
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

          <span className="text-xs font-medium text-[#cfc7bb]">
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
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] bg-[#111111] p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            Product
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#f8f3f1]">
            {review.productId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            User
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#f8f3f1]">
            {review.userId}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#f8f3f1]">
            {review.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-[#f8f3f1]">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2e2a26] text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111]"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/reviews/${review._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2e2a26] text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111]"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(review)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#5a2a27] text-[#e08b84] transition hover:bg-[#2b1a18]"
          title="Delete review"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}