"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit3,
  ExternalLink,
  Save,
  Star,
  StarOff,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import type {
  Review,
  ReviewStatus,
} from "@/types/review";

type ReviewDetailProps = {
  review: Review;
  updating?: boolean;
  deleting?: boolean;
  onModerate: (
    status: ReviewStatus,
    adminNote?: string,
  ) => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
  onUpdate?: (data: {
    title: string;
    body: string;
    rating: number;
    adminNote: string;
  }) => void;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClasses(status: ReviewStatus) {
  switch (status) {
    case "approved":
      return "border-[#bfe3cb] bg-[#e8f5ec] text-[#276541]";
    case "rejected":
      return "border-[#f5c2c0] bg-[#fdecec] text-[#8f1f19]";
    default:
      return "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806]";
  }
}

function StatusIcon({ status }: { status: ReviewStatus }) {
  if (status === "approved") {
    return <CheckCircle2 size={16} />;
  }

  if (status === "rejected") {
    return <XCircle size={16} />;
  }

  return <Clock3 size={16} />;
}

export default function ReviewDetail({
  review,
  updating = false,
  deleting = false,
  onModerate,
  onToggleFeatured,
  onDelete,
  onUpdate,
}: ReviewDetailProps) {
  const [editing, setEditing] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const media = review.media ?? [];
  const preview = previewIndex === null ? null : media[previewIndex];

  useEffect(() => {
    if (previewIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewIndex(null);
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [previewIndex]);

  const [title, setTitle] = useState(review.title || "");
  const [body, setBody] = useState(review.body || "");
  const [rating, setRating] = useState(review.rating);
  const [adminNote, setAdminNote] = useState(review.adminNote || "");

  useEffect(() => {
    setTitle(review.title || "");
    setBody(review.body || "");
    setRating(review.rating);
    setAdminNote(review.adminNote || "");
  }, [review]);

  const handleSave = () => {
    if (!onUpdate) return;

    if (!title.trim()) {
      window.alert("Review title is required.");
      return;
    }

    if (!body.trim()) {
      window.alert("Review body is required.");
      return;
    }

    if (rating < 1 || rating > 5) {
      window.alert("Rating must be between 1 and 5.");
      return;
    }

    onUpdate({
      title: title.trim(),
      body: body.trim(),
      rating,
      adminNote: adminNote.trim(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#e6dfcf] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/reviews"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#5f584d] transition hover:text-[#26221d]"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>

          <div className="flex items-center gap-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">Moderation</p>
              <h1 className="mt-1 text-[#2a2520]">
                Review Details
              </h1>

              <p className="mt-1 text-sm text-[#5f584d]">
                Review ID: {review._id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={updating}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#2a2520] shadow-sm transition hover:bg-[#f7f2e7] disabled:opacity-50"
            >
              <Edit3 size={16} />
              Edit
            </button>
          )}

          {editing && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={updating}
              className="inline-flex h-10 items-center rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7] disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#f5c2c0] bg-[#fffdf8] px-4 text-sm font-medium text-[#b3261e] transition hover:bg-[#fdecec] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* Review Content */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            {editing ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                    Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={180}
                    className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                    Rating
                  </label>

                  <select
                    value={rating}
                    onChange={(event) =>
                      setRating(Number(event.target.value))
                    }
                    className="h-11 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d]"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} / 5
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2a2520]">
                    Review
                  </label>

                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    maxLength={3000}
                    rows={8}
                    className="w-full resize-y rounded-lg border border-[#e6dfcf] px-3 py-3 text-sm leading-6 text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/10"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updating}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#26221d] px-5 text-sm font-medium text-white transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={16} />
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-[#2a2520]">
                        {review.title || "Untitled Review"}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          review.status,
                        )}`}
                      >
                        <StatusIcon status={review.status} />
                        {review.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={18}
                            className={
                              index < review.rating
                                ? "fill-[#b08d57] text-[#b08d57]"
                                : "text-[#d6ccb6]"
                            }
                          />
                        ))}
                      </div>

                      <span className="text-sm font-medium text-[#5f584d]">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleFeatured}
                    disabled={updating}
                    className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      review.isFeatured
                        ? "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806] hover:bg-[#fbe8c4]"
                        : "border-[#e6dfcf] bg-[#fffdf8] text-[#2a2520] hover:bg-[#f7f2e7]"
                    }`}
                  >
                    {review.isFeatured ? (
                      <>
                        <Star size={16} className="fill-current" />
                        Featured
                      </>
                    ) : (
                      <>
                        <StarOff size={16} />
                        Mark Featured
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 border-t border-[#e6dfcf] pt-6">
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-[#2a2520]">
                    {review.body || "No review content."}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* Customer Media */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#2a2520]">
              Customer Photos &amp; Video
              <span className="ml-2 text-sm font-normal text-[#5f584d]">
                ({media.length})
              </span>
            </h2>

            {media.length === 0 ? (
              <p className="mt-3 text-sm text-[#5f584d]">
                The customer did not attach any photos or videos.
              </p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {media.map((item, index) => (
                  <li key={item.publicId || item.url}>
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(index)}
                      aria-label={
                        item.type === "video"
                          ? "Play review video"
                          : "View review photo"
                      }
                      className="group relative block aspect-square w-full overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#f7f2e7]"
                    >
                      {item.type === "video" ? (
                        <>
                          <video
                            src={item.url}
                            muted
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-semibold uppercase tracking-wide text-white">
                            Video
                          </span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt="Customer review"
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Admin Note */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#2a2520]">
              Admin Note
            </h2>

            {editing ? (
              <textarea
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="Add an internal admin note..."
                className="mt-4 w-full resize-y rounded-lg border border-[#e6dfcf] px-3 py-3 text-sm leading-6 text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-2 focus:ring-[#26221d]/10"
              />
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#5f584d]">
                {review.adminNote || "No admin note added."}
              </p>
            )}
          </section>

          {/* Moderation */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#2a2520]">
                  Moderation
                </h2>

                <p className="mt-1 text-sm text-[#5f584d]">
                  Change the moderation status of this review.
                </p>
              </div>

              {updating && (
                <span className="text-xs font-medium text-[#5f584d]">
                  Updating...
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onModerate("approved")}
                disabled={updating || review.status === "approved"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#276541] px-4 text-sm font-medium text-white transition hover:bg-[#1f5236] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                Approve
              </button>

              <button
                type="button"
                onClick={() => onModerate("pending")}
                disabled={updating || review.status === "pending"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#7f4806] px-4 text-sm font-medium text-white transition hover:bg-[#6a3c05] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Clock3 size={16} />
                Pending
              </button>

              <button
                type="button"
                onClick={() => onModerate("rejected")}
                disabled={updating || review.status === "rejected"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b3261e] px-4 text-sm font-medium text-white transition hover:bg-[#8f1f19] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#2a2520]">
              Review Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Product ID
                </p>
                <p className="mt-1 break-all text-sm font-medium text-[#2a2520]">
                  {review.productId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  User ID
                </p>
                <p className="mt-1 break-all text-sm font-medium text-[#2a2520]">
                  {review.userId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Order Number
                </p>
                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {review.orderNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Submitted
                </p>
                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {formatDate(review.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Last Updated
                </p>
                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {formatDate(review.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#2a2520]">
              Moderation Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Moderated By
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#2a2520]">
                  {review.moderatedBy || "Not moderated"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Moderated At
                </p>

                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {review.moderatedAt
                    ? formatDate(review.moderatedAt)
                    : "Not moderated"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
                  Featured
                </p>

                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {review.isFeatured ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review media preview"
          onClick={() => setPreviewIndex(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
        >
          <div className="absolute right-4 top-4 flex gap-2">
            <a
              href={preview.url}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label="Open original in a new tab"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffdf8]/15 text-white hover:bg-[#fffdf8]/25"
            >
              <ExternalLink size={18} />
            </a>

            <button
              type="button"
              onClick={() => setPreviewIndex(null)}
              aria-label="Close preview"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fffdf8]/15 text-white hover:bg-[#fffdf8]/25"
            >
              <X size={20} />
            </button>
          </div>

          <div onClick={(event) => event.stopPropagation()}>
            {preview.type === "video" ? (
              <video
                src={preview.url}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] max-w-[92vw] rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt="Customer review"
                className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
