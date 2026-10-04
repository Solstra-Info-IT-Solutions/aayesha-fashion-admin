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

export default function SupportTable({
  tickets,
  onDelete,
}: SupportTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm xl:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-[#2e2a26] bg-[#111111]/70">
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Ticket
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Customer
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Subject
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Category
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Priority
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Status
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Assigned To
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Date
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#cfc7bb]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#2e2a26]">
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="transition hover:bg-[#111111]/50"
              >
                {/* Ticket */}
                <td className="whitespace-nowrap px-4 py-4">
                  <Link
                    href={`/admin/support/${ticket._id}`}
                    className="font-semibold text-[#f8f3f1] transition hover:underline"
                  >
                    {ticket.ticketNumber}
                  </Link>

                  {ticket.orderNumber && (
                    <p className="mt-1 text-xs text-[#cfc7bb]">
                      Order: {ticket.orderNumber}
                    </p>
                  )}
                </td>

                {/* Customer */}
                <td className="max-w-[190px] px-4 py-4">
                  <p className="truncate text-sm font-medium text-[#f8f3f1]">
                    {ticket.customerName}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#cfc7bb]">
                    {ticket.customerEmail}
                  </p>
                </td>

                {/* Subject */}
                <td className="max-w-[250px] px-4 py-4">
                  <p className="truncate text-sm font-medium text-[#f8f3f1]">
                    {ticket.subject}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-[#cfc7bb]">
                    {ticket.message}
                  </p>
                </td>

                {/* Category */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium capitalize text-[#f8f3f1]">
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
                  <span className="block truncate text-sm text-[#cfc7bb]">
                    {ticket.assignedTo || "Unassigned"}
                  </span>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-4 py-4 text-sm text-[#cfc7bb]">
                  {formatDate(ticket.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="View ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] text-[#cfc7bb] transition hover:bg-[#111111] hover:text-[#f8f3f1]"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/support/${ticket._id}`}
                      title="Edit ticket"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] text-[#cfc7bb] transition hover:bg-[#111111] hover:text-[#f8f3f1]"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDelete(ticket)}
                      title="Delete ticket"
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