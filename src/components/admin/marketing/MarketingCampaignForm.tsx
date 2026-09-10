"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/store/admin-auth.store";

import {
  createMarketingCampaign,
  getMarketingCampaign,
  updateMarketingCampaign,
} from "@/services/marketing.service";

import {
  MARKETING_CAMPAIGN_STATUSES,
  MARKETING_CAMPAIGN_TYPES,
  type MarketingCampaign,
  type MarketingCampaignCreateInput,
  type MarketingCampaignStatus,
  type MarketingCampaignType,
} from "@/types/marketing";

type MarketingCampaignFormProps = {
  mode?: "create" | "edit";
  campaign?: MarketingCampaign;
  campaignId?: string;
};

type FormState = {
  name: string;
  description: string;
  type: MarketingCampaignType;
  status: MarketingCampaignStatus;
  budget: string;
  startsAt: string;
  endsAt: string;
};

const DEFAULT_FORM: FormState = {
  name: "",
  description: "",
  type: "homepage",
  status: "draft",
  budget: "0",
  startsAt: "",
  endsAt: "",
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function toISOString(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

function campaignToForm(
  campaign: MarketingCampaign,
): FormState {
  return {
    name: campaign.name ?? "",
    description: campaign.description ?? "",
    type: campaign.type,
    status: campaign.status,
    budget: String(campaign.budget ?? 0),
    startsAt: toDateTimeLocal(campaign.startsAt),
    endsAt: toDateTimeLocal(campaign.endsAt),
  };
}

export default function MarketingCampaignForm({
  mode = "create",
  campaign,
  campaignId,
}: MarketingCampaignFormProps) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [form, setForm] =
    useState<FormState>(DEFAULT_FORM);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [submitting, setSubmitting] =
    useState(false);

  const [loadingCampaign, setLoadingCampaign] =
    useState(mode === "edit");

  const [loadedCampaign, setLoadedCampaign] =
    useState<MarketingCampaign | null>(
      campaign ?? null,
    );

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const isEdit = mode === "edit";

  /*
   * Load campaign for edit mode.
   *
   * Priority:
   * 1. campaign prop if already provided
   * 2. campaignId from route
   */
  useEffect(() => {
    if (!isEdit) {
      setLoadingCampaign(false);
      return;
    }

    if (campaign) {
      setLoadedCampaign(campaign);
      setForm(campaignToForm(campaign));
      setLoadingCampaign(false);
      return;
    }

    if (!campaignId) {
      setLoadingCampaign(false);
      setLoadError("Campaign ID is missing.");
      return;
    }

    if (!isInitialized) {
      return;
    }

    if (!accessToken || !isAuthenticated) {
      setLoadingCampaign(false);
      return;
    }

    let cancelled = false;

    const loadCampaign = async () => {
      try {
        setLoadingCampaign(true);
        setLoadError(null);

        const response =
          await getMarketingCampaign(
            accessToken,
            campaignId,
          );

        if (cancelled) {
          return;
        }

        setLoadedCampaign(response);
        setForm(campaignToForm(response));
      } catch (error) {
        console.error(
          "Failed to load marketing campaign:",
          error,
        );

        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load campaign.";

        setLoadError(message);
        toast.error(message);
      } finally {
        if (!cancelled) {
          setLoadingCampaign(false);
        }
      }
    };

    void loadCampaign();

    return () => {
      cancelled = true;
    };
  }, [
    isEdit,
    campaign,
    campaignId,
    accessToken,
    isAuthenticated,
    isInitialized,
  ]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: Partial<
      Record<keyof FormState, string>
    > = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Campaign name is required.";
    } else if (form.name.trim().length > 120) {
      nextErrors.name =
        "Campaign name cannot exceed 120 characters.";
    }

    if (form.description.length > 500) {
      nextErrors.description =
        "Description cannot exceed 500 characters.";
    }

    if (!form.startsAt) {
      nextErrors.startsAt =
        "Start date is required.";
    } else {
      const start = new Date(form.startsAt);

      if (Number.isNaN(start.getTime())) {
        nextErrors.startsAt =
          "Start date must be valid.";
      }
    }

    const budget = Number(form.budget);

    if (
      form.budget.trim() === "" ||
      Number.isNaN(budget) ||
      budget < 0
    ) {
      nextErrors.budget =
        "Budget must be a valid non-negative number.";
    }

    if (form.endsAt) {
      const start = new Date(form.startsAt);
      const end = new Date(form.endsAt);

      if (
        !Number.isNaN(start.getTime()) &&
        !Number.isNaN(end.getTime()) &&
        end <= start
      ) {
        nextErrors.endsAt =
          "End date must be after start date.";
      }
    }

    const startsAt = toISOString(form.startsAt);

    if (form.startsAt && !startsAt) {
      nextErrors.startsAt =
        "Start date must be valid.";
    }

    if (form.endsAt) {
      const endsAt = toISOString(form.endsAt);

      if (!endsAt) {
        nextErrors.endsAt =
          "End date must be valid.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      toast.error(
        "Please fix the highlighted fields.",
      );
      return;
    }

    if (!accessToken || !isAuthenticated) {
      toast.error("Authentication required.");
      return;
    }

    if (isEdit && !loadedCampaign) {
      toast.error(
        "Campaign details are not loaded yet.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const startsAt = toISOString(
        form.startsAt,
      );

      const endsAt = form.endsAt
        ? toISOString(form.endsAt)
        : "";

      const input: MarketingCampaignCreateInput = {
        name: form.name.trim(),
        description:
          form.description.trim() || undefined,
        type: form.type,
        status: form.status,
        budget: Number(form.budget),
        startsAt,
        endsAt: endsAt || null,
      };

      if (isEdit && loadedCampaign) {
        await updateMarketingCampaign(
          accessToken,
          loadedCampaign._id,
          input,
        );

        toast.success(
          "Campaign updated successfully.",
        );

        window.location.href = `/admin/marketing/${loadedCampaign._id}`;

        return;
      }

      const created =
        await createMarketingCampaign(
          accessToken,
          input,
        );

      toast.success(
        "Campaign created successfully.",
      );

      window.location.href = `/admin/marketing/${created._id}`;
    } catch (error) {
      console.error(
        "Failed to save marketing campaign:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save campaign.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-56 rounded bg-gray-100" />
          <div className="h-[600px] rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  if (isEdit && loadingCampaign) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/admin/marketing"
              className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-secondary)] transition hover:text-[var(--color-rose-dark)]"
            >
              <ArrowLeft size={16} />
              Back to Marketing
            </Link>

            <div className="h-8 w-64 animate-pulse rounded bg-gray-100" />

            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-white">
            <div className="space-y-6 p-5 sm:p-7">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-28 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] p-5 sm:p-7">
              <div className="flex justify-end gap-3">
                <div className="h-11 w-24 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-11 w-40 animate-pulse rounded-lg bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isEdit && loadError) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/admin/marketing"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-secondary)] transition hover:text-[var(--color-rose-dark)]"
          >
            <ArrowLeft size={16} />
            Back to Marketing
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load campaign
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {loadError}
            </p>

            <Link
              href="/admin/marketing"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-rose-dark)] px-5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Back to Campaigns
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/marketing"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-secondary)] transition hover:text-[var(--color-rose-dark)]"
          >
            <ArrowLeft size={16} />
            Back to Marketing
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            {isEdit
              ? "Edit Campaign"
              : "Create Campaign"}
          </h1>

          <p className="mt-1 text-sm text-[var(--color-secondary)]">
            {isEdit
              ? "Update the campaign details below."
              : "Create a new marketing campaign."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--color-border)] bg-white"
        >
          <div className="space-y-6 p-5 sm:p-7">
            {/* Campaign Name */}
            <div>
              <label
                htmlFor="campaign-name"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                Campaign Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="campaign-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="e.g. Festive Season Sale"
                maxLength={120}
                className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition ${
                  errors.name
                    ? "border-red-500"
                    : "border-[var(--color-border)] focus:border-[var(--color-rose-dark)]"
                }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="campaign-description"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                Description
              </label>

              <textarea
                id="campaign-description"
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Describe the purpose of this campaign..."
                rows={4}
                maxLength={500}
                className={`w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm text-[var(--color-ink)] outline-none transition ${
                  errors.description
                    ? "border-red-500"
                    : "border-[var(--color-border)] focus:border-[var(--color-rose-dark)]"
                }`}
              />

              <div className="mt-1 flex justify-between">
                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}

                <span className="text-xs text-gray-400">
                  {form.description.length}/500
                </span>
              </div>
            </div>

            {/* Type + Status */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Type */}
              <div>
                <label
                  htmlFor="campaign-type"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  Campaign Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  id="campaign-type"
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      "type",
                      event.target
                        .value as MarketingCampaignType,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
                >
                  {MARKETING_CAMPAIGN_TYPES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatLabel(item)}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="campaign-status"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  Status
                </label>

                <select
                  id="campaign-status"
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target
                        .value as MarketingCampaignStatus,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-rose-dark)]"
                >
                  {MARKETING_CAMPAIGN_STATUSES.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {formatLabel(item)}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="campaign-budget"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                Budget
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-secondary)]">
                  ₹
                </span>

                <input
                  id="campaign-budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={(event) =>
                    updateField(
                      "budget",
                      event.target.value,
                    )
                  }
                  placeholder="0"
                  className={`h-11 w-full rounded-lg border bg-white pl-8 pr-3 text-sm text-[var(--color-ink)] outline-none transition ${
                    errors.budget
                      ? "border-red-500"
                      : "border-[var(--color-border)] focus:border-[var(--color-rose-dark)]"
                  }`}
                />
              </div>

              {errors.budget && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.budget}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Start */}
              <div>
                <label
                  htmlFor="campaign-start"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  Start Date & Time
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="campaign-start"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) =>
                    updateField(
                      "startsAt",
                      event.target.value,
                    )
                  }
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition ${
                    errors.startsAt
                      ? "border-red-500"
                      : "border-[var(--color-border)] focus:border-[var(--color-rose-dark)]"
                  }`}
                />

                {errors.startsAt && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.startsAt}
                  </p>
                )}
              </div>

              {/* End */}
              <div>
                <label
                  htmlFor="campaign-end"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  End Date & Time
                </label>

                <input
                  id="campaign-end"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) =>
                    updateField(
                      "endsAt",
                      event.target.value,
                    )
                  }
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition ${
                    errors.endsAt
                      ? "border-red-500"
                      : "border-[var(--color-border)] focus:border-[var(--color-rose-dark)]"
                  }`}
                />

                {errors.endsAt && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.endsAt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-end sm:p-7">
            <Link
              href={
                isEdit && loadedCampaign
                  ? `/admin/marketing/${loadedCampaign._id}`
                  : "/admin/marketing"
              }
              className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[var(--color-rose-dark)] px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {submitting
                ? "Saving..."
                : isEdit
                  ? "Update Campaign"
                  : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}