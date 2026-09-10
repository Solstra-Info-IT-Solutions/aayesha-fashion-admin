"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  SupportPriority,
  SupportStatus,
  SupportTicket,
} from "@/types/support";

type SupportMobileCardProps = {
  ticket: SupportTicket;
  onDelete: (ticket: SupportTicket) => void;
};

function getStatusClasses(status: SupportStatus) {
  switch (status) {
    case "open":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "waiting_customer":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "resolved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "closed":
      return "border-gray-200 bg-gray-50 text-gray-600";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "border-red-200 bg-red-50 text-red-700";

    case "high":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "normal":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "low":
      return "border-gray-200 bg-gray-50 text-gray-600";

    default:
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function formatStatus(status: SupportStatus) {
  return status.replace(/_/g, " ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SupportMobileCard({
  ticket,
  onDelete,
}: SupportMobileCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm lg:hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/support/${ticket._id}`}
            className="text-sm font-semibold text-[#9f1239] hover:underline"
          >
            {ticket.ticketNumber}
          </Link>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[var(--color-ink)]">
            {ticket.subject}
          </h3>

          <p className="mt-1 text-xs text-[var(--color-secondary)]">
            {formatDate(ticket.createdAt)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
            ticket.status,
          )}`}
        >
          {formatStatus(ticket.status)}
        </span>
      </div>

      {/* Customer */}
      <div className="mt-4 rounded-xl bg-gray-50 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-secondary)]">
          Customer
        </p>

        <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
          {ticket.customerName}
        </p>

        <p className="mt-1 truncate text-xs text-[var(--color-secondary)]">
          {ticket.customerEmail}
        </p>
      </div>

      {/* Message */}
      <div className="mt-4">
        <p className="line-clamp-3 text-sm leading-6 text-[var(--color-secondary)]">
          {ticket.message}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityClasses(
            ticket.priority,
          )}`}
        >
          {ticket.priority}
        </span>

        <span className="rounded-full border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium capitalize text-[var(--color-secondary)]">
          {ticket.category}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-[var(--color-border)] p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
            {ticket.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-secondary)]">
            Assigned
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
            {ticket.assignedTo || "Unassigned"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-ink)] transition hover:bg-gray-50"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(ticket)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
          title="Delete ticket"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}