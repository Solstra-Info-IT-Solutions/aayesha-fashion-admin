"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  getInventory,
  getInventorySummary,
} from "@/services/inventory.service";

import type {
  InventoryItem,
  InventoryPagination,
  InventoryQuery,
  InventorySummary,
} from "@/types/inventory";

export function useInventory(query: InventoryQuery) {
  const {
    isAuthenticated,
    isLoading: authLoading,
  } = useAdminAuth();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] =
    useState<InventoryPagination | null>(null);

  const [summary, setSummary] =
    useState<InventorySummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] =
    useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const fetchInventory = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getInventory(query);

      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load inventory.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    query.page,
    query.limit,
    query.search,
    query.status,
    query.sort,
  ]);

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setSummaryLoading(true);

    try {
      const response =
        await getInventorySummary();

      setSummary(response.data);
    } catch (err) {
      console.error(
        "Inventory summary error:",
        err,
      );
    } finally {
      setSummaryLoading(false);
    }
  }, [isAuthenticated]);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchInventory(),
      fetchSummary(),
    ]);
  }, [fetchInventory, fetchSummary]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    void fetchInventory();
  }, [
    authLoading,
    isAuthenticated,
    fetchInventory,
  ]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    void fetchSummary();
  }, [
    authLoading,
    isAuthenticated,
    fetchSummary,
  ]);

  return {
    items,
    pagination,
    summary,
    loading: authLoading || loading,
    summaryLoading,
    error,
    refresh,
  };
}