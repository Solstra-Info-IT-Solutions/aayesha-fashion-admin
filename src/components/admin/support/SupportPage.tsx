"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import SupportHeader from "./SupportHeader";
import SupportStats from "./SupportStats";
import SupportFilters from "./SupportFilters";
import SupportTable from "./SupportTable";
import SupportMobileCard from "./SupportMobileCard";
import SupportPagination from "./SupportPagination";
import SupportTableSkeleton from "./SupportTableSkeleton";
import SupportEmptyState from "./SupportEmptyState";

import {
  deleteSupportTicket,
  getSupportStats,
  getSupportTickets,
} from "@/services/support.service";

import type {
  SupportCategory,
  SupportListParams,
  SupportPriority,
  SupportSort,
  SupportStatus,
  SupportStats as SupportStatsType,
  SupportTicket,
} from "@/types/support";

import { useAdminAuth } from "@/hooks/useAdminAuth";

const DEFAULT_LIMIT = 10;

export default function SupportPage() {
  const { accessToken, isLoading: authLoading } = useAdminAuth();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStatsType | null>(null);

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SupportStatus | "">("");
  const [priority, setPriority] = useState<SupportPriority | "">("");
  const [category, setCategory] = useState<SupportCategory | "">("");
  const [assignedTo, setAssignedTo] = useState("");
  const [sort, setSort] = useState<SupportSort>("newest");

  const hasFilters = useMemo(
    () =>
      Boolean(
        search.trim() ||
          status ||
          priority ||
          category ||
          assignedTo.trim() ||
          sort !== "newest"
      ),
    [search, status, priority, category, assignedTo, sort]
  );

  const loadStats = useCallback(async () => {
    if (!accessToken) return;

    try {
      setStatsLoading(true);

      const data = await getSupportStats(accessToken);
      setStats(data);
    } catch (error) {
      console.error("Failed to load support stats:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load support statistics."
      );
    } finally {
      setStatsLoading(false);
    }
  }, [accessToken]);

  const loadTickets = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const params: SupportListParams = {
        page,
        limit,
        sort,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      if (category) {
        params.category = category;
      }

      if (assignedTo.trim()) {
        params.assignedTo = assignedTo.trim();
      }

      const response = await getSupportTickets(accessToken, params);

      setTickets(response.items);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load support tickets:", error);

      setTickets([]);
      setTotal(0);
      setTotalPages(1);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load support tickets."
      );
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    page,
    limit,
    search,
    status,
    priority,
    category,
    assignedTo,
    sort,
  ]);

  useEffect(() => {
    if (authLoading || !accessToken) return;

    void loadStats();
  }, [authLoading, accessToken, loadStats]);

  useEffect(() => {
    if (authLoading || !accessToken) return;

    void loadTickets();
  }, [authLoading, accessToken, loadTickets]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: SupportStatus | "") => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: SupportPriority | "") => {
    setPriority(value);
    setPage(1);
  };

  const handleCategoryChange = (value: SupportCategory | "") => {
    setCategory(value);
    setPage(1);
  };

  const handleAssignedToChange = (value: string) => {
    setAssignedTo(value);
    setPage(1);
  };

  const handleSortChange = (value: SupportSort) => {
    setSort(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setCategory("");
    setAssignedTo("");
    setSort("newest");
    setPage(1);
  };

  const handleRefresh = async () => {
    await Promise.all([loadStats(), loadTickets()]);
  };

  const handleDelete = async (ticket: SupportTicket) => {
  if (!accessToken) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete ticket ${ticket.ticketNumber}?`
  );

  if (!confirmed) return;

  try {
    setDeletingId(ticket._id);

    await deleteSupportTicket(accessToken, ticket._id);

    toast.success("Support ticket deleted successfully.");

    await Promise.all([loadTickets(), loadStats()]);
  } catch (error) {
    console.error("Failed to delete support ticket:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to delete support ticket."
    );
  } finally {
    setDeletingId(null);
  }
};

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SupportHeader 
        onRefresh={handleRefresh}
        refreshing={loading || statsLoading}
      />

      <SupportStats stats={stats} loading={statsLoading} />

      <SupportFilters
        search={search}
        status={status}
        priority={priority}
        category={category}
        assignedTo={assignedTo}
        sort={sort}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onCategoryChange={handleCategoryChange}
        onAssignedToChange={handleAssignedToChange}
        onSortChange={handleSortChange}
        onReset={handleResetFilters}
      />

      {loading ? (
        <SupportTableSkeleton />
      ) : tickets.length === 0 ? (
        <SupportEmptyState
          hasFilters={hasFilters}
          onReset={hasFilters ? handleResetFilters : undefined}
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <SupportTable
              tickets={tickets}
              onDelete={handleDelete}
            />
          </div>

          <div className="space-y-3 lg:hidden">
            {tickets.map((ticket) => (
              <SupportMobileCard
                key={ticket._id}
                ticket={ticket}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <SupportPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}