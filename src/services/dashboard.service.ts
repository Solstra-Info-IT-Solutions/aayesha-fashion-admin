import {
  apiGet,
} from "@/lib/api";

import type {
  DashboardData,
} from "@/types/dashboard";

type DashboardResponse = {
  success: boolean;
  data?: DashboardData;
};

export async function getDashboard(
  accessToken: string,
): Promise<DashboardData> {
  const response =
    await apiGet<DashboardResponse>(
      "/admin/dashboard",
      accessToken,
    );

  return (
    response.data || {
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