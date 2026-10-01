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
      return "bg-[#e6f0f7] text-[#1f5f86] ring-[#c7dcea]";
    case "in_progress":
      return "bg-[#fdf3e1] text-[#7f4806] ring-[#f6d08a]";
    case "waiting_customer":
      return "bg-[#efebf8] text-[#4f43a0] ring-[#d9d2ee]";
    case "resolved":
      return "bg-[#e8f5ec] text-[#276541] ring-[#bfe3cb]";
    case "closed":
      return "bg-[#efe8d8] text-[#3d372f] ring-[#e6dfcf]";
    default:
      return "bg-[#efe8d8] text-[#3d372f] ring-[#e6dfcf]";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "bg-[#fdecec] text-[#8f1f19] ring-[#f5c2c0]";
    case "high":
      return "bg-[#fdf3e1] text-[#7f4806] ring-[#f6d08a]";
    case "normal":
      return "bg-[#e6f0f7] text-[#1f5f86] ring-[#c7dcea]";
    case "low":
      return "bg-[#efe8d8] text-[#5f584d] ring-[#e6dfcf]";
    default:
      return "bg-[#efe8d8] text-[#5f584d] ring-[#e6dfcf]";
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e6dfcf] bg-[#fffdf8] text-[#5f584d] transition hover:bg-[#f7f2e7]"
            aria-label="Back to support"
          >
            <ArrowLeft className="h-5 w-5" />
          </SmartBackLink>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[#2a2520]">
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

            <p className="mt-1 text-sm text-[#756d62]">
              Support ticket details and management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#3d372f] transition hover:bg-[#f7f2e7]"
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
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#3d372f] transition hover:bg-[#f7f2e7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#26221d] px-4 text-sm font-medium text-white transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#f5c2c0] bg-[#fffdf8] px-4 text-sm font-medium text-[#b3261e] transition hover:bg-[#fdecec] disabled:cursor-not-allowed disabled:opacity-50"
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
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e6dfcf] px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#6f542f]" />
                <h2 className="font-semibold text-[#2a2520]">
                  Customer Message
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={9}
                      className="w-full resize-y rounded-lg border border-[#e6dfcf] px-3 py-3 text-sm leading-6 text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-[#2a2520]">
                    {ticket.subject}
                  </h3>

                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#5f584d]">
                    {ticket.message}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Resolution */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e6dfcf] px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#276541]" />
                <h2 className="font-semibold text-[#2a2520]">
                  Resolution
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                    Resolution Note
                  </label>

                  <textarea
                    value={resolutionNote}
                    onChange={(event) =>
                      setResolutionNote(event.target.value)
                    }
                    rows={5}
                    placeholder="Add a resolution note..."
                    className="w-full resize-y rounded-lg border border-[#e6dfcf] px-3 py-3 text-sm leading-6 text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#5f584d]">
                  {ticket.resolutionNote || "No resolution note added."}
                </p>
              )}
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e6dfcf] px-5 py-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#5f584d]" />
                <h2 className="font-semibold text-[#2a2520]">
                  Customer Information
                </h2>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(event) =>
                        setCustomerEmail(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#2a2520]">
                      {ticket.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Email
                    </p>
                    <a
                      href={`mailto:${ticket.customerEmail}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[#6f542f] hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {ticket.customerEmail}
                    </a>
                  </div>
                </>
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                  User ID
                </p>
                <p className="mt-1 break-all text-sm text-[#3d372f]">
                  {ticket.userId || "Guest Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                  Order Number
                </p>
                <p className="mt-1 text-sm font-medium text-[#2a2520]">
                  {ticket.orderNumber || "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
            <div className="border-b border-[#e6dfcf] px-5 py-4">
              <h2 className="font-semibold text-[#2a2520]">
                Ticket Management
              </h2>
            </div>

            <div className="space-y-5 p-5">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Status
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value as SupportStatus)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 pr-9 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756d62]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Priority
                    </label>

                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(event.target.value as SupportPriority)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 pr-9 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756d62]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Category
                    </label>

                    <div className="relative">
                      <select
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value as SupportCategory)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 pr-9 text-sm text-[#2a2520] outline-none transition focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756d62]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3d372f]">
                      Assigned To
                    </label>

                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(event) => setAssignedTo(event.target.value)}
                      placeholder="Admin / staff ID"
                      className="h-11 w-full rounded-lg border border-[#e6dfcf] px-3 text-sm text-[#2a2520] outline-none transition placeholder:text-[#756d62] focus:border-[#b08d57] focus:ring-2 focus:ring-[#e6dfcf]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
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
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
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
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#2a2520]">
                      {formatLabel(ticket.category)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Assigned To
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-[#2a2520]">
                      {ticket.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </>
              )}

              <div className="border-t border-[#e6dfcf] pt-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#756d62]" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Created
                    </p>
                    <p className="mt-1 text-sm text-[#3d372f]">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#756d62]" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-[#3d372f]">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                </div>

                {ticket.closedAt && (
                  <div className="mt-4 flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#276541]" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
                        Closed
                      </p>
                      <p className="mt-1 text-sm text-[#3d372f]">
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
            <section className="rounded-[14px] border border-[#bfe3cb] bg-[#e8f5ec]/50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#bfe3cb]">
                  <CheckCircle2 className="h-5 w-5 text-[#276541]" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#2a2520]">
                    Close Ticket
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#756d62]">
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
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#276541] px-4 text-sm font-medium text-white transition hover:bg-[#276541] disabled:cursor-not-allowed disabled:opacity-60"
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