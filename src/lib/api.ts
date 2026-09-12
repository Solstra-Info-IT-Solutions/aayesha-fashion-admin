// src/lib/api.ts

/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(
    /\/+$/,
    "",
  ) || "";

if (!API_BASE_URL) {
  console.warn(
    "[Aayesha Admin] NEXT_PUBLIC_API_BASE_URL is not configured.",
  );
}

/* =========================================================
   TYPES
========================================================= */

export type ApiErrorPayload = {
  success?: false;

  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;

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

    Object.setPrototypeOf(
      this,
      ApiError.prototype,
    );
  }
}

/* =========================================================
   REQUEST OPTIONS
========================================================= */

export type ApiFetchOptions =
  RequestInit & {
    accessToken?: string | null;
  };

/* =========================================================
   URL BUILDER
========================================================= */

function buildApiUrl(
  path: string,
): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}

/* =========================================================
   REQUEST HEADERS
========================================================= */

function createRequestHeaders(
  headers?: HeadersInit,
  body?: BodyInit | null,
  accessToken?: string | null,
): Headers {
  const requestHeaders =
    new Headers(headers);

  /*
   * FormData requests must NOT receive a manually
   * assigned Content-Type.
   *
   * The browser automatically creates:
   *
   * multipart/form-data; boundary=...
   *
   * If we set application/json here, Multer cannot
   * parse the uploaded file.
   */
  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  if (
    body &&
    !isFormData &&
    !requestHeaders.has(
      "Content-Type",
    )
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json",
    );
  }

  /*
   * Access token is kept in memory and sent through
   * the Authorization header.
   */
  if (accessToken) {
    requestHeaders.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  /*
   * Never allow an existing JSON Content-Type to remain
   * on a FormData request.
   */
  if (isFormData) {
    requestHeaders.delete(
      "Content-Type",
    );
  }

  return requestHeaders;
}

/* =========================================================
   RESPONSE PARSER
========================================================= */

async function parseResponse(
  response: Response,
): Promise<unknown> {
  /*
   * 204 No Content
   */
  if (
    response.status === 204
  ) {
    return null;
  }

  const contentType =
    response.headers.get(
      "content-type",
    ) || "";

  /*
   * JSON response
   */
  if (
    contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  /*
   * Non-JSON response
   */
  try {
    const text =
      await response.text();

    return text
      ? {
          message: text,
        }
      : null;
  } catch {
    return null;
  }
}

/* =========================================================
   API FETCH
========================================================= */

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    accessToken,
    headers,
    body,
    ...requestOptions
  } = options;

  if (!API_BASE_URL) {
    throw new ApiError(
      "API base URL is not configured.",
      500,
      "API_CONFIG_ERROR",
    );
  }

  const url =
    buildApiUrl(path);

  const requestHeaders =
    createRequestHeaders(
      headers,
      body,
      accessToken,
    );

  let response: Response;

  try {
    response = await fetch(
      url,
      {
        ...requestOptions,
        body,
        headers:
          requestHeaders,

        /*
         * Required for the backend HTTP-only
         * refresh-token cookie.
         */
        credentials: "include",

        /*
         * Admin data should always be fresh.
         */
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

  const payload =
    await parseResponse(
      response,
    );

  /* =======================================================
     ERROR RESPONSE
  ======================================================= */

  if (!response.ok) {
    const errorPayload =
      payload as
        | ApiErrorPayload
        | null;

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
   GET
========================================================= */

export function apiGet<T>(
  path: string,
  accessToken?: string | null,
): Promise<T> {
  return apiFetch<T>(
    path,
    {
      method: "GET",
      accessToken,
    },
  );
}

/* =========================================================
   POST
========================================================= */

export function apiPost<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
): Promise<T> {
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

/* =========================================================
   PUT
========================================================= */

export function apiPut<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
): Promise<T> {
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

/* =========================================================
   PATCH
========================================================= */

export function apiPatch<T>(
  path: string,
  body?: unknown,
  accessToken?: string | null,
): Promise<T> {
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

/* =========================================================
   DELETE
========================================================= */

export function apiDelete<T>(
  path: string,
  accessToken?: string | null,
): Promise<T> {
  return apiFetch<T>(
    path,
    {
      method: "DELETE",
      accessToken,
    },
  );
}

/* =========================================================
   EXPORT
========================================================= */

export {
  API_BASE_URL,
};