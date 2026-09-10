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
    query.set("page", String(params.page));
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    query.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.status) {
    query.set("status", params.status);
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
    query.set("sort", params.sort);
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

export async function getCustomers(
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
    await apiFetch<ApiResponse<CustomerListResponse>>(
      `/admin/customers?${query}`,
      {
        method: "GET",
      },
    );

  return unwrap(response);
}

export async function getCustomerStats(): Promise<CustomerStats> {
  const response =
    await apiFetch<ApiResponse<CustomerStats>>(
      "/admin/customers/stats",
      {
        method: "GET",
      },
    );

  return unwrap(response);
}

export async function getCustomer(
  userId: string,
): Promise<{ customer: Customer }> {
  const response =
    await apiFetch<
      ApiResponse<{ customer: Customer }>
    >(
      `/admin/customers/${userId}`,
      {
        method: "GET",
      },
    );

  return unwrap(response);
}

export async function updateCustomer(
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
): Promise<{ customer: Customer }> {
  const response =
    await apiFetch<
      ApiResponse<{ customer: Customer }>
    >(
      `/admin/customers/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

  return unwrap(response);
}

export async function updateCustomerStatus(
  userId: string,
  status: Customer["status"],
  reason?: string,
): Promise<{ customer: Customer }> {
  const response =
    await apiFetch<
      ApiResponse<{ customer: Customer }>
    >(
      `/admin/customers/${userId}/status`,
      {
        method: "PATCH",
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

export async function archiveCustomer(
  userId: string,
  reason?: string,
) {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}/archive`,
      {
        method: "PATCH",
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

export async function restoreCustomer(
  userId: string,
) {
  const response =
    await apiFetch<
      ApiResponse<{
        customer: Customer;
      }>
    >(
      `/admin/customers/${userId}/restore`,
      {
        method: "PATCH",
      },
    );

  return unwrap(response);
}

export async function deleteCustomer(
  userId: string,
) {
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
      },
    );

  return unwrap(response);
}

export async function getCustomerAddresses(
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
      },
    );

  return unwrap(response);
}

export async function getCustomerOrders(
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
      },
    );

  return unwrap(response);
}

export async function getCustomerActivity(
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
  const query = new URLSearchParams({
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
      },
    );

  return unwrap(response);
}