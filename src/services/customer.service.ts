import { apiFetch } from "@/lib/api";

import type {
  Customer,
  CustomerActivity,
  CustomerAddress,
  CustomerListResponse,
  CustomerOrder,
  CustomerStats,
} from "@/types/customer";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

type ListCustomersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  marketingEmails?: string;
  marketingWhatsapp?: string;
  includeArchived?: boolean;
  sort?: string;
};

function buildQuery(
  params: ListCustomersParams,
) {
  const query = new URLSearchParams();

  if (params.page) {
    query.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit) {
    query.set(
      "limit",
      String(params.limit),
    );
  }

  if (params.search?.trim()) {
    query.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.status) {
    query.set(
      "status",
      params.status,
    );
  }

  if (params.marketingEmails) {
    query.set(
      "marketingEmails",
      params.marketingEmails,
    );
  }

  if (params.marketingWhatsapp) {
    query.set(
      "marketingWhatsapp",
      params.marketingWhatsapp,
    );
  }

  query.set(
    "includeArchived",
    params.includeArchived
      ? "true"
      : "false",
  );

  if (params.sort) {
    query.set(
      "sort",
      params.sort,
    );
  }

  return query.toString();
}

async function unwrap<T>(
  response: ApiResponse<T>,
): Promise<T> {
  if (!response.success) {
    throw new Error(
      response.error?.message ||
        "Something went wrong.",
    );
  }

  return response.data;
}

/* =========================================================
   CUSTOMER LIST
========================================================= */

export async function getCustomers(
  accessToken: string,
  params: ListCustomersParams = {},
): Promise<CustomerListResponse> {
  const query = buildQuery({
    page: 1,
    limit: 20,
    sort: "newest",
    includeArchived: false,
    ...params,
  });

  const response =
    await apiFetch<
      ApiResponse<CustomerListResponse>
    >(
      `/admin/customers?${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CUSTOMER STATS
========================================================= */

export async function getCustomerStats(
  accessToken: string,
): Promise<CustomerStats> {
  const response =
    await apiFetch<
      ApiResponse<CustomerStats>
    >(
      "/admin/customers/stats",
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CUSTOMER DETAILS
========================================================= */

export async function getCustomer(
  accessToken: string,
  userId: string,
): Promise<{
  customer: Customer;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   UPDATE CUSTOMER
========================================================= */

export async function updateCustomer(
  accessToken: string,
  userId: string,
  payload: Partial<
    Pick<
      Customer,
      | "name"
      | "phone"
      | "dateOfBirth"
      | "gender"
      | "preferredSizes"
      | "preferredColors"
      | "marketingEmails"
      | "marketingWhatsapp"
    >
  >,
): Promise<{
  customer: Customer;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          payload,
        ),
      },
    );

  return unwrap(response);
}

/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

export async function updateCustomerStatus(
  accessToken: string,
  userId: string,
  status: Customer["status"],
  reason?: string,
): Promise<{
  customer: Customer;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}/status`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status,
          reason,
        }),
      },
    );

  return unwrap(response);
}

/* =========================================================
   ARCHIVE CUSTOMER
========================================================= */

export async function archiveCustomer(
  accessToken: string,
  userId: string,
  reason?: string,
): Promise<{
  customer: Customer;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}/archive`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          reason,
        }),
      },
    );

  return unwrap(response);
}

/* =========================================================
   RESTORE CUSTOMER
========================================================= */

export async function restoreCustomer(
  accessToken: string,
  userId: string,
): Promise<{
  customer: Customer;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}/restore`,
      {
        method: "PATCH",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   DELETE CUSTOMER
========================================================= */

export async function deleteCustomer(
  accessToken: string,
  userId: string,
): Promise<{
  deleted: boolean;
  userId: string;
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        deleted: boolean;
        userId: string;
      }>
    >(
      `/admin/customers/${userId}`,
      {
        method: "DELETE",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CUSTOMER ADDRESSES
========================================================= */

export async function getCustomerAddresses(
  accessToken: string,
  userId: string,
): Promise<{
  addresses: CustomerAddress[];
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        addresses: CustomerAddress[];
      }>
    >(
      `/admin/customers/${userId}/addresses`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CUSTOMER ORDERS
========================================================= */

export async function getCustomerOrders(
  accessToken: string,
  userId: string,
): Promise<{
  orders: CustomerOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const response =
    await apiFetch<
      ApiResponse<{
        orders: CustomerOrder[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>
    >(
      `/admin/customers/${userId}/orders`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CUSTOMER ACTIVITY
========================================================= */

export async function getCustomerActivity(
  accessToken: string,
  userId: string,
  page = 1,
  limit = 20,
): Promise<{
  activities: CustomerActivity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const query =
    new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

  const response =
    await apiFetch<
      ApiResponse<{
        activities: CustomerActivity[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>
    >(
      `/admin/customers/${userId}/activity?${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}