import { apiFetch } from "@/lib/api";

import type {
  SupportCloseInput,
  SupportListParams,
  SupportListResponse,
  SupportResponse,
  SupportStats,
  SupportStatsResponse,
  SupportTicket,
  SupportUpdateInput,
} from "@/types/support";

type ApiError = {
  code?: string;
  message?: string;
  details?: unknown;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: ApiError;
};

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(
      response.error?.message || "Something went wrong.",
    );
  }

  return response.data;
}

function buildQuery(params: SupportListParams = {}) {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params.status) {
    query.set("status", params.status);
  }

  if (params.priority) {
    query.set("priority", params.priority);
  }

  if (params.category) {
    query.set("category", params.category);
  }

  if (params.assignedTo?.trim()) {
    query.set("assignedTo", params.assignedTo.trim());
  }

  if (params.sort) {
    query.set("sort", params.sort);
  }

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
}

export async function getSupportStats(
  accessToken: string,
): Promise<SupportStats> {
  const response = await apiFetch<ApiResponse<SupportStats>>(
    "/admin/support/stats",
    {
      method: "GET",
      accessToken,
    },
  );

  return unwrap(response);
}

export async function getSupportTickets(
  accessToken: string,
  params: SupportListParams = {},
) {
  const query = buildQuery(params);

  const response = await apiFetch<
    ApiResponse<SupportListResponse["data"]>
  >(`/admin/support${query}`, {
    method: "GET",
    accessToken,
  });

  return unwrap(response);
}

export async function getSupportTicket(
  accessToken: string,
  id: string,
): Promise<SupportTicket> {
  const response = await apiFetch<
    ApiResponse<SupportTicket>
  >(`/admin/support/${id}`, {
    method: "GET",
    accessToken,
  });

  return unwrap(response);
}

export async function updateSupportTicket(
  accessToken: string,
  id: string,
  data: SupportUpdateInput,
): Promise<SupportTicket> {
  const response = await apiFetch<
    ApiResponse<SupportTicket>
  >(`/admin/support/${id}`, {
    method: "PATCH",
    accessToken,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return unwrap(response);
}

export async function closeSupportTicket(
  accessToken: string,
  id: string,
  data: SupportCloseInput = {},
): Promise<SupportTicket> {
  const response = await apiFetch<
    ApiResponse<SupportTicket>
  >(`/admin/support/${id}/close`, {
    method: "PATCH",
    accessToken,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return unwrap(response);
}

export async function deleteSupportTicket(
  accessToken: string,
  id: string,
): Promise<SupportTicket> {
  const response = await apiFetch<
    ApiResponse<SupportTicket>
  >(`/admin/support/${id}`, {
    method: "DELETE",
    accessToken,
  });

  return unwrap(response);
}