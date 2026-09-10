"use client";

import {
  Archive,
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";

import {
  MARKETING_CAMPAIGN_SORTS,
  MARKETING_CAMPAIGN_STATUSES,
  MARKETING_CAMPAIGN_TYPES,
  type MarketingCampaignSort,
  type MarketingCampaignStatus,
  type MarketingCampaignType,
} from "@/types/marketing";

type MarketingFiltersProps = {
  search: string;
  type: MarketingCampaignType | "";
  status: MarketingCampaignStatus | "";
  sort: MarketingCampaignSort;
  includeArchived: boolean;

  onSearchChange: (value: string) => void;
  onTypeChange: (value: MarketingCampaignType | "") => void;
  onStatusChange: (value: MarketingCampaignStatus | "") => void;
  onSortChange: (value: MarketingCampaignSort) => void;
  onIncludeArchivedChange: (value: boolean) => void;
  onClear: () => void;
};

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function MarketingFilters({
  search,
  type,
  status,
  sort,
  includeArchived,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onSortChange,
  onIncludeArchivedChange,
  onClear,
}: MarketingFiltersProps) {
  const hasFilters =
    search.trim() !== "" ||
    type !== "" ||
    status !== "" ||
    sort !== "newest" ||
    includeArchived;

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search campaigns..."
            className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white pl-10 pr-10 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-gray-400 focus:border-[var(--color-rose-dark)]"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] transition hover:text-[var(--color-ink)]"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Type */}
        <select
          value={type}
          onChange={(event) =>
            onTypeChange(
              event.target.value as MarketingCampaignType | "",
            )
          }
          className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
        >
          <option value="">All Types</option>

          {MARKETING_CAMPAIGN_TYPES.map((item) => (
            <option key={item} value={item}>
              {formatLabel(item)}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as MarketingCampaignStatus | "",
            )
          }
          className="h-11 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
        >
          <option value="">All Statuses</option>

          {MARKETING_CAMPAIGN_STATUSES.map((item) => (
            <option key={item} value={item}>
              {formatLabel(item)}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
          />

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value as MarketingCampaignSort,
              )
            }
            className="h-11 rounded-lg border border-[var(--color-border)] bg-white pl-9 pr-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-rose-dark)]"
          >
            {MARKETING_CAMPAIGN_SORTS.map((item) => (
              <option key={item} value={item}>
                {formatLabel(item)}
              </option>
            ))}
          </select>
        </div>

        {/* Include Archived */}
        <label className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-sm text-[var(--color-ink)]">
          <input
            type="checkbox"
            checked={includeArchived}
            onChange={(event) =>
              onIncludeArchivedChange(event.target.checked)
            }
            className="h-4 w-4 accent-[var(--color-rose-dark)]"
          />

          <Archive size={15} />

          <span>Archived</span>
        </label>

        {/* Clear */}
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-secondary)] transition hover:border-[var(--color-rose-dark)] hover:text-[var(--color-rose-dark)]"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </section>
  );
}