import { apiGet } from "@/lib/api";

import {
  getAccessToken,
} from "@/lib/auth-token";

import type {
  DashboardData,
} from "@/types/dashboard";

type DashboardResponse = {
  success: boolean;
  /** The API nests the payload as { dashboard }; older builds returned it flat. */
  data?: { dashboard?: DashboardData } & Partial<DashboardData>;
};

export async function getDashboard(): Promise<DashboardData> {
  const accessToken =
    getAccessToken();

  if (!accessToken) {
    throw new Error(
      "Authentication is required.",
    );
  }

  const response =
    await apiGet<DashboardResponse>(
      "/admin/dashboard",
      accessToken,
    );

  const payload =
    response.data?.dashboard ?? response.data;

  return (
    (payload as DashboardData | undefined) ?? {
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
    }
  );
}