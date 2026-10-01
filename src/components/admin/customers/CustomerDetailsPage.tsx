"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";

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
  const result = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() || "",
    )
    .join("");

  return result || "CU";
}

function statusClass(
  status: Customer["status"],
) {
  switch (status) {
    case "active":
      return "bg-[#e8f5ec] text-[#276541] border-[#bfe3cb]";

    case "inactive":
      return "bg-[#efe8d8] text-[#5f584d] border-[#d6ccb6]";

    case "suspended":
      return "bg-[#fdf3e1] text-[#7f4806] border-[#f6d08a]";

    case "blocked":
      return "bg-[#fdecec] text-[#8f1f19] border-[#f5c2c0]";

    default:
      return "bg-[#efe8d8] text-[#5f584d] border-[#d6ccb6]";
  }
}

export default function CustomerDetailsPage({
  userId,
}: Props) {
  const router = useRouter();
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

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

  const [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);

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
        if (
          !isInitialized ||
          !isAuthenticated ||
          !accessToken
        ) {
          return;
        }

        setLoading(true);

        try {
          const [
            customerResult,
            addressResult,
            orderResult,
            activityResult,
          ] = await Promise.all([
            getCustomer(
              accessToken,
              userId,
            ),

            getCustomerAddresses(
              accessToken,
              userId,
            ),

            getCustomerOrders(
              accessToken,
              userId,
            ),

            getCustomerActivity(
              accessToken,
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
      [
        accessToken,
        isAuthenticated,
        isInitialized,
        userId,
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

    void Promise.resolve().then(loadCustomer);
  }, [
    isInitialized,
    isAuthenticated,
    accessToken,
    loadCustomer,
  ]);

  async function handleSave() {
    if (
      !customer ||
      !accessToken
    ) {
      return;
    }

    setSaving(true);

    try {
      const result =
        await updateCustomer(
          accessToken,
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
    if (
      !customer ||
      !accessToken
    ) {
      return;
    }

    setSaving(true);

    try {
      const result =
        await updateCustomerStatus(
          accessToken,
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
    if (
      !customer ||
      !accessToken
    ) {
      return;
    }

    setConfirm(null);

    setSaving(true);

    try {
      await archiveCustomer(
        accessToken,
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
    if (!accessToken) {
      return;
    }

    setSaving(true);

    try {
      await restoreCustomer(
        accessToken,
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
    if (
      !customer ||
      !accessToken
    ) {
      return;
    }

    setConfirm(null);

    setConfirm(null);
    setSaving(true);

    try {
      await deleteCustomer(
        accessToken,
        userId,
      );

      toast.success(
        "Customer deleted successfully.",
      );

      router.replace("/admin/customers");
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

  if (
    !isInitialized ||
    !isAuthenticated ||
    !accessToken ||
    loading
  ) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-[#efe8d8]" />

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-[14px] bg-[#efe8d8] lg:col-span-2" />

          <div className="h-72 animate-pulse rounded-[14px] bg-[#efe8d8]" />
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

        <SmartBackLink
          href="/admin/customers"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#6f542f]"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </SmartBackLink>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <ConfirmDialog
        open={confirm !== null}
        title={confirm === "delete" ? "Delete this customer?" : "Archive this customer?"}
        description={
          confirm === "delete"
            ? "This permanently deletes the customer account and addresses. Their orders are retained."
            : "The customer will be hidden from the default list. You can restore them later."
        }
        confirmLabel={confirm === "delete" ? "Delete customer" : "Archive"}
        tone={confirm === "delete" ? "danger" : "default"}
        busy={saving}
        onConfirm={() => void (confirm === "delete" ? handleDelete() : handleArchive())}
        onCancel={() => setConfirm(null)}
      />
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">

        {/* TOP */}

        <div className="mb-6">
          <SmartBackLink
            href="/admin/customers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5f584d] hover:text-[#6f542f]"
          >
            <ArrowLeft size={16} />
            Back to Customers
          </SmartBackLink>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f1ead9] text-lg font-semibold text-[#6f542f]">
                {initials(
                  customer.name ||
                    "Customer",
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-[#2a2520]">
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
                    <span className="rounded-full border border-[#d6ccb6] bg-[#efe8d8] px-2.5 py-1 text-xs font-medium text-[#5f584d]">
                      Archived
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-[#5f584d]">
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
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-4 text-sm font-medium text-[#2a2520] hover:bg-[#f7f2e7] disabled:opacity-50"
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
                    event.target
                      .value as Customer["status"],
                  )
                }
                className="h-10 rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm font-medium text-[#2a2520] outline-none"
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
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#bfe3cb] bg-[#e8f5ec] px-4 text-sm font-medium text-[#276541] hover:bg-[#d7eede] disabled:opacity-50"
                >
                  <Check size={16} />
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    setConfirm("archive")
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#f6d08a] bg-[#fdf3e1] px-4 text-sm font-medium text-[#7f4806] hover:bg-[#fbe8c4] disabled:opacity-50"
                >
                  Archive
                </button>
              )}

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  setConfirm("delete")
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#f5c2c0] bg-[#fdecec] px-4 text-sm font-medium text-[#8f1f19] hover:bg-[#f9d9d8] disabled:opacity-50"
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
                    <label className="mb-1.5 block text-xs font-medium text-[#756d62]">
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
                      className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm outline-none focus:border-[#b08d57]"
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
                    <label className="mb-1.5 block text-xs font-medium text-[#756d62]">
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
                      className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm outline-none focus:border-[#b08d57]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e6dfcf] px-3 py-2 text-sm">
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

                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e6dfcf] px-3 py-2 text-sm">
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
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#26221d] px-5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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
                        className="rounded-lg border border-[#e6dfcf] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#2a2520]">
                            Address{" "}
                            {index + 1}
                          </p>

                          {address.isDefault && (
                            <span className="rounded-full bg-[#e8f5ec] px-2 py-1 text-[11px] font-medium text-[#276541]">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="text-sm leading-6 text-[#5f584d]">
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
                          <p className="mt-3 flex items-center gap-2 text-xs text-[#756d62]">
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
                      <tr className="border-b border-[#e6dfcf]">
                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756d62]">
                          Order
                        </th>

                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756d62]">
                          Date
                        </th>

                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-[#756d62]">
                          Status
                        </th>

                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-[#756d62]">
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
                            className="border-b border-[#e6dfcf] last:border-0"
                          >
                            <td className="py-3 text-sm font-medium text-[#2a2520]">
                              #
                              {
                                order.orderNumber
                              }
                            </td>

                            <td className="py-3 text-sm text-[#756d62]">
                              {formatDate(
                                order.createdAt,
                              )}
                            </td>

                            <td className="py-3">
                              <span className="rounded-full bg-[#efe8d8] px-2.5 py-1 text-xs font-medium capitalize text-[#5f584d]">
                                {
                                  order.status ||
                                  "—"
                                }
                              </span>
                            </td>

                            <td className="py-3 text-right text-sm font-medium text-[#2a2520]">
                              {formatCurrency(
                                order.grandTotal ??
                                  order.total ??
                                  0,
                              )}
                            </td>

                            <td className="py-3 text-right">
                              <Link
                                href={`/admin/orders/${order.orderNumber}`}
                                className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e6dfcf] px-2.5 text-xs font-medium hover:border-[#b08d57] hover:text-[#6f542f]"
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
                          <div className="absolute left-[7px] top-5 h-full w-px bg-[#e6dfcf]" />
                        )}

                        <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-[#b08d57] bg-[#fffdf8]" />

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#2a2520] [&:not(:has(a))]:first-letter:uppercase">
                            {activity.action.replace(
                              /_/g,
                              " ",
                            )}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-[#756d62]">
                            {
                              activity.description
                            }
                          </p>

                          <p className="mt-1 text-[11px] text-[#756d62]">
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
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#756d62]">
            {title}
          </p>

          <p className="display mt-2 text-2xl font-semibold text-[#2a2520]">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1ead9] text-[#6f542f]">
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
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="surface p-5">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1ead9] text-[#6f542f]">
          {icon}
        </div>

        <h2 className="display text-xl font-semibold text-[#2a2520]">
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
  icon?: ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#756d62]">
        {label}
      </p>

      <p className="flex items-center gap-2 text-sm font-medium text-[#2a2520] [&:not(:has(a))]:first-letter:uppercase">
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
      <label className="mb-1.5 block text-xs font-medium text-[#756d62]">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm outline-none focus:border-[#b08d57]"
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
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#756d62]">
        {title}
      </p>

      {values.length === 0 ? (
        <p className="text-sm text-[#756d62]">
          Not specified
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map(
            (value) => (
              <span
                key={value}
                className="rounded-full border border-[#e6dfcf] bg-[#f7f2e7] px-2.5 py-1 text-xs font-medium text-[#5f584d]"
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
    <div className="flex items-center justify-between rounded-lg border border-[#e6dfcf] px-3 py-2.5">
      <span className="text-sm text-[#2a2520]">
        {label}
      </span>

      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          enabled
            ? "bg-[#e8f5ec] text-emerald-600"
            : "bg-[#efe8d8] text-[#756d62]"
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
    <div className="rounded-lg border border-dashed border-[#e6dfcf] px-4 py-8 text-center text-sm text-[#756d62]">
      {text}
    </div>
  );
}