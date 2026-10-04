"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  MessageCircle,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getCustomerStats, getCustomers } from "@/services/customer.service";
import type { Customer, CustomerStats } from "@/types/customer";

const PAGE_SIZE = 20;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest_spend", label: "Highest spend" },
  { value: "lowest_spend", label: "Lowest spend" },
  { value: "most_orders", label: "Most orders" },
  { value: "least_orders", label: "Least orders" },
];

const consentOptions = [
  { value: "", label: "Any" },
  { value: "true", label: "Opted in" },
  { value: "false", label: "Opted out" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "CU";
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

const statusStyles: Record<string, string> = {
  active: "border-[#2c4a33] bg-[#1a2419] text-[#8fb08a]",
  inactive: "border-[#3a352f] bg-[#211e1b] text-[#cfc7bb]",
  suspended: "border-[#5a4420] bg-[#2b2216] text-[#e0b56a]",
  blocked: "border-[#5a2a27] bg-[#2b1a18] text-[#f0a39d]",
};

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        statusStyles[status] || statusStyles.inactive
      }`}
    >
      {status}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2a241b] text-sm font-semibold text-[#d9c7a3]">
      {getInitials(name)}
    </span>
  );
}

function Consent({ customer }: { customer: Customer }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        title={customer.marketingEmails ? "Email opted in" : "Email opted out"}
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          customer.marketingEmails
            ? "bg-[#1a2419] text-[#8fb08a]"
            : "bg-[#211e1b] text-[#9a9185]"
        }`}
      >
        <Mail className="h-3 w-3" />
      </span>
      <span
        title={
          customer.marketingWhatsapp
            ? "WhatsApp opted in"
            : "WhatsApp opted out"
        }
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          customer.marketingWhatsapp
            ? "bg-[#1a2419] text-[#8fb08a]"
            : "bg-[#211e1b] text-[#9a9185]"
        }`}
      >
        <MessageCircle className="h-3 w-3" />
      </span>
    </span>
  );
}

function Kpi({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="surface px-4 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
        {label}
      </p>
      {loading ? (
        <div className="mt-2 h-7 w-20 animate-pulse rounded bg-[#211e1b]" />
      ) : (
        <p className="display mt-1 text-2xl font-semibold text-[#f8f3f1]">
          {value}
        </p>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const { accessToken, isAuthenticated, isInitialized } = useAdminAuth();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState("");
  const [marketingWhatsapp, setMarketingWhatsapp] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) return;
    const timer = setTimeout(() => {
      setSearch(trimmed);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const ready = isInitialized && isAuthenticated && !!accessToken;

  const loadCustomers = useCallback(async () => {
    if (!ready || !accessToken) return;
    setLoading(true);
    try {
      const result = await getCustomers(accessToken, {
        page,
        limit: PAGE_SIZE,
        search,
        status,
        sort,
        includeArchived,
        marketingEmails: marketingEmails || undefined,
        marketingWhatsapp: marketingWhatsapp || undefined,
      });
      setCustomers(result.customers);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load customers.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    ready,
    accessToken,
    page,
    search,
    status,
    sort,
    includeArchived,
    marketingEmails,
    marketingWhatsapp,
  ]);

  const loadStats = useCallback(async () => {
    if (!ready || !accessToken) return;
    setStatsLoading(true);
    try {
      setStats(await getCustomerStats(accessToken));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load customer statistics.",
      );
    } finally {
      setStatsLoading(false);
    }
  }, [ready, accessToken]);

  useEffect(() => {
    void Promise.resolve().then(loadCustomers);
  }, [loadCustomers]);

  useEffect(() => {
    void Promise.resolve().then(loadStats);
  }, [loadStats]);

  const refresh = () => {
    void loadCustomers();
    void loadStats();
  };

  const clearFilters = () => {
        setSearchInput("");
    setSearch("");
    setStatus("");
    setSort("newest");
    setIncludeArchived(false);
    setMarketingEmails("");
    setMarketingWhatsapp("");
    setPage(1);
  };

  const pickStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const tabs = [
    { value: "", label: "All", count: stats?.total },
    { value: "active", label: "Active", count: stats?.active },
    { value: "inactive", label: "Inactive", count: stats?.inactive },
    { value: "suspended", label: "Suspended", count: stats?.suspended },
    { value: "blocked", label: "Blocked", count: stats?.blocked },
  ];

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (search)
    chips.push({
      key: "q",
      label: `Search: ${search}`,
      clear: () => {
                setSearchInput("");
        setSearch("");
        setPage(1);
      },
    });
  if (sort !== "newest")
    chips.push({
      key: "sort",
      label: `Sort: ${sortOptions.find((s) => s.value === sort)?.label}`,
      clear: () => setSort("newest"),
    });
  if (marketingEmails)
    chips.push({
      key: "me",
      label: `Email: ${marketingEmails === "true" ? "opted in" : "opted out"}`,
      clear: () => {
        setMarketingEmails("");
        setPage(1);
      },
    });
  if (marketingWhatsapp)
    chips.push({
      key: "mw",
      label: `WhatsApp: ${marketingWhatsapp === "true" ? "opted in" : "opted out"}`,
      clear: () => {
        setMarketingWhatsapp("");
        setPage(1);
      },
    });
  if (includeArchived)
    chips.push({
      key: "arch",
      label: "Including archived",
      clear: () => {
        setIncludeArchived(false);
        setPage(1);
      },
    });

  const hasFilters = chips.length > 0 || !!status;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const selectCls =
    "h-11 w-full rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none focus:border-[#b79a6a] focus:ring-2 focus:ring-[#b79a6a]/20";

  return (
    <div className="min-h-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">
            Customers
          </p>
          <h1 className="display mt-1 text-[#f8f3f1]">Your customers</h1>
          <p className="mt-1 text-sm text-[#cfc7bb]">
            Everyone who has signed up or ordered, with their spend and consent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#2e2a26] bg-[#1a1816] px-3 py-1.5 text-xs font-semibold text-[#cfc7bb]">
            {total.toLocaleString("en-IN")} shown
          </span>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b] disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi
          label="Customers"
          value={(stats?.total ?? 0).toLocaleString("en-IN")}
          loading={statsLoading}
        />
        <Kpi
          label="Active"
          value={(stats?.active ?? 0).toLocaleString("en-IN")}
          loading={statsLoading}
        />
        <Kpi
          label="Orders"
          value={(stats?.totalOrders ?? 0).toLocaleString("en-IN")}
          loading={statsLoading}
        />
        <Kpi
          label="Lifetime spend"
          value={formatCurrency(stats?.totalSpent ?? 0)}
          loading={statsLoading}
        />
        <Kpi
          label="Archived"
          value={(stats?.archived ?? 0).toLocaleString("en-IN")}
          loading={statsLoading}
        />
      </div>

      {/* Tabs */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => pickStatus(tab.value)}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                active
                  ? "border-[#f8f3f1] bg-[#b79a6a] text-[#1a1816]"
                  : "border-[#3a352f] bg-[#1a1816] text-[#cfc7bb] hover:bg-[#2a241b]"
              }`}
            >
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-2 text-xs ${
                    active ? "bg-[#1a1816]/15" : "bg-[#211e1b]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="surface space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search customers</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9185]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email or phone"
              className="h-11 w-full rounded-lg border border-[#3a352f] bg-[#1a1816] pl-10 pr-3 text-sm text-[#f8f3f1] outline-none placeholder:text-[#9a9185] focus:border-[#b79a6a] focus:ring-2 focus:ring-[#b79a6a]/20"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b] lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div
          className={`${showFilters ? "grid" : "hidden"} gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-4`}
        >
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
              Email marketing
            </span>
            <select
              value={marketingEmails}
              onChange={(e) => {
                setMarketingEmails(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              {consentOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
              WhatsApp marketing
            </span>
            <select
              value={marketingWhatsapp}
              onChange={(e) => {
                setMarketingWhatsapp(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              {consentOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex h-11 cursor-pointer items-center gap-3 self-end rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 text-sm text-[#f8f3f1]">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => {
                setIncludeArchived(e.target.checked);
                setPage(1);
              }}
              className="h-4 w-4 accent-[#f8f3f1]"
            />
            Show archived
          </label>
        </div>

        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#3a352f] bg-[#2a241b] px-3 py-1 text-xs font-semibold text-[#d9c7a3] hover:bg-[#2a241b]"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-[#d9c7a3] underline-offset-2 hover:underline"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* List */}
      {loading && customers.length === 0 ? (
        <div className="surface divide-y divide-[#2e2a26]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#211e1b]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-[#211e1b]" />
                <div className="h-3 w-56 animate-pulse rounded bg-[#211e1b]" />
              </div>
            </div>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="surface flex flex-col items-center px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2a241b] text-[#d9c7a3]">
            <Users className="h-6 w-6" />
          </span>
          <h2 className="display mt-4 text-2xl font-semibold text-[#f8f3f1]">
            {hasFilters ? "No customers match" : "No customers yet"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-[#cfc7bb]">
            {hasFilters
              ? "Try removing a filter or searching with different words."
              : "Customers appear here once they register or place an order."}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 h-11 rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] hover:bg-[#c8ad7f]"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div
            className={`surface hidden overflow-hidden md:block ${loading ? "opacity-70" : ""}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-[#2e2a26] bg-[#111111] text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9185]">
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3 text-right">Orders</th>
                    <th className="px-5 py-3 text-right">Spent</th>
                    <th className="px-5 py-3">Last order</th>
                    <th className="px-5 py-3">Consent</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e2a26]">
                  {customers.map((c) => (
                    <tr
                      key={c.userId}
                      className="transition hover:bg-[#111111]"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/customers/${c.userId}`}
                          className="flex items-center gap-3"
                        >
                          <Avatar name={c.name} />
                          <span>
                            <span className="block font-semibold text-[#f8f3f1]">
                              {c.name || "Unnamed"}
                            </span>
                            <span className="block text-xs text-[#9a9185]">
                              Joined {formatDate(c.createdAt)}
                              {c.isArchived ? " · Archived" : ""}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-[#cfc7bb]">
                        <span className="block max-w-[220px] truncate">
                          {c.email || "—"}
                        </span>
                        <span className="block text-xs text-[#9a9185]">
                          {c.phone || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[#f8f3f1]">
                        {c.totalOrders}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-[#f8f3f1]">
                        {formatCurrency(c.totalSpent)}
                      </td>
                      <td className="px-5 py-3.5 text-[#cfc7bb]">
                        {formatDate(c.lastOrderAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Consent customer={c} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phone cards */}
          <div className="space-y-3 md:hidden">
            {customers.map((c) => (
              <Link
                key={c.userId}
                href={`/admin/customers/${c.userId}`}
                className="surface surface-hover block p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-semibold text-[#f8f3f1]">
                        {c.name || "Unnamed"}
                      </p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="truncate text-xs text-[#cfc7bb]">
                      {c.email || "—"}
                    </p>
                    <p className="text-xs text-[#9a9185]">{c.phone || "—"}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#2e2a26] pt-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9a9185]">
                      Orders
                    </p>
                    <p className="font-semibold text-[#f8f3f1]">
                      {c.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#9a9185]">
                      Spent
                    </p>
                    <p className="font-semibold text-[#f8f3f1]">
                      {formatCurrency(c.totalSpent)}
                    </p>
                  </div>
                  <div className="flex items-end justify-end">
                    <Consent customer={c} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#cfc7bb]">
              Showing {from}–{to} of {total.toLocaleString("en-IN")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b] disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-[#3a352f] bg-[#1a1816] px-3 text-sm font-semibold text-[#f8f3f1] hover:bg-[#2a241b] disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
