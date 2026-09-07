import {
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api";

import type {
  AdminOrder,
  AdminOrderListResponse,
  AdminOrderResponse,
  OrderListFilters,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

/* =========================================================
   LIST
========================================================= */

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

/* =========================================================
   DETAILS
========================================================= */

export async function getAdminOrder(
  orderNumber: string,
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiGet<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}`,
      accessToken,
    );

  return response.data.order;
}

/* =========================================================
   STATUS
========================================================= */

export async function updateOrderStatus(
  orderNumber: string,
  input: {
    status: OrderStatus;
    note?: string;
  },
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiPatch<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}/status`,
      input,
      accessToken,
    );

  return response.data.order;
}

/* =========================================================
   PAYMENT
========================================================= */

export async function updateOrderPayment(
  orderNumber: string,
  input: {
    paymentStatus: PaymentStatus;
    paymentId?: string;
    paymentSource?: string;
    note?: string;
  },
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiPatch<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}/payment`,
      input,
      accessToken,
    );

  return response.data.order;
}

/* =========================================================
   SHIPPING
========================================================= */

export async function updateOrderShipping(
  orderNumber: string,
  input: {
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    note?: string;
  },
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiPatch<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}/shipping`,
      input,
      accessToken,
    );

  return response.data.order;
}

/* =========================================================
   NOTES
========================================================= */

export async function updateOrderNotes(
  orderNumber: string,
  adminNotes: string,
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiPatch<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}/notes`,
      {
        adminNotes,
      },
      accessToken,
    );

  return response.data.order;
}

/* =========================================================
   CANCEL
========================================================= */

export async function cancelOrder(
  orderNumber: string,
  reason: string,
  accessToken: string,
): Promise<AdminOrder> {
  const response =
    await apiPost<
      ApiResponse<AdminOrderResponse>
    >(
      `/admin/orders/${encodeURIComponent(
        orderNumber,
      )}/cancel`,
      {
        reason,
      },
      accessToken,
    );

  return response.data.order;
}