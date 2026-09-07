"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDashboard,
} from "@/services/dashboard.service";

import type {
  DashboardData,
} from "@/types/dashboard";

const emptyDashboard: DashboardData = {
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
  const [data, setData] =
    useState<DashboardData>(
      emptyDashboard,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string>();

  const loadDashboard =
    useCallback(async () => {
      setLoading(true);
      setError(undefined);

      try {
        const result =
          await getDashboard();

        setData({
          ...emptyDashboard,
          ...result,
          summary: {
            ...emptyDashboard.summary,
            ...(result.summary ?? {}),
          },
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    ...data,
    loading,
    error,
    onRefresh: loadDashboard,
  };
}