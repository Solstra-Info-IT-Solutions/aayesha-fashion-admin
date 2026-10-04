"use client";

import {
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  SUPPORT_SORTS,
  SUPPORT_STATUSES,
  type SupportCategory,
  type SupportPriority,
  type SupportSort,
  type SupportStatus,
} from "@/types/support";

type SupportFiltersProps = {
  search: string;
  status: SupportStatus | "";
  priority: SupportPriority | "";
  category: SupportCategory | "";
  assignedTo: string;
  sort: SupportSort;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: SupportStatus | "") => void;
  onPriorityChange: (value: SupportPriority | "") => void;
  onCategoryChange: (value: SupportCategory | "") => void;
  onAssignedToChange: (value: string) => void;
  onSortChange: (value: SupportSort) => void;
  onReset: () => void;
};

const statusLabels: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_customer: "Waiting Customer",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityLabels: Record<SupportPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

const categoryLabels: Record<SupportCategory, string> = {
  general: "General",
  order: "Order",
  payment: "Payment",
  shipping: "Shipping",
  return: "Return",
  exchange: "Exchange",
  product: "Product",
  complaint: "Complaint",
};

const sortLabels: Record<SupportSort, string> = {
  newest: "Newest",
  oldest: "Oldest",
  priority_high: "Priority: High to Low",
  priority_low: "Priority: Low to High",
};

export default function SupportFilters({
  search,
  status,
  priority,
  category,
  assignedTo,
  sort,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onAssignedToChange,
  onSortChange,
  onReset,
}: SupportFiltersProps) {
  const hasFilters = Boolean(
    search ||
      status ||
      priority ||
      category ||
      assignedTo ||
      sort !== "newest",
  );

  return (
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-4 shadow-sm">
      {/* Filter Header */}
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal
          size={17}
          className="text-[#f8f3f1]"
        />

        <h2 className="text-sm font-semibold text-[#f8f3f1]">
          Filters
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div className="relative sm:col-span-2 xl:col-span-2">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#cfc7bb]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search ticket, customer, email or subject..."
            className="h-10 w-full rounded-lg border border-[#2e2a26] bg-[#1a1816] pl-10 pr-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as SupportStatus | "",
            )
          }
          className="h-10 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
        >
          <option value="">All Statuses</option>

          {SUPPORT_STATUSES.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(event) =>
            onPriorityChange(
              event.target.value as SupportPriority | "",
            )
          }
          className="h-10 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
        >
          <option value="">All Priorities</option>

          {SUPPORT_PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {priorityLabels[item]}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(event) =>
            onCategoryChange(
              event.target.value as SupportCategory | "",
            )
          }
          className="h-10 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
        >
          <option value="">All Categories</option>

          {SUPPORT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {categoryLabels[item]}
            </option>
          ))}
        </select>

        {/* Assigned To */}
        <input
          type="text"
          value={assignedTo}
          onChange={(event) =>
            onAssignedToChange(event.target.value)
          }
          placeholder="Assigned admin ID..."
          className="h-10 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition placeholder:text-[#9a9185] focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.target.value as SupportSort,
            )
          }
          className="h-10 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#f8f3f1] focus:ring-2 focus:ring-[#f8f3f1]/10"
        >
          {SUPPORT_SORTS.map((item) => (
            <option key={item} value={item}>
              {sortLabels[item]}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#2e2a26] bg-[#1a1816] px-4 text-sm font-medium text-[#f8f3f1] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}