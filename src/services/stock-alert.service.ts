import { apiGet } from "@/lib/api";

export type StockAlertDemand = {
  productId: string;
  productName: string;
  image: string;
  /** Currently available units. */
  stock: number;
  /** Customers still waiting to be told it is back. */
  waiting: number;
  /** Customers already notified after a restock. */
  notified: number;
  latestRequestAt: string;
  emails: string[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { message?: string };
};

export async function getStockAlertDemand(
  accessToken: string,
): Promise<StockAlertDemand[]> {
  const response = await apiGet<ApiResponse<StockAlertDemand[]>>(
    "/admin/stock-alerts",
    accessToken,
  );

  if (!response.success) {
    throw new Error(response.error?.message || "Unable to load stock alerts.");
  }

  return response.data;
}
