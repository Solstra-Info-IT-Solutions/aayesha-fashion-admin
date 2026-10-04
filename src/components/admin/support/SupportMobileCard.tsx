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
      return "border-[#2c4658] bg-[#16222b] text-[#8fbfdc]";

    case "in_progress":
      return "border-[#5a4420] bg-[#2b2216] text-[#e0b56a]";

    case "waiting_customer":
      return "border-[#5a4420] bg-[#2b2216] text-[#e0b56a]";

    case "resolved":
      return "border-[#2c4a33] bg-[#1a2419] text-[#8fb08a]";

    case "closed":
      return "border-[#2e2a26] bg-[#111111] text-[#cfc7bb]";

    default:
      return "border-[#2e2a26] bg-[#111111] text-[#cfc7bb]";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "border-[#5a2a27] bg-[#2b1a18] text-[#f0a39d]";

    case "high":
      return "border-[#5a4420] bg-[#2b2216] text-[#e0b56a]";

    case "normal":
      return "border-[#2c4658] bg-[#16222b] text-[#8fbfdc]";

    case "low":
      return "border-[#2e2a26] bg-[#111111] text-[#cfc7bb]";

    default:
      return "border-[#2e2a26] bg-[#111111] text-[#cfc7bb]";
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
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-4 shadow-sm xl:hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/support/${ticket._id}`}
            className="text-sm font-semibold text-[#f8f3f1] hover:underline"
          >
            {ticket.ticketNumber}
          </Link>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#f8f3f1]">
            {ticket.subject}
          </h3>

          <p className="mt-1 text-xs text-[#cfc7bb]">
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
      <div className="mt-4 rounded-[14px] bg-[#111111] p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[#cfc7bb]">
          Customer
        </p>

        <p className="mt-1 text-sm font-semibold text-[#f8f3f1]">
          {ticket.customerName}
        </p>

        <p className="mt-1 truncate text-xs text-[#cfc7bb]">
          {ticket.customerEmail}
        </p>
      </div>

      {/* Message */}
      <div className="mt-4">
        <p className="line-clamp-3 text-sm leading-6 text-[#cfc7bb]">
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

        <span className="rounded-full border border-[#2e2a26] bg-[#1a1816] px-2.5 py-1 text-xs font-medium capitalize text-[#cfc7bb]">
          {ticket.category}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] border border-[#2e2a26] p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#f8f3f1]">
            {ticket.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#cfc7bb]">
            Assigned
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#f8f3f1]">
            {ticket.assignedTo || "Unassigned"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2e2a26] text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111]"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#2e2a26] text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111]"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(ticket)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#5a2a27] text-[#e08b84] transition hover:bg-[#2b1a18]"
          title="Delete ticket"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}