import { apiFetch } from "@/lib/api";

import type {
  MarketingCampaign,
  MarketingCampaignCreateInput,
  MarketingCampaignListParams,
  MarketingCampaignListResponse,
  MarketingCampaignResponse,
  MarketingCampaignStats,
  MarketingCampaignStatsResponse,
  MarketingCampaignStatusInput,
  MarketingCampaignUpdateInput,
} from "@/types/marketing";

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
      response.error?.message ||
        "Something went wrong.",
    );
  }

  return response.data;
}

function buildQuery(
  params: MarketingCampaignListParams = {},
) {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.type) {
    searchParams.set("type", params.type);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.includeArchived !== undefined) {
    searchParams.set(
      "includeArchived",
      String(params.includeArchived),
    );
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/* ─────────────────────────────────────────────
   Stats
───────────────────────────────────────────── */

export async function getMarketingStats(
  accessToken: string,
): Promise<MarketingCampaignStats> {
  const response =
    await apiFetch<MarketingCampaignStatsResponse>(
      "/admin/marketing/stats",
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   List Campaigns
───────────────────────────────────────────── */

export async function getMarketingCampaigns(
  accessToken: string,
  params: MarketingCampaignListParams = {},
): Promise<{
  campaigns: MarketingCampaign[];
  pagination: MarketingCampaignListResponse["data"]["pagination"];
}> {
  const query = buildQuery(params);

  const response =
    await apiFetch<MarketingCampaignListResponse>(
      `/admin/marketing/campaigns${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Get Single Campaign
───────────────────────────────────────────── */

export async function getMarketingCampaign(
  accessToken: string,
  id: string,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Create Campaign
───────────────────────────────────────────── */

export async function createMarketingCampaign(
  accessToken: string,
  input: MarketingCampaignCreateInput,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      "/admin/marketing/campaigns",
      {
        method: "POST",
        accessToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Update Campaign
───────────────────────────────────────────── */

export async function updateMarketingCampaign(
  accessToken: string,
  id: string,
  input: MarketingCampaignUpdateInput,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Update Campaign Status
───────────────────────────────────────────── */

export async function updateMarketingCampaignStatus(
  accessToken: string,
  id: string,
  input: MarketingCampaignStatusInput,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}/status`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Archive Campaign
───────────────────────────────────────────── */

export async function archiveMarketingCampaign(
  accessToken: string,
  id: string,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}/archive`,
      {
        method: "PATCH",
        accessToken,
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Restore Campaign
───────────────────────────────────────────── */

export async function restoreMarketingCampaign(
  accessToken: string,
  id: string,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}/restore`,
      {
        method: "PATCH",
        accessToken,
      },
    );

  return unwrap(response);
}

/* ─────────────────────────────────────────────
   Delete Campaign
───────────────────────────────────────────── */

export async function deleteMarketingCampaign(
  accessToken: string,
  id: string,
): Promise<MarketingCampaign> {
  const response =
    await apiFetch<MarketingCampaignResponse>(
      `/admin/marketing/campaigns/${id}`,
      {
        method: "DELETE",
        accessToken,
      },
    );

  return unwrap(response);
}