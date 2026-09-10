"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit3,
  MessageSquareText,
  Save,
  Star,
  StarOff,
  Trash2,
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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
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
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/reviews"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-secondary)] transition hover:text-[#9f1239]"
          >
            <ArrowLeft size={16} />
            Back to Reviews
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-rose-light)] text-[#9f1239]">
              <MessageSquareText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                Review Details
              </h1>

              <p className="mt-1 text-sm text-[var(--color-secondary)]">
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
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
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
              className="inline-flex h-10 items-center rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-100 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {/* Review Content */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            {editing ? (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                    Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={180}
                    className="h-11 w-full rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                    Rating
                  </label>

                  <select
                    value={rating}
                    onChange={(event) =>
                      setRating(Number(event.target.value))
                    }
                    className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[#9f1239]"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} / 5
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                    Review
                  </label>

                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    maxLength={3000}
                    rows={8}
                    className="w-full resize-y rounded-lg border border-[var(--color-border)] px-3 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={updating}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#9f1239] px-5 text-sm font-medium text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-50"
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
                      <h2 className="text-xl font-semibold text-[var(--color-ink)]">
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
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <span className="text-sm font-medium text-[var(--color-secondary)]">
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
                        ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:bg-gray-50"
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

                <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-[var(--color-ink)]">
                    {review.body || "No review content."}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* Admin Note */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Admin Note
            </h2>

            {editing ? (
              <textarea
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                maxLength={1000}
                rows={5}
                placeholder="Add an internal admin note..."
                className="mt-4 w-full resize-y rounded-lg border border-[var(--color-border)] px-3 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-[#9f1239]/10"
              />
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--color-secondary)]">
                {review.adminNote || "No admin note added."}
              </p>
            )}
          </section>

          {/* Moderation */}
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-ink)]">
                  Moderation
                </h2>

                <p className="mt-1 text-sm text-[var(--color-secondary)]">
                  Change the moderation status of this review.
                </p>
              </div>

              {updating && (
                <span className="text-xs font-medium text-[var(--color-secondary)]">
                  Updating...
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onModerate("approved")}
                disabled={updating || review.status === "approved"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle2 size={16} />
                Approve
              </button>

              <button
                type="button"
                onClick={() => onModerate("pending")}
                disabled={updating || review.status === "pending"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Clock3 size={16} />
                Pending
              </button>

              <button
                type="button"
                onClick={() => onModerate("rejected")}
                disabled={updating || review.status === "rejected"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Review Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Product ID
                </p>
                <p className="mt-1 break-all text-sm font-medium text-[var(--color-ink)]">
                  {review.productId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  User ID
                </p>
                <p className="mt-1 break-all text-sm font-medium text-[var(--color-ink)]">
                  {review.userId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Order Number
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                  {review.orderNumber || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Submitted
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                  {formatDate(review.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Last Updated
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                  {formatDate(review.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Moderation Information
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Moderated By
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[var(--color-ink)]">
                  {review.moderatedBy || "Not moderated"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Moderated At
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                  {review.moderatedAt
                    ? formatDate(review.moderatedAt)
                    : "Not moderated"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
                  Featured
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">
                  {review.isFeatured ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}