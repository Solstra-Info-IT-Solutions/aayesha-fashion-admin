"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShoppingBag,
  UserRound,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  getCustomerStats,
  getCustomers,
} from "@/services/customer.service";

import type {
  Customer,
  CustomerStats,
} from "@/types/customer";

const statusOptions = [
  {
    value: "",
    label: "All Status",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "blocked",
    label: "Blocked",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
  {
    value: "highest_spend",
    label: "Highest Spend",
  },
  {
    value: "lowest_spend",
    label: "Lowest Spend",
  },
  {
    value: "most_orders",
    label: "Most Orders",
  },
  {
    value: "least_orders",
    label: "Least Orders",
  },
];

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value || 0);
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getInitials(
  name: string,
) {
  const words =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (!words.length) {
    return "CU";
  }

  return words
    .slice(0, 2)
    .map(
      (word) =>
        word[0]?.toUpperCase() || "",
    )
    .join("");
}

function statusClass(
  status: Customer["status"],
) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "inactive":
      return "bg-slate-100 text-slate-600 border-slate-200";

    case "suspended":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "blocked":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function CustomersPage() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [stats, setStats] =
    useState<CustomerStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [sort, setSort] =
    useState("newest");

  const [includeArchived, setIncludeArchived] =
    useState(false);

  const [marketingEmails, setMarketingEmails] =
    useState("");

  const [marketingWhatsapp, setMarketingWhatsapp] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [limit] =
    useState(20);

  const [total, setTotal] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(0);

  const [showFilters, setShowFilters] =
    useState(false);

  const loadCustomers =
    useCallback(
      async () => {
        if (
          !isInitialized ||
          !isAuthenticated ||
          !accessToken
        ) {
          return;
        }

        setLoading(true);

        try {
          const result =
            await getCustomers(
              accessToken,
              {
                page,
                limit,
                search,
                status,
                sort,
                includeArchived,
                marketingEmails:
                  marketingEmails || undefined,
                marketingWhatsapp:
                  marketingWhatsapp || undefined,
              },
            );

          setCustomers(
            result.customers,
          );

          setTotal(
            result.pagination.total,
          );

          setTotalPages(
            result.pagination.totalPages,
          );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load customers.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        accessToken,
        isAuthenticated,
        isInitialized,
        page,
        limit,
        search,
        status,
        sort,
        includeArchived,
        marketingEmails,
        marketingWhatsapp,
      ],
    );

  const loadStats =
    useCallback(
      async () => {
        if (
          !isInitialized ||
          !isAuthenticated ||
          !accessToken
        ) {
          return;
        }

        setStatsLoading(true);

        try {
          const result =
            await getCustomerStats(
              accessToken,
            );

          setStats(result);
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load customer statistics.",
          );
        } finally {
          setStatsLoading(false);
        }
      },
      [
        accessToken,
        isAuthenticated,
        isInitialized,
      ],
    );

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    void loadCustomers();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadCustomers,
  ]);

  useEffect(() => {
    if (
      !isInitialized ||
      !isAuthenticated ||
      !accessToken
    ) {
      return;
    }

    void loadStats();
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadStats,
  ]);

  function handleSearch(
    value: string,
  ) {
    setSearch(value);
    setPage(1);
  }

  function handleStatus(
    value: string,
  ) {
    setStatus(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setMarketingEmails("");
    setMarketingWhatsapp("");
    setIncludeArchived(false);
    setSort("newest");
    setPage(1);
  }

  const authLoading =
    !isInitialized ||
    !isAuthenticated ||
    !accessToken;

  return (
    <div className="min-h-full bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-[var(--color-secondary)]">
              <span>Admin</span>
              <span>/</span>
              <span>Customers</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1 text-sm text-[var(--color-secondary)]">
              Manage customer profiles,
              accounts and activity.
            </p>
          </div>

          <button
            type="button"
            disabled={authLoading}
            onClick={() => {
              void loadCustomers();
              void loadStats();
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* STATS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Total Customers"
            value={
              statsLoading
                ? "—"
                : String(
                    stats?.total ?? 0,
                  )
            }
            icon={<Users size={19} />}
          />

          <StatCard
            title="Active"
            value={
              statsLoading
                ? "—"
                : String(
                    stats?.active ?? 0,
                  )
            }
            icon={<UserRound size={19} />}
          />

          <StatCard
            title="Orders"
            value={
              statsLoading
                ? "—"
                : String(
                    stats?.totalOrders ?? 0,
                  )
            }
            icon={<ShoppingBag size={19} />}
          />

          <StatCard
            title="Total Spent"
            value={
              statsLoading
                ? "—"
                : formatCurrency(
                    stats?.totalSpent ?? 0,
                  )
            }
            icon={
              <span className="text-base font-semibold">
                ₹
              </span>
            }
          />

          <StatCard
            title="Archived"
            value={
              statsLoading
                ? "—"
                : String(
                    stats?.archived ?? 0,
                  )
            }
            icon={
              <MoreHorizontal size={19} />
            }
          />

        </div>

        {/* FILTER BAR */}

        <div className="rounded-xl border border-[var(--color-border)] bg-white shadow-sm">

          <div className="border-b border-[var(--color-border)] p-4">

            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">

              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    handleSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search by name, email or phone..."
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white pl-10 pr-4 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-rose-dark)] focus:ring-2 focus:ring-[var(--color-rose-dark)]/10"
                />
              </div>

              <select
                value={status}
                onChange={(event) =>
                  handleStatus(
                    event.target.value,
                  )
                }
                className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
              >
                {statusOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

              <select
                value={sort}
                onChange={(event) => {
                  setSort(
                    event.target.value,
                  );
                  setPage(1);
                }}
                className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
              >
                {sortOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (value) => !value,
                  )
                }
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${
                  showFilters
                    ? "border-[var(--color-rose-dark)] bg-[var(--color-rose-dark)] text-white"
                    : "border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:bg-slate-50"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>

            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-4 md:grid-cols-3">

                <select
                  value={marketingEmails}
                  onChange={(event) => {
                    setMarketingEmails(
                      event.target.value,
                    );
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none"
                >
                  <option value="">
                    Email Marketing: All
                  </option>

                  <option value="true">
                    Email Marketing: Yes
                  </option>

                  <option value="false">
                    Email Marketing: No
                  </option>
                </select>

                <select
                  value={marketingWhatsapp}
                  onChange={(event) => {
                    setMarketingWhatsapp(
                      event.target.value,
                    );
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none"
                >
                  <option value="">
                    WhatsApp: All
                  </option>

                  <option value="true">
                    WhatsApp: Yes
                  </option>

                  <option value="false">
                    WhatsApp: No
                  </option>
                </select>

                <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-ink)]">
                  <input
                    type="checkbox"
                    checked={includeArchived}
                    onChange={(event) => {
                      setIncludeArchived(
                        event.target.checked,
                      );
                      setPage(1);
                    }}
                    className="h-4 w-4 accent-[var(--color-ink)]"
                  />

                  Show archived customers
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-left text-sm font-medium text-[var(--color-rose-dark)] hover:underline"
                >
                  Clear all filters
                </button>

              </div>
            )}

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Orders
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total Spent
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Order
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading || authLoading ? (
                  <CustomerSkeleton />
                ) : customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                          <Users
                            size={21}
                            className="text-slate-400"
                          />
                        </div>

                        <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                          No customers found
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-secondary)]">
                          Try changing your search
                          or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map(
                    (customer) => (
                      <tr
                        key={customer.userId}
                        className="border-b border-[var(--color-border)] last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/customers/${customer.userId}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-rose-light)] text-xs font-semibold text-[var(--color-rose-dark)]">
                              {getInitials(
                                customer.name,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[var(--color-ink)] hover:text-[var(--color-rose-dark)]">
                                {customer.name ||
                                  "Unnamed Customer"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Joined{" "}
                                {formatDate(
                                  customer.createdAt,
                                )}
                              </p>
                            </div>
                          </Link>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                              <Mail
                                size={14}
                                className="text-slate-400"
                              />
                              {customer.email ||
                                "—"}
                            </p>

                            <p className="flex items-center gap-2 text-xs text-slate-500">
                              <MessageCircle
                                size={13}
                                className="text-slate-400"
                              />
                              {customer.phone ||
                                "—"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                          {customer.totalOrders}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-[var(--color-ink)]">
                          {formatCurrency(
                            customer.totalSpent,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            customer.lastOrderAt,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                                customer.status,
                              )}`}
                            >
                              {customer.status}
                            </span>

                            {customer.isArchived && (
                              <span className="text-[11px] font-medium text-slate-500">
                                Archived
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/customers/${customer.userId}`}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
                          >
                            <Eye size={15} />
                            View
                          </Link>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          {!loading &&
            !authLoading &&
            customers.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-[var(--color-ink)]">
                    {Math.min(
                      (page - 1) *
                        limit +
                        1,
                      total,
                    )}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-[var(--color-ink)]">
                    {Math.min(
                      page * limit,
                      total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[var(--color-ink)]">
                    {total}
                  </span>{" "}
                  customers
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.max(
                            1,
                            value - 1,
                          ),
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={16}
                    />
                  </button>

                  <span className="px-3 text-sm font-medium text-[var(--color-ink)]">
                    {page} /{" "}
                    {totalPages || 1}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.min(
                            totalPages,
                            value + 1,
                          ),
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-rose-light)] text-[var(--color-rose-dark)]">
          {icon}
        </div>
      </div>
    </div>
  );
}

function CustomerSkeleton() {
  return (
    <>
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-[var(--color-border)]"
        >
          {Array.from({
            length: 7,
          }).map(
            (_, cellIndex) => (
              <td
                key={cellIndex}
                className="px-5 py-5"
              >
                <div className="h-4 animate-pulse rounded bg-slate-100" />
              </td>
            ),
          )}
        </tr>
      ))}
    </>
  );
}