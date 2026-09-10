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

type SupportTableProps = {
  tickets: SupportTicket[];
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

export default function SupportTable({
  tickets,
  onDelete,
}: SupportTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm lg:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-gray-50/70">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Ticket
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Subject
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Priority
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Assigned To
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--color-border)]">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="transition hover:bg-gray-50/50"
              >
                {/* Ticket */}
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/support/${ticket._id}`}
                    className="font-semibold text-[#9f1239] transition hover:underline"
                  >
                    {ticket.ticketNumber}
                  </Link>

                  {ticket.orderNumber && (
                    <p className="mt-1 text-xs text-[var(--color-secondary)]">
                      Order: {ticket.orderNumber}
                    </p>
                  )}
                </td>

                {/* Customer */}
                <td className="max-w-[190px] px-5 py-4">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {ticket.customerName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--color-secondary)]">
                    {ticket.customerEmail}
                  </p>
                </td>

                {/* Subject */}
                <td className="max-w-[250px] px-5 py-4">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {ticket.subject}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-[var(--color-secondary)]">
                    {ticket.message}
                  </p>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="text-sm font-medium capitalize text-[var(--color-ink)]">
                    {ticket.category}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityClasses(
                      ticket.priority,
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      ticket.status,
                    )}`}
                  >
                    {formatStatus(ticket.status)}
                  </span>
                </td>

                {/* Assigned */}
                <td className="max-w-[150px] px-5 py-4">
                  <span className="block truncate text-sm text-[var(--color-secondary)]">
                    {ticket.assignedTo || "Unassigned"}
                  </span>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[var(--color-secondary)]">
                  {formatDate(ticket.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="View ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-gray-50 hover:text-[#9f1239]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="Edit ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-secondary)] transition hover:bg-gray-50 hover:text-[#9f1239]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(ticket)}
                      title="Delete ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
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