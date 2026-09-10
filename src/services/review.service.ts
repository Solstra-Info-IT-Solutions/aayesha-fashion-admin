import { apiFetch } from "@/lib/api";

import type {
  Review,
  ReviewFeaturedInput,
  ReviewListParams,
  ReviewListResponse,
  ReviewModerateInput,
  ReviewResponse,
  ReviewStats,
  ReviewStatsResponse,
  ReviewUpdateInput,
} from "@/types/review";

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
  params: ReviewListParams = {},
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

export async function getReviewStats(
  accessToken: string,
): Promise<ReviewStats> {
  const response =
    await apiFetch<ReviewStatsResponse>(
      "/admin/reviews/stats",
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   LIST REVIEWS
========================================================= */

export async function getReviews(
  accessToken: string,
  params: ReviewListParams = {},
): Promise<{
  items: Review[];
  pagination: ReviewListResponse["data"]["pagination"];
}> {
  const query =
    buildQuery(params);

  const response =
    await apiFetch<ReviewListResponse>(
      `/admin/reviews${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   GET SINGLE REVIEW
========================================================= */

export async function getReview(
  accessToken: string,
  id: string,
): Promise<Review> {
  const response =
    await apiFetch<ReviewResponse>(
      `/admin/reviews/${id}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/* =========================================================
   MODERATE REVIEW
========================================================= */

export async function moderateReview(
  accessToken: string,
  id: string,
  input: ReviewModerateInput,
): Promise<Review> {
  const response =
    await apiFetch<ReviewResponse>(
      `/admin/reviews/${id}/moderate`,
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
   FEATURE / UNFEATURE REVIEW
========================================================= */

export async function updateReviewFeatured(
  accessToken: string,
  id: string,
  input: ReviewFeaturedInput,
): Promise<Review> {
  const response =
    await apiFetch<ReviewResponse>(
      `/admin/reviews/${id}/featured`,
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
   UPDATE REVIEW
========================================================= */

export async function updateReview(
  accessToken: string,
  id: string,
  input: ReviewUpdateInput,
): Promise<Review> {
  const response =
    await apiFetch<ReviewResponse>(
      `/admin/reviews/${id}`,
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
   DELETE REVIEW
========================================================= */

export async function deleteReview(
  accessToken: string,
  id: string,
): Promise<Review> {
  const response =
    await apiFetch<ReviewResponse>(
      `/admin/reviews/${id}`,
      {
        method: "DELETE",
        accessToken,
      },
    );

  return unwrap(response);
}