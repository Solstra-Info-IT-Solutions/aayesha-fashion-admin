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

export default function ReviewTable({
  reviews,
  onToggleFeatured,
  onDelete,
}: ReviewTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-[#2e2a26] bg-[#111111]/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Review
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Rating
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Featured
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#2e2a26]">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="transition hover:bg-[#111111]/50"
              >
                {/* Review */}
                <td className="max-w-[360px] px-5 py-4">
                  <div>
                    <p className="truncate font-medium text-[#f8f3f1]">
                      {review.title || "Untitled Review"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-[#cfc7bb]">
                      {review.body || "No review text"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#cfc7bb]">
                      <span>User: {review.userId}</span>

                      {(review.media?.length ?? 0) > 0 && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#211e1b] px-2 py-0.5 font-medium text-[#f8f3f1]">
                            {review.media?.length} media
                          </span>
                        </>
                      )}

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

                    <span className="text-xs font-medium text-[#cfc7bb]">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* Product */}
                <td className="px-5 py-4">
                  <span className="block max-w-[170px] truncate text-sm font-medium text-[#f8f3f1]">
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
                        ? "border-[#5a4420] bg-[#2b2216] text-[#b79a6a] hover:bg-[#3b2f1a]"
                        : "border-[#2e2a26] bg-[#1a1816] text-[#9a9185] hover:bg-[#111111] hover:text-[#b79a6a]"
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
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#cfc7bb]">
                  {formatDate(review.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="View review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] text-[#cfc7bb] transition hover:bg-[#111111] hover:text-[#f8f3f1]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="Edit review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] text-[#cfc7bb] transition hover:bg-[#111111] hover:text-[#f8f3f1]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(review)}
                      title="Delete review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#5a2a27] text-[#e08b84] transition hover:bg-[#2b1a18]"
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