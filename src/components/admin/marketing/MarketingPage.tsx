"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAdminAuth } from "@/store/auth.store";

import {
  archiveMarketingCampaign,
  deleteMarketingCampaign,
  getMarketingCampaigns,
  getMarketingStats,
  restoreMarketingCampaign,
} from "@/services/marketing.service";

import type {
  MarketingCampaign,
  MarketingCampaignSort,
  MarketingCampaignStatus,
  MarketingCampaignStats,
  MarketingCampaignType,
} from "@/types/marketing";

import MarketingHeader from "./MarketingHeader";
import MarketingStats from "./MarketingStats";
import MarketingFilters from "./MarketingFilters";
import MarketingCampaignTable from "./MarketingCampaignTable";
import MarketingCampaignMobileCard from "./MarketingCampaignMobileCard";
import MarketingPagination from "./MarketingPagination";
import MarketingTableSkeleton from "./MarketingTableSkeleton";
import MarketingEmptyState from "./MarketingEmptyState";

const DEFAULT_LIMIT = 10;

export default function MarketingPage() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  // ─────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────

  const [stats, setStats] =
    useState<MarketingCampaignStats | null>(null);

  const [campaigns, setCampaigns] = useState<
    MarketingCampaign[]
  >([]);

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loadingStats, setLoadingStats] = useState(true);

  const [loadingCampaigns, setLoadingCampaigns] =
    useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [type, setType] = useState<
    MarketingCampaignType | ""
  >("");

  const [status, setStatus] = useState<
    MarketingCampaignStatus | ""
  >("");

  const [sort, setSort] =
    useState<MarketingCampaignSort>("newest");

  const [includeArchived, setIncludeArchived] =
    useState(false);

  // ─────────────────────────────────────────────
  // Load Stats
  // ─────────────────────────────────────────────

  const loadStats = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoadingStats(true);

      const data =
        await getMarketingStats(accessToken);

      setStats(data);
    } catch (error) {
      console.error(
        "Failed to load marketing stats:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load marketing stats.",
      );
    } finally {
      setLoadingStats(false);
    }
  }, [accessToken]);

  // ─────────────────────────────────────────────
  // Load Campaigns
  // ─────────────────────────────────────────────

  const loadCampaigns = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoadingCampaigns(true);

      const response =
        await getMarketingCampaigns(
          accessToken,
          {
            page,
            limit: DEFAULT_LIMIT,
            search: search.trim() || undefined,
            type: type || undefined,
            status: status || undefined,
            sort,
            includeArchived,
          },
        );

      setCampaigns(response.campaigns);

      setTotal(response.pagination.total);

      setTotalPages(
        response.pagination.totalPages,
      );
    } catch (error) {
      console.error(
        "Failed to load marketing campaigns:",
        error,
      );

      setCampaigns([]);
      setTotal(0);
      setTotalPages(0);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load marketing campaigns.",
      );
    } finally {
      setLoadingCampaigns(false);
    }
  }, [
    accessToken,
    page,
    search,
    type,
    status,
    sort,
    includeArchived,
  ]);

  // ─────────────────────────────────────────────
  // Initial Load
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      return;
    }

    loadStats();
  }, [
    isInitialized,
    isAuthenticated,
    loadStats,
  ]);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      return;
    }

    loadCampaigns();
  }, [
    isInitialized,
    isAuthenticated,
    loadCampaigns,
  ]);

  // ─────────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────────

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (
    value: MarketingCampaignType | "",
  ) => {
    setType(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: MarketingCampaignStatus | "",
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (
    value: MarketingCampaignSort,
  ) => {
    setSort(value);
    setPage(1);
  };

  const handleIncludeArchivedChange = (
    value: boolean,
  ) => {
    setIncludeArchived(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setType("");
    setStatus("");
    setSort("newest");
    setIncludeArchived(false);
    setPage(1);
  };

  // ─────────────────────────────────────────────
  // Archive
  // ─────────────────────────────────────────────

  const handleArchive = async (
    campaign: MarketingCampaign,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to archive "${campaign.name}"?`,
    );

    if (!confirmed) return;

    if (!accessToken) {
      toast.error("Authentication required.");
      return;
    }

    try {
      await archiveMarketingCampaign(
        accessToken,
        campaign._id,
      );

      toast.success("Campaign archived successfully.");

      await Promise.all([
        loadCampaigns(),
        loadStats(),
      ]);
    } catch (error) {
      console.error(
        "Failed to archive campaign:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to archive campaign.",
      );
    }
  };

  // ─────────────────────────────────────────────
  // Restore
  // ─────────────────────────────────────────────

  const handleRestore = async (
    campaign: MarketingCampaign,
  ) => {
    if (!accessToken) {
      toast.error("Authentication required.");
      return;
    }

    try {
      await restoreMarketingCampaign(
        accessToken,
        campaign._id,
      );

      toast.success("Campaign restored successfully.");

      await Promise.all([
        loadCampaigns(),
        loadStats(),
      ]);
    } catch (error) {
      console.error(
        "Failed to restore campaign:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to restore campaign.",
      );
    }
  };

  // ─────────────────────────────────────────────
  // Delete
  // ─────────────────────────────────────────────

  const handleDelete = async (
    campaign: MarketingCampaign,
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${campaign.name}"?`,
    );

    if (!confirmed) return;

    if (!accessToken) {
      toast.error("Authentication required.");
      return;
    }

    try {
      await deleteMarketingCampaign(
        accessToken,
        campaign._id,
      );

      toast.success("Campaign deleted successfully.");

      /*
       * If the current page becomes empty after
       * deletion, move back one page.
       */
      if (
        campaigns.length === 1 &&
        page > 1
      ) {
        setPage((currentPage) =>
          Math.max(1, currentPage - 1),
        );
      } else {
        await Promise.all([
          loadCampaigns(),
          loadStats(),
        ]);
      }
    } catch (error) {
      console.error(
        "Failed to delete campaign:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete campaign.",
      );
    }
  };

  // ─────────────────────────────────────────────
  // Refresh
  // ─────────────────────────────────────────────

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.all([
        loadStats(),
        loadCampaigns(),
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  // ─────────────────────────────────────────────
  // Authentication Loading
  // ─────────────────────────────────────────────

  if (!isInitialized) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-20 rounded-xl bg-gray-100" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-32 rounded-xl bg-gray-100"
                  />
                ),
              )}
            </div>

            <div className="h-16 rounded-xl bg-gray-100" />

            <div className="h-96 rounded-xl bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return null;
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  const hasFilters =
    search.trim() !== "" ||
    type !== "" ||
    status !== "" ||
    sort !== "newest" ||
    includeArchived;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <MarketingHeader
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />

          {/* Stats */}
          <MarketingStats
            stats={stats}
            loading={loadingStats}
          />

          {/* Filters */}
          <MarketingFilters
            search={search}
            type={type}
            status={status}
            sort={sort}
            includeArchived={includeArchived}
            onSearchChange={handleSearchChange}
            onTypeChange={handleTypeChange}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
            onIncludeArchivedChange={
              handleIncludeArchivedChange
            }
            onClear={handleClearFilters}
          />

          {/* Campaigns */}
          {loadingCampaigns ? (
            <MarketingTableSkeleton />
          ) : campaigns.length === 0 ? (
            <MarketingEmptyState
              filtered={hasFilters}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <>
              {/* Desktop */}
              <MarketingCampaignTable
                campaigns={campaigns}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDelete}
              />

              {/* Mobile */}
              <div className="space-y-3 md:hidden">
                {campaigns.map((campaign) => (
                  <MarketingCampaignMobileCard
                    key={campaign._id}
                    campaign={campaign}
                    onArchive={handleArchive}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              <MarketingPagination
                page={page}
                totalPages={totalPages}
                total={total}
                limit={DEFAULT_LIMIT}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}