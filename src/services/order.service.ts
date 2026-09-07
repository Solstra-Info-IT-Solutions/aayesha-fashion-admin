import {
  apiGet,
} from "@/lib/api";

import type {
  AdminOrderListResponse,
  OrderListFilters,
} from "@/types/order";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getAdminOrders(
  filters: OrderListFilters,
  accessToken: string,
): Promise<AdminOrderListResponse> {
  const params =
    new URLSearchParams();

  params.set(
    "page",
    String(filters.page),
  );

  params.set(
    "limit",
    String(filters.limit),
  );

  if (filters.search) {
    params.set(
      "search",
      filters.search,
    );
  }

  if (filters.status) {
    params.set(
      "status",
      filters.status,
    );
  }

  if (filters.paymentStatus) {
    params.set(
      "paymentStatus",
      filters.paymentStatus,
    );
  }

  if (filters.paymentMethod) {
    params.set(
      "paymentMethod",
      filters.paymentMethod,
    );
  }

  if (filters.customerEmail) {
    params.set(
      "customerEmail",
      filters.customerEmail,
    );
  }

  if (filters.customerPhone) {
    params.set(
      "customerPhone",
      filters.customerPhone,
    );
  }

  if (filters.sort) {
    params.set(
      "sort",
      filters.sort,
    );
  }

  const response =
    await apiGet<
      ApiResponse<AdminOrderListResponse>
    >(
      `/admin/orders?${params.toString()}`,
      accessToken,
    );

  return response.data;
}