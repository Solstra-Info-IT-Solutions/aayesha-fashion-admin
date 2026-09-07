// src/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "";

if (!API_BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not configured.",
  );
}

/* =========================================================
   TYPES
========================================================= */

export type ApiErrorResponse = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    status = 500,
    code?: string,
    details?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/* =========================================================
   API FETCH
========================================================= */

type ApiFetchOptions = RequestInit & {
  accessToken?: string | null;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    accessToken,
    headers,
    ...requestOptions
  } = options;

  if (!API_BASE_URL) {
    throw new ApiError(
      "API base URL is not configured.",
      500,
      "API_CONFIG_ERROR",
    );
  }

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url =
    `${API_BASE_URL}${normalizedPath}`;

  const requestHeaders = new Headers(
    headers,
  );

  if (
    !requestHeaders.has(
      "Content-Type",
    ) &&
    requestOptions.body
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json",
    );
  }

  if (accessToken) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response: Response;

  try {
    response = await fetch(
      url,
      {
        ...requestOptions,
        headers:
          requestHeaders,
        credentials: "include",
        cache: "no-store",
      },
    );
  } catch (error) {
    throw new ApiError(
      error instanceof Error
        ? error.message
        : "Network request failed.",
      0,
      "NETWORK_ERROR",
    );
  }

  let payload: unknown = null;

  const contentType =
    response.headers.get(
      "content-type",
    ) || "";

  if (
    contentType.includes(
      "application/json",
    )
  ) {
    try {
      payload =
        await response.json();
    } catch {
      payload = null;
    }
  } else {
    try {
      const text =
        await response.text();

      payload = text
        ? { message: text }
        : null;
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const errorPayload =
      payload as ApiErrorResponse | null;

    throw new ApiError(
      errorPayload?.error?.message ||
        "Request failed.",
      response.status,
      errorPayload?.error?.code,
      errorPayload?.error?.details,
    );
  }

  return payload as T;
}

/* =========================================================
   HTTP HELPERS
========================================================= */

export function apiGet<T>(
  path: string,
  accessToken?: string | null,
) {
  return apiFetch<T>(
    path,
    {
      method: "GET",
      accessToken,
    },
  );
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
) {
  return apiFetch<T>(
    path,
    {
      method: "POST",
      accessToken,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    },
  );
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
) {
  return apiFetch<T>(
    path,
    {
      method: "PUT",
      accessToken,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    },
  );
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
) {
  return apiFetch<T>(
    path,
    {
      method: "PATCH",
      accessToken,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    },
  );
}

export function apiDelete<T>(
  path: string,
  accessToken?: string | null,
) {
  return apiFetch<T>(
    path,
    {
      method: "DELETE",
      accessToken,
    },
  );
}

export { API_BASE_URL };