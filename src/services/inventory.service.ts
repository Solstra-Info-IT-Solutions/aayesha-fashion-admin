import {
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api";

import type {
  InventoryItemResponse,
  InventoryLedgerResponse,
  InventoryListResponse,
  InventoryQuery,
  InventorySummaryResponse,
  LedgerQuery,
  ReservationInput,
  StockAdjustmentInput,
  ThresholdInput,
} from "@/types/inventory";

const BASE_PATH = "/admin/inventory";

const buildQueryString = (
  params: Record<string, string | number | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
};

export async function getInventorySummary(
  accessToken?: string | null,
) {
  return apiGet<InventorySummaryResponse>(
    `${BASE_PATH}/summary`,
    accessToken,
  );
}

export async function getInventory(
  query: InventoryQuery = {},
  accessToken?: string | null,
) {
  const queryString = buildQueryString({
    page: query.page ?? 1,
    limit: query.limit ?? 25,
    search: query.search,
    status: query.status ?? "all",
    sort: query.sort ?? "newest",
  });

  return apiGet<InventoryListResponse>(
    `${BASE_PATH}${queryString}`,
    accessToken,
  );
}

export async function getInventoryItem(
  productId: string,
  variantId: string,
  accessToken?: string | null,
) {
  return apiGet<InventoryItemResponse>(
    `${BASE_PATH}/${productId}/${variantId}`,
    accessToken,
  );
}

export async function adjustStock(
  payload: StockAdjustmentInput,
  accessToken?: string | null,
) {
  return apiPost<InventoryItemResponse>(
    `${BASE_PATH}/adjust`,
    payload,
    accessToken,
  );
}

export async function reserveStock(
  payload: ReservationInput,
  accessToken?: string | null,
) {
  return apiPost<InventoryItemResponse>(
    `${BASE_PATH}/reserve`,
    payload,
    accessToken,
  );
}

export async function releaseReservation(
  payload: ReservationInput,
  accessToken?: string | null,
) {
  return apiPost<InventoryItemResponse>(
    `${BASE_PATH}/release-reservation`,
    payload,
    accessToken,
  );
}

export async function updateInventoryThreshold(
  payload: ThresholdInput,
  accessToken?: string | null,
) {
  return apiPatch<InventoryItemResponse>(
    `${BASE_PATH}/threshold`,
    payload,
    accessToken,
  );
}

export async function getInventoryLedger(
  query: LedgerQuery = {},
  accessToken?: string | null,
) {
  const queryString = buildQueryString({
    productId: query.productId,
    variantId: query.variantId,
    sku: query.sku,
    type: query.type,
    page: query.page ?? 1,
    limit: query.limit ?? 25,
  });

  return apiGet<InventoryLedgerResponse>(
    `${BASE_PATH}/ledger${queryString}`,
    accessToken,
  );
}