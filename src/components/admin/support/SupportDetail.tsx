"use client";

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
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "in_progress":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "waiting_customer":
      return "bg-purple-50 text-purple-700 ring-purple-200";
    case "resolved":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "closed":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function getPriorityClasses(priority: SupportPriority) {
  switch (priority) {
    case "urgent":
      return "bg-red-50 text-red-700 ring-red-200";
    case "high":
      return "bg-orange-50 text-orange-700 ring-orange-200";
    case "normal":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "low":
      return "bg-slate-100 text-slate-600 ring-slate-200";
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
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

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${ticket.ticketNumber}?`
    );

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/support"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Back to support"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900">
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

            <p className="mt-1 text-sm text-slate-500">
              Support ticket details and management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#9f1239] px-4 text-sm font-medium text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-rose-600" />
                <h2 className="font-semibold text-slate-900">
                  Customer Message
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={9}
                      className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-slate-900">
                    {ticket.subject}
                  </h3>

                  <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {ticket.message}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Resolution */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h2 className="font-semibold text-slate-900">
                  Resolution
                </h2>
              </div>
            </div>

            <div className="p-5">
              {isEditing ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Resolution Note
                  </label>

                  <textarea
                    value={resolutionNote}
                    onChange={(event) =>
                      setResolutionNote(event.target.value)
                    }
                    rows={5}
                    placeholder="Add a resolution note..."
                    className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {ticket.resolutionNote || "No resolution note added."}
                </p>
              )}
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-600" />
                <h2 className="font-semibold text-slate-900">
                  Customer Information
                </h2>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(event) =>
                        setCustomerEmail(event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Name
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {ticket.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>
                    <a
                      href={`mailto:${ticket.customerEmail}`}
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-rose-700 hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {ticket.customerEmail}
                    </a>
                  </div>
                </>
              )}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  User ID
                </p>
                <p className="mt-1 break-all text-sm text-slate-700">
                  {ticket.userId || "Guest Customer"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Order Number
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {ticket.orderNumber || "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Ticket Management
              </h2>
            </div>

            <div className="space-y-5 p-5">
              {isEditing ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <div className="relative">
                      <select
                        value={status}
                        onChange={(event) =>
                          setStatus(event.target.value as SupportStatus)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Priority
                    </label>

                    <div className="relative">
                      <select
                        value={priority}
                        onChange={(event) =>
                          setPriority(event.target.value as SupportPriority)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Category
                    </label>

                    <div className="relative">
                      <select
                        value={category}
                        onChange={(event) =>
                          setCategory(event.target.value as SupportCategory)
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      >
                        {CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Assigned To
                    </label>

                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(event) => setAssignedTo(event.target.value)}
                      placeholder="Admin / staff ID"
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatLabel(ticket.category)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Assigned To
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-900">
                      {ticket.assignedTo || "Unassigned"}
                    </p>
                  </div>
                </>
              )}

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Created
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Last Updated
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                </div>

                {ticket.closedAt && (
                  <div className="mt-4 flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Closed
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
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
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Close Ticket
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
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
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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