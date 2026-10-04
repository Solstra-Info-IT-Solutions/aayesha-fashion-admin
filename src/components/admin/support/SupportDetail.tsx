"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
import { useConfirm } from "@/components/ui/useConfirm";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Mail,
  MessageSquare,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";

import type {
  SupportCategory,
  SupportPriority,
  SupportStatus,
  SupportTicket,
  SupportUpdateInput,
} from "@/types/support";

type SupportDetailProps = {
  ticket: SupportTicket;
  updating?: boolean;
  closing?: boolean;
  deleting?: boolean;
  onUpdate?: (data: SupportUpdateInput) => void;
  onClose?: (resolutionNote?: string) => void;
  onDelete: () => void;
};

const STATUS_OPTIONS: {
  value: SupportStatus;
  label: string;
}[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_customer", label: "Waiting Customer" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const PRIORITY_OPTIONS: {
  value: SupportPriority;
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const CATEGORY_OPTIONS: {
  value: SupportCategory;
  label: string;
}[] = [
  { value: "general", label: "General" },
  { value: "order", label: "Order" },
  { value: "payment", label: "Payment" },
  { value: "shipping", label: "Shipping" },
  { value: "return", label: "Return" },
  { value: "exchange", label: "Exchange" },
  { value: "product", label: "Product" },
  { value: "complaint", label: "Complaint" },
];

function formatDate(value: string | null) {
  if (!value) return "—";

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

function getStatusClasses(status: SupportStatus) {
  switch (status) {
    case "open":
      return "bg-[#16222b] text-[#8fbfdc] ring-[#2c4658]";
    case "in_progress":
      return "bg-[#2b2216] text-[#e0b56a] ring-[#5a4420]";
    case "waiting_customer":
      return "bg-[#221f33] text-[#c4baf5] ring-[#3d3660]";
    case "resolved":
      return "bg-[#1a2419] text-[#8fb08a] ring-[#2c4a33]";
    case "closed":
      return "bg-[#211e1b] text-[#e6dfd4] ring-[#2e2a26]";
    default:
      return "bg-[#211e1b] text-[#e6dfd4] ring-[#2e2a26]";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "bg-[#2b1a18] text-[#f0a39d] ring-[#5a2a27]";
    case "high":
      return "bg-[#2b2216] text-[#e0b56a] ring-[#5a4420]";
    case "normal":
      return "bg-[#16222b] text-[#8fbfdc] ring-[#2c4658]";
    case "low":
      return "bg-[#211e1b] text-[#cfc7bb] ring-[#2e2a26]";
    default:
      return "bg-[#211e1b] text-[#cfc7bb] ring-[#2e2a26]";
  }
}

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SupportDetail({
  ticket,
  updating = false,
  closing = false,
  deleting = false,
  onUpdate,
  onClose,
  onDelete,
}: SupportDetailProps) {
  const { confirm, dialog: confirmDialog } = useConfirm();
  const [isEditing, setIsEditing] = useState(false);

  const [customerName, setCustomerName] = useState(ticket.customerName);
  const [customerEmail, setCustomerEmail] = useState(ticket.customerEmail);
  const [subject, setSubject] = useState(ticket.subject);
  const [message, setMessage] = useState(ticket.message);
  const [category, setCategory] = useState<SupportCategory>(ticket.category);
  const [priority, setPriority] = useState<SupportPriority>(ticket.priority);
  const [status, setStatus] = useState<SupportStatus>(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo ?? "");
  const [resolutionNote, setResolutionNote] = useState(
    ticket.resolutionNote ?? ""
  );

  useEffect(() => {
    setCustomerName(ticket.customerName);
    setCustomerEmail(ticket.customerEmail);
    setSubject(ticket.subject);
    setMessage(ticket.message);
    setCategory(ticket.category);
    setPriority(ticket.priority);
    setStatus(ticket.status);
    setAssignedTo(ticket.assignedTo ?? "");
    setResolutionNote(ticket.resolutionNote ?? "");
  }, [ticket]);

  const handleSave = () => {
    if (!onUpdate) return;

    const data: SupportUpdateInput = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority,
      status,
      assignedTo: assignedTo.trim() || null,
      resolutionNote: resolutionNote.trim(),
    };

    onUpdate(data);
  };

  const handleCancel = () => {
    setCustomerName(ticket.customerName);
    setCustomerEmail(ticket.customerEmail);
    setSubject(ticket.subject);
    setMessage(ticket.message);
    setCategory(ticket.category);
    setPriority(ticket.priority);
    setStatus(ticket.status);
    setAssignedTo(ticket.assignedTo ?? "");
    setResolutionNote(ticket.resolutionNote ?? "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete this ticket?",
      description: `Ticket ${ticket.ticketNumber} will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete ticket",
    });

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6">
      {confirmDialog}
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <SmartBackLink
            href="/admin/support"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#2e2a26] bg-[#1a1816] text-[#cfc7bb] transition hover:bg-[#111111]"
            aria-label="Back to support"
          >
            <ArrowLeft className="h-5 w-5" />
          </SmartBackLink>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[#f8f3f1]">
                {ticket.ticketNumber}
              </h1>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusClasses(
                  ticket.status
                )}`}
              >
                {formatLabel(ticket.status)}
              </span>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getPriorityClasses(
                  ticket.priority
                )}`}
              >
                {formatLabel(ticket.priority)}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#9a9185]">
              Support ticket details and management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-4 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#111111]"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updating}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-4 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#b79a6a] px-4 text-sm font-medium text-[#111111] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#5a2a27] bg-[#1a1816] px-4 text-sm font-medium text-[#e08b84] transition hover:bg-[#2b1a18] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Conversation */}
        <div className="space-y-6">
          <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
            <div className="border-b border-[#2e2a26] px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#d9c7a3]" />
                <h2 className="font-semibold text-[#f8f3f1]">
                  Customer Message
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={9}
                      className="w-full resize-y rounded-lg border border-[#2e2a26] px-3 py-3 text-sm leading-6 text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-[#f8f3f1]">
                    {ticket.subject}
                  </h3>

                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#cfc7bb]">
                    {ticket.message}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Resolution */}
          <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
            <div className="border-b border-[#2e2a26] px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#8fb08a]" />
                <h2 className="font-semibold text-[#f8f3f1]">
                  Resolution
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                    Resolution Note
                  </label>

                  <textarea
                    value={resolutionNote}
                    onChange={(event) =>
                      setResolutionNote(event.target.value)
                    }
                    rows={5}
                    placeholder="Add a resolution note..."
                    className="w-full resize-y rounded-lg border border-[#2e2a26] px-3 py-3 text-sm leading-6 text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#cfc7bb]">
                  {ticket.resolutionNote || "No resolution note added."}
                </p>
              )}
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
            <div className="border-b border-[#2e2a26] px-5 py-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#cfc7bb]" />
                <h2 className="font-semibold text-[#f8f3f1]">
                  Customer Information
                </h2>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(event) =>
                        setCustomerEmail(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#f8f3f1]">
                      {ticket.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Email
                    </p>
                    <a
                      href={`mailto:${ticket.customerEmail}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[#d9c7a3] hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {ticket.customerEmail}
                    </a>
                  </div>
                </>
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                  User ID
                </p>
                <p className="mt-1 break-all text-sm text-[#e6dfd4]">
                  {ticket.userId || "Guest Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                  Order Number
                </p>
                <p className="mt-1 text-sm font-medium text-[#f8f3f1]">
                  {ticket.orderNumber || "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
            <div className="border-b border-[#2e2a26] px-5 py-4">
              <h2 className="font-semibold text-[#f8f3f1]">
                Ticket Management
              </h2>
            </div>

            <div className="space-y-5 p-5">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Status
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value as SupportStatus)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 pr-9 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Priority
                    </label>

                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(event.target.value as SupportPriority)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 pr-9 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Category
                    </label>

                    <div className="relative">
                      <select
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value as SupportCategory)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 pr-9 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#e6dfd4]">
                      Assigned To
                    </label>

                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(event) => setAssignedTo(event.target.value)}
                      placeholder="Admin / staff ID"
                      className="h-11 w-full rounded-lg border border-[#2e2a26] px-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2e2a26]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getStatusClasses(
                        ticket.status
                      )}`}
                    >
                      {formatLabel(ticket.status)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Priority
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${getPriorityClasses(
                        ticket.priority
                      )}`}
                    >
                      {formatLabel(ticket.priority)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#f8f3f1]">
                      {formatLabel(ticket.category)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Assigned To
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-[#f8f3f1]">
                      {ticket.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </>
              )}

              <div className="border-t border-[#2e2a26] pt-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9185]" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Created
                    </p>
                    <p className="mt-1 text-sm text-[#e6dfd4]">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9185]" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-[#e6dfd4]">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                </div>

                {ticket.closedAt && (
                  <div className="mt-4 flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8fb08a]" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#9a9185]">
                        Closed
                      </p>
                      <p className="mt-1 text-sm text-[#e6dfd4]">
                        {formatDate(ticket.closedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Close ticket */}
          {ticket.status !== "closed" && onClose && (
            <section className="rounded-[14px] border border-[#2c4a33] bg-[#1a2419]/50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2c4a33]">
                  <CheckCircle2 className="h-5 w-5 text-[#8fb08a]" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#f8f3f1]">
                    Close Ticket
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#9a9185]">
                    Mark this support ticket as closed once the issue has been
                    resolved.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={closing}
                onClick={() => {
                  const note = window.prompt(
                    "Resolution note (optional):",
                    ticket.resolutionNote || ""
                  );

                  if (note !== null) {
                    onClose(note.trim() || undefined);
                  }
                }}
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8fb08a] px-4 text-sm font-medium text-[#111111] transition hover:bg-[#8fb08a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {closing ? "Closing..." : "Close Ticket"}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}