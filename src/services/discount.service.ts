import { apiFetch } from "@/lib/api";

import type {
  Coupon,
  CouponCreateInput,
  CouponListParams,
  CouponListResponse,
  CouponResponse,
  CouponStats,
  CouponStatsResponse,
  CouponStatusInput,
  CouponUpdateInput,
} from "@/types/discount";

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

function unwrap<T>(
  response: ApiResponse<T>,
): T {
  if (!response.success) {
    throw new Error(
      response.error?.message ||
        "Something went wrong.",
    );
  }

  return response.data;
}

function buildQuery(
  params: CouponListParams = {},
) {
  const searchParams =
    new URLSearchParams();

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

  if (params.discountType) {
    searchParams.set(
      "discountType",
      params.discountType,
    );
  }

  if (params.status) {
    searchParams.set(
      "status",
      params.status,
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort,
    );
  }

  const query =
    searchParams.toString();

  return query
    ? `?${query}`
    : "";
}

/* =========================================================
   STATS
========================================================= */

export async function getDiscountStats(
  accessToken: string,
): Promise<CouponStats> {
  const response =
    await apiFetch<CouponStatsResponse>(
      "/admin/coupons/stats",
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   LIST COUPONS
========================================================= */

export async function getDiscounts(
  accessToken: string,
  params: CouponListParams = {},
): Promise<{
  items: Coupon[];
  pagination: CouponListResponse["data"]["pagination"];
}> {
  const query =
    buildQuery(params);

  const response =
    await apiFetch<CouponListResponse>(
      `/admin/coupons${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   GET SINGLE COUPON
========================================================= */

export async function getDiscount(
  accessToken: string,
  id: string,
): Promise<Coupon> {
  const response =
    await apiFetch<CouponResponse>(
      `/admin/coupons/${id}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   CREATE COUPON
========================================================= */

export async function createDiscount(
  accessToken: string,
  input: CouponCreateInput,
): Promise<Coupon> {
  const response =
    await apiFetch<CouponResponse>(
      "/admin/coupons",
      {
        method: "POST",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* =========================================================
   UPDATE COUPON
========================================================= */

export async function updateDiscount(
  accessToken: string,
  id: string,
  input: CouponUpdateInput,
): Promise<Coupon> {
  const response =
    await apiFetch<CouponResponse>(
      `/admin/coupons/${id}`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* =========================================================
   UPDATE STATUS
========================================================= */

export async function updateDiscountStatus(
  accessToken: string,
  id: string,
  input: CouponStatusInput,
): Promise<Coupon> {
  const response =
    await apiFetch<CouponResponse>(
      `/admin/coupons/${id}/status`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(input),
      },
    );

  return unwrap(response);
}

/* =========================================================
   DELETE COUPON
========================================================= */

export async function deleteDiscount(
  accessToken: string,
  id: string,
): Promise<Coupon> {
  const response =
    await apiFetch<CouponResponse>(
      `/admin/coupons/${id}`,
      {
        method: "DELETE",
        accessToken,
      },
    );

  return unwrap(response);
}