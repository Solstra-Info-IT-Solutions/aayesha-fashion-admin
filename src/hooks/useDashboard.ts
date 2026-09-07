"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDashboard,
} from "@/services/dashboard.service";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import type {
  DashboardData,
} from "@/types/dashboard";

const emptyDashboard: DashboardData =
  {
    summary: {
      revenue: 0,
      orders: 0,
      customers: 0,
      products: 0,
    },
    revenue: [],
    orderStatus: [],
    recentOrders: [],
    lowStockProducts: [],
    topProducts: [],
  };

export function useDashboard() {
  const {
    accessToken,
  } = useAdminAuth();

  const [data, setData] =
    useState<DashboardData>(
      emptyDashboard,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | undefined>();

  const loadDashboard =
    useCallback(
      async () => {
        if (!accessToken) {
          return;
        }

        setLoading(true);
        setError(undefined);

        try {
          const result =
            await getDashboard(
              accessToken,
            );

          setData({
            ...emptyDashboard,
            ...result,

            summary: {
              ...emptyDashboard.summary,
              ...(result.summary ||
                {}),
            },
          });
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard.",
          );
        } finally {
          setLoading(false);
        }
      },
      [accessToken],
    );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    ...data,
    loading,
    error,
    onRefresh:
      loadDashboard,
  };
}