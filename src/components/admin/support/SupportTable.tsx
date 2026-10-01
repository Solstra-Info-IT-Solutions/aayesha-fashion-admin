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

export default function SupportTable({
  tickets,
  onDelete,
}: SupportTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm xl:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]/70">
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Ticket
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Customer
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Subject
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Category
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Priority
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Status
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Assigned To
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Date
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#5f584d]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e6dfcf]">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="transition hover:bg-[#f7f2e7]/50"
              >
                {/* Ticket */}
                <td className="whitespace-nowrap px-4 py-4">
                  <Link
                    href={`/admin/support/${ticket._id}`}
                    className="font-semibold text-[#26221d] transition hover:underline"
                  >
                    {ticket.ticketNumber}
                  </Link>

                  {ticket.orderNumber && (
                    <p className="mt-1 text-xs text-[#5f584d]">
                      Order: {ticket.orderNumber}
                    </p>
                  )}
                </td>

                {/* Customer */}
                <td className="max-w-[190px] px-4 py-4">
                  <p className="truncate text-sm font-medium text-[#2a2520]">
                    {ticket.customerName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#5f584d]">
                    {ticket.customerEmail}
                  </p>
                </td>

                {/* Subject */}
                <td className="max-w-[250px] px-4 py-4">
                  <p className="truncate text-sm font-medium text-[#2a2520]">
                    {ticket.subject}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-[#5f584d]">
                    {ticket.message}
                  </p>
                </td>

                {/* Category */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium capitalize text-[#2a2520]">
                    {ticket.category}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getPriorityClasses(
                      ticket.priority,
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      ticket.status,
                    )}`}
                  >
                    {formatStatus(ticket.status)}
                  </span>
                </td>

                {/* Assigned */}
                <td className="max-w-[150px] px-4 py-4">
                  <span className="block truncate text-sm text-[#5f584d]">
                    {ticket.assignedTo || "Unassigned"}
                  </span>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-[#5f584d]">
                  {formatDate(ticket.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="View ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#26221d]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="Edit ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#26221d]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(ticket)}
                      title="Delete ticket"
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