"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAdminOrders,
} from "@/services/order.service";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import type {
  AdminOrder,
  OrderListFilters,
  OrderPagination,
} from "@/types/order";

const initialPagination: OrderPagination =
  {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

export function useOrders() {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [
    orders,
    setOrders,
  ] = useState<AdminOrder[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<OrderPagination>(
    initialPagination,
  );

  const [
    filters,
    setFilters,
  ] = useState<OrderListFilters>({
    page: 1,
    limit: 20,
    sort: "newest",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadOrders =
    useCallback(async () => {
      if (
        !isInitialized ||
        !isAuthenticated ||
        !accessToken
      ) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result =
          await getAdminOrders(
            filters,
            accessToken,
          );

        setOrders(
          result.orders ?? [],
        );

        setPagination(
          result.pagination ??
            initialPagination,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load orders.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      accessToken,
      filters,
      isAuthenticated,
      isInitialized,
    ]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  function updateFilters(
    changes: Partial<OrderListFilters>,
  ) {
    setFilters(
      (current) => ({
        ...current,
        ...changes,
        page: 1,
      }),
    );
  }

  function setPage(
    page: number,
  ) {
    setFilters(
      (current) => ({
        ...current,
        page,
      }),
    );
  }

  return {
    orders,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    refresh: loadOrders,
  };
}