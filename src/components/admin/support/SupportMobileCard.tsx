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
      return "border-[#c7dcea] bg-[#e6f0f7] text-[#1f5f86]";

    case "in_progress":
      return "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806]";

    case "waiting_customer":
      return "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806]";

    case "resolved":
      return "border-[#bfe3cb] bg-[#e8f5ec] text-[#276541]";

    case "closed":
      return "border-[#e6dfcf] bg-[#f7f2e7] text-[#5f584d]";

    default:
      return "border-[#e6dfcf] bg-[#f7f2e7] text-[#5f584d]";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "border-[#f5c2c0] bg-[#fdecec] text-[#8f1f19]";

    case "high":
      return "border-[#f6d08a] bg-[#fdf3e1] text-[#7f4806]";

    case "normal":
      return "border-[#c7dcea] bg-[#e6f0f7] text-[#1f5f86]";

    case "low":
      return "border-[#e6dfcf] bg-[#f7f2e7] text-[#5f584d]";

    default:
      return "border-[#e6dfcf] bg-[#f7f2e7] text-[#5f584d]";
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
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm xl:hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/support/${ticket._id}`}
            className="text-sm font-semibold text-[#26221d] hover:underline"
          >
            {ticket.ticketNumber}
          </Link>

          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#2a2520]">
            {ticket.subject}
          </h3>

          <p className="mt-1 text-xs text-[#5f584d]">
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
      <div className="mt-4 rounded-[14px] bg-[#f7f2e7] p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-[#5f584d]">
          Customer
        </p>

        <p className="mt-1 text-sm font-semibold text-[#2a2520]">
          {ticket.customerName}
        </p>

        <p className="mt-1 truncate text-xs text-[#5f584d]">
          {ticket.customerEmail}
        </p>
      </div>

      {/* Message */}
      <div className="mt-4">
        <p className="line-clamp-3 text-sm leading-6 text-[#5f584d]">
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

        <span className="rounded-full border border-[#e6dfcf] bg-[#fffdf8] px-2.5 py-1 text-xs font-medium capitalize text-[#5f584d]">
          {ticket.category}
        </span>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] border border-[#e6dfcf] p-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Order
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#2a2520]">
            {ticket.orderNumber || "—"}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#5f584d]">
            Assigned
          </p>

          <p className="mt-1 truncate text-sm font-medium text-[#2a2520]">
            {ticket.assignedTo || "Unassigned"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e6dfcf] text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/support/${ticket._id}`}
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#e6dfcf] text-sm font-medium text-[#2a2520] transition hover:bg-[#f7f2e7]"
        >
          <Pencil size={16} />
          Edit
        </Link>

        <button
          type="button"
          onClick={() => onDelete(ticket)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#f5c2c0] text-[#b3261e] transition hover:bg-[#fdecec]"
          title="Delete ticket"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}