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

export default function ReviewTable({
  reviews,
  onToggleFeatured,
  onDelete,
}: ReviewTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Review
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Rating
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Product
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Featured
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e6dfcf]">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="transition hover:bg-[#f7f2e7]/50"
              >
                {/* Review */}
                <td className="max-w-[360px] px-5 py-4">
                  <div>
                    <p className="truncate font-medium text-[#2a2520]">
                      {review.title || "Untitled Review"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-[#5f584d]">
                      {review.body || "No review text"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#5f584d]">
                      <span>User: {review.userId}</span>

                      {(review.media?.length ?? 0) > 0 && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#efe8d8] px-2 py-0.5 font-medium text-[#2a2520]">
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

                    <span className="text-xs font-medium text-[#5f584d]">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* Product */}
                <td className="px-5 py-4">
                  <span className="block max-w-[170px] truncate text-sm font-medium text-[#2a2520]">
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
                        ? "border-[#f6d08a] bg-[#fdf3e1] text-[#b08d57] hover:bg-[#fbe8c4]"
                        : "border-[#e6dfcf] bg-[#fffdf8] text-[#756d62] hover:bg-[#f7f2e7] hover:text-[#b08d57]"
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
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#5f584d]">
                  {formatDate(review.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="View review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#26221d]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/reviews/${review._id}`}
                      title="Edit review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#26221d]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(review)}
                      title="Delete review"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#f5c2c0] text-[#b3261e] transition hover:bg-[#fdecec]"
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