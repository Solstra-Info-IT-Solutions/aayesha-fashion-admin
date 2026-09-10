"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Edit3,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  archiveCustomer,
  deleteCustomer,
  getCustomer,
  getCustomerActivity,
  getCustomerAddresses,
  getCustomerOrders,
  restoreCustomer,
  updateCustomer,
  updateCustomerStatus,
} from "@/services/customer.service";

import type {
  Customer,
  CustomerActivity,
  CustomerAddress,
  CustomerOrder,
} from "@/types/customer";

type Props = {
  userId: string;
};

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
  value?: string | null,
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

function formatDateTime(
  value?: string | null,
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
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(value));
}

function initials(
  name: string,
) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() || "",
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

export default function CustomerDetailsPage({
  userId,
}: Props) {
  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [addresses, setAddresses] =
    useState<CustomerAddress[]>([]);

  const [orders, setOrders] =
    useState<CustomerOrder[]>([]);

  const [activities, setActivities] =
    useState<CustomerActivity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [gender, setGender] =
    useState<
      "female" | "male" | "other" | ""
    >("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [marketingEmails, setMarketingEmails] =
    useState(false);

  const [marketingWhatsapp, setMarketingWhatsapp] =
    useState(false);

  const loadCustomer =
    useCallback(
      async () => {
        setLoading(true);

        try {
          const [
            customerResult,
            addressResult,
            orderResult,
            activityResult,
          ] = await Promise.all([
            getCustomer(userId),
            getCustomerAddresses(
              userId,
            ),
            getCustomerOrders(userId),
            getCustomerActivity(
              userId,
              1,
              20,
            ),
          ]);

          const current =
            customerResult.customer;

          setCustomer(current);
          setAddresses(
            addressResult.addresses || [],
          );
          setOrders(
            orderResult.orders || [],
          );
          setActivities(
            activityResult.activities ||
              [],
          );

          setName(
            current.name || "",
          );

          setPhone(
            current.phone || "",
          );

          setGender(
            current.gender || "",
          );

          setDateOfBirth(
            current.dateOfBirth
              ? current.dateOfBirth.slice(
                  0,
                  10,
                )
              : "",
          );

          setMarketingEmails(
            current.marketingEmails,
          );

          setMarketingWhatsapp(
            current.marketingWhatsapp,
          );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to load customer.",
          );
        } finally {
          setLoading(false);
        }
      },
      [userId],
    );

  useEffect(() => {
    void loadCustomer();
  }, [loadCustomer]);

  async function handleSave() {
    if (!customer) {
      return;
    }

    setSaving(true);

    try {
      const result =
        await updateCustomer(
          userId,
          {
            name,
            phone,
            gender:
              gender === ""
                ? null
                : gender,
            dateOfBirth:
              dateOfBirth
                ? new Date(
                    `${dateOfBirth}T00:00:00.000Z`,
                  ).toISOString()
                : null,
            marketingEmails,
            marketingWhatsapp,
          },
        );

      setCustomer(
        result.customer,
      );

      setEditing(false);

      toast.success(
        "Customer updated successfully.",
      );

      await loadCustomer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(
    status: Customer["status"],
  ) {
    if (!customer) {
      return;
    }

    setSaving(true);

    try {
      const result =
        await updateCustomerStatus(
          userId,
          status,
        );

      setCustomer(
        result.customer,
      );

      toast.success(
        `Customer marked as ${status}.`,
      );

      await loadCustomer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update status.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive() {
    if (!customer) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to archive this customer?",
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      await archiveCustomer(
        userId,
        "Archived from admin panel.",
      );

      toast.success(
        "Customer archived.",
      );

      await loadCustomer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to archive customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore() {
    setSaving(true);

    try {
      await restoreCustomer(
        userId,
      );

      toast.success(
        "Customer restored.",
      );

      await loadCustomer();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to restore customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!customer) {
      return;
    }

    const confirmed =
      window.confirm(
        "This will permanently delete the customer account and addresses. Orders will be retained. Continue?",
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);

    try {
      await deleteCustomer(
        userId,
      );

      toast.success(
        "Customer deleted successfully.",
      );

      window.location.href =
        "/admin/customers";
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete customer.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-xl bg-slate-100 lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-10 text-center">
        <h1 className="text-xl font-semibold">
          Customer not found
        </h1>

        <Link
          href="/admin/customers"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-rose-dark)]"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

        {/* TOP */}

        <div className="mb-6">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-rose-dark)]"
          >
            <ArrowLeft size={16} />
            Back to Customers
          </Link>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-rose-light)] text-lg font-semibold text-[var(--color-rose-dark)]">
                {initials(
                  customer.name ||
                    "Customer",
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-[var(--color-ink)]">
                    {customer.name ||
                      "Unnamed Customer"}
                  </h1>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClass(
                      customer.status,
                    )}`}
                  >
                    {customer.status}
                  </span>

                  {customer.isArchived && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Archived
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-[var(--color-secondary)]">
                  Customer since{" "}
                  {formatDate(
                    customer.createdAt,
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setEditing(
                    (value) => !value,
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-4 text-sm font-medium text-[var(--color-ink)] hover:bg-slate-50 disabled:opacity-50"
              >
                {editing ? (
                  <X size={16} />
                ) : (
                  <Edit3 size={16} />
                )}

                {editing
                  ? "Cancel"
                  : "Edit"}
              </button>

              <select
                disabled={saving}
                value={customer.status}
                onChange={(event) =>
                  void handleStatusChange(
                    event.target.value as Customer["status"],
                  )
                }
                className="h-10 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-medium text-[var(--color-ink)] outline-none"
              >
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
                <option value="suspended">
                  Suspended
                </option>
                <option value="blocked">
                  Blocked
                </option>
              </select>

              {customer.isArchived ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void handleRestore()
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                >
                  <Check size={16} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void handleArchive()
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                >
                  Archive
                </button>
              )}

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void handleDelete()
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* OVERVIEW CARDS */}

        <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <MetricCard
            title="Orders"
            value={String(
              customer.totalOrders,
            )}
            icon={<Package size={18} />}
          />

          <MetricCard
            title="Total Spent"
            value={formatCurrency(
              customer.totalSpent,
            )}
            icon={
              <span className="font-semibold">
                ₹
              </span>
            }
          />

          <MetricCard
            title="Last Order"
            value={formatDate(
              customer.lastOrderAt,
            )}
            icon={
              <CalendarDays
                size={18}
              />
            }
          />

          <MetricCard
            title="Account"
            value={
              customer.isArchived
                ? "Archived"
                : customer.status
            }
            icon={
              <ShieldCheck
                size={18}
              />
            }
          />

        </div>

        <div className="grid gap-5 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-5 lg:col-span-2">

            {/* BASIC INFO */}

            <SectionCard
              title="Basic Information"
              icon={
                <UserRound
                  size={18}
                />
              }
            >
              {editing ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={name}
                    onChange={setName}
                  />

                  <Field
                    label="Phone"
                    value={phone}
                    onChange={setPhone}
                  />

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Gender
                    </label>

                    <select
                      value={gender}
                      onChange={(event) =>
                        setGender(
                          event.target
                            .value as typeof gender,
                        )
                      }
                      className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-rose-dark)]"
                    >
                      <option value="">
                        Not specified
                      </option>
                      <option value="female">
                        Female
                      </option>
                      <option value="male">
                        Male
                      </option>
                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={
                        dateOfBirth
                      }
                      onChange={(event) =>
                        setDateOfBirth(
                          event.target
                            .value,
                        )
                      }
                      className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-rose-dark)]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={
                            marketingEmails
                          }
                          onChange={(
                            event,
                          ) =>
                            setMarketingEmails(
                              event.target
                                .checked,
                            )
                          }
                        />

                        Email Updates
                      </label>

                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={
                            marketingWhatsapp
                          }
                          onChange={(
                            event,
                          ) =>
                            setMarketingWhatsapp(
                              event.target
                                .checked,
                            )
                          }
                        />

                        WhatsApp Updates
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void handleSave()
                      }
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-ink)] px-5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                    >
                      <Check size={16} />
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <InfoItem
                    label="Full Name"
                    value={
                      customer.name ||
                      "—"
                    }
                  />

                  <InfoItem
                    label="Gender"
                    value={
                      customer.gender
                        ? customer.gender
                        : "Not specified"
                    }
                  />

                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(
                      customer.dateOfBirth,
                    )}
                  />

                  <InfoItem
                    label="Customer Since"
                    value={formatDate(
                      customer.createdAt,
                    )}
                  />
                </div>
              )}
            </SectionCard>

            {/* CONTACT */}

            <SectionCard
              title="Contact Information"
              icon={
                <MessageCircle
                  size={18}
                />
              }
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Email"
                  value={
                    customer.email ||
                    "—"
                  }
                  icon={
                    <Mail
                      size={15}
                    />
                  }
                />

                <InfoItem
                  label="Phone"
                  value={
                    customer.phone ||
                    "—"
                  }
                  icon={
                    <Phone
                      size={15}
                    />
                  }
                />
              </div>
            </SectionCard>

            {/* PREFERENCES */}

            <SectionCard
              title="Preferences"
              icon={
                <UserRound
                  size={18}
                />
              }
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TagGroup
                  title="Preferred Sizes"
                  values={
                    customer.preferredSizes
                  }
                />

                <TagGroup
                  title="Preferred Colors"
                  values={
                    customer.preferredColors
                  }
                />
              </div>
            </SectionCard>

            {/* ADDRESSES */}

            <SectionCard
              title="Addresses"
              icon={
                <MapPin size={18} />
              }
            >
              {addresses.length === 0 ? (
                <EmptyState text="No addresses found." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map(
                    (
                      address,
                      index,
                    ) => (
                      <div
                        key={
                          address._id ||
                          address.id ||
                          index
                        }
                        className="rounded-lg border border-[var(--color-border)] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            Address{" "}
                            {index + 1}
                          </p>

                          {address.isDefault && (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-sm leading-6 text-slate-600">
                          {[
                            `${address.firstName || ""} ${address.lastName || ""}`.trim(),
                            address.addressLine1,
                            address.addressLine2,
                            address.city,
                            address.state,
                            address.postalCode,
                            address.country,
                          ]
                            .filter(Boolean)
                            .join(
                              ", ",
                            )}
                        </p>

                        {address.phone && (
                          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <Phone
                              size={13}
                            />
                            {
                              address.phone
                            }
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </SectionCard>

            {/* ORDERS */}

            <SectionCard
              title="Order History"
              icon={
                <Package size={18} />
              }
            >
              {orders.length === 0 ? (
                <EmptyState text="No orders found." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Order
                        </th>

                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Date
                        </th>

                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Amount
                        </th>

                        <th className="pb-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map(
                        (
                          order,
                          index,
                        ) => (
                          <tr
                            key={
                              order.orderNumber ||
                              index
                            }
                            className="border-b border-[var(--color-border)] last:border-0"
                          >
                            <td className="py-3 text-sm font-medium text-[var(--color-ink)]">
                              #
                              {
                                order.orderNumber
                              }
                            </td>

                            <td className="py-3 text-sm text-slate-500">
                              {formatDate(
                                order.createdAt,
                              )}
                            </td>

                            <td className="py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                                {
                                  order.status ||
                                  "—"
                                }
                              </span>
                            </td>

                            <td className="py-3 text-right text-sm font-medium text-[var(--color-ink)]">
                              {formatCurrency(
                                order.grandTotal ??
                                  order.total ??
                                  0,
                              )}
                            </td>

                            <td className="py-3 text-right">
                              <Link
                                href={`/admin/orders/${order.orderNumber}`}
                                className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--color-border)] px-2.5 text-xs font-medium hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
                              >
                                View
                                <ChevronRight
                                  size={14}
                                />
                              </Link>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>

          </div>

          {/* RIGHT */}

          <div className="space-y-5">

            <SectionCard
              title="Account Status"
              icon={
                <ShieldCheck
                  size={18}
                />
              }
            >
              <div className="space-y-4">
                <InfoItem
                  label="Current Status"
                  value={
                    customer.status
                  }
                />

                <InfoItem
                  label="Archived"
                  value={
                    customer.isArchived
                      ? "Yes"
                      : "No"
                  }
                />

                {customer.archivedAt && (
                  <InfoItem
                    label="Archived At"
                    value={formatDateTime(
                      customer.archivedAt,
                    )}
                  />
                )}

                {customer.archiveReason && (
                  <InfoItem
                    label="Archive Reason"
                    value={
                      customer.archiveReason
                    }
                  />
                )}
              </div>
            </SectionCard>

            <SectionCard
              title="Marketing Preferences"
              icon={
                <Mail size={18} />
              }
            >
              <div className="space-y-3">
                <PreferenceRow
                  label="Email Updates"
                  enabled={
                    customer.marketingEmails
                  }
                />

                <PreferenceRow
                  label="WhatsApp Updates"
                  enabled={
                    customer.marketingWhatsapp
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Customer Activity"
              icon={
                <CalendarDays
                  size={18}
                />
              }
            >
              {activities.length === 0 ? (
                <EmptyState text="No activity found." />
              ) : (
                <div className="space-y-0">
                  {activities.map(
                    (
                      activity,
                      index,
                    ) => (
                      <div
                        key={
                          activity._id
                        }
                        className="relative flex gap-3 pb-5 last:pb-0"
                      >
                        {index <
                          activities.length -
                            1 && (
                          <div className="absolute left-[7px] top-5 h-full w-px bg-slate-200" />
                        )}

                        <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--color-rose-dark)] bg-white" />

                        <div className="min-w-0">
                          <p className="text-sm font-medium capitalize text-[var(--color-ink)]">
                            {activity.action.replace(
                              /_/g,
                              " ",
                            )}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {
                              activity.description
                            }
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {formatDateTime(
                              activity.createdAt,
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
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

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-rose-light)] text-[var(--color-rose-dark)]">
          {icon}
        </div>

        <h2 className="text-base font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="flex items-center gap-2 text-sm font-medium capitalize text-[var(--color-ink)]">
        {icon}
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-rose-dark)]"
      />
    </div>
  );
}

function TagGroup({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        {title}
      </p>

      {values.length === 0 ? (
        <p className="text-sm text-slate-500">
          Not specified
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map(
            (value) => (
              <span
                key={value}
                className="rounded-full border border-[var(--color-border)] bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {value}
              </span>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function PreferenceRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2.5">
      <span className="text-sm text-[var(--color-ink)]">
        {label}
      </span>

      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          enabled
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {enabled ? (
          <Check size={14} />
        ) : (
          <X size={14} />
        )}
      </span>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}