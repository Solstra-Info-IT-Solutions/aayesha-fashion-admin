import { apiFetch } from "@/lib/api";

import type {
  SettingApiResponse,
  SettingListParams,
  SettingPublicInput,
  SettingUpsertInput,
  StoreSetting,
} from "@/types/settings";

function unwrap<T>(
  response: SettingApiResponse<T>,
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
  params: SettingListParams = {},
) {
  const query = new URLSearchParams();

  if (params.group?.trim()) {
    query.set(
      "group",
      params.group.trim(),
    );
  }

  const queryString = query.toString();

  return queryString
    ? `?${queryString}`
    : "";
}

/**
 * List all admin settings.
 *
 * GET /admin/settings
 */
export async function getSettings(
  accessToken: string,
  params: SettingListParams = {},
): Promise<StoreSetting[]> {
  const query = buildQuery(params);

  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting[]>
    >(
      `/admin/settings${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/**
 * List public settings.
 *
 * GET /admin/settings/public
 */
export async function getPublicSettings(
  accessToken: string,
  group?: string,
): Promise<StoreSetting[]> {
  const query = buildQuery({
    group,
  });

  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting[]>
    >(
      `/admin/settings/public${query}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/**
 * Get one setting by key.
 *
 * GET /admin/settings/:key
 */
export async function getSetting(
  accessToken: string,
  key: string,
): Promise<StoreSetting> {
  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting>
    >(
      `/admin/settings/${encodeURIComponent(key)}`,
      {
        method: "GET",
        accessToken,
      },
    );

  return unwrap(response);
}

/**
 * Create or update a setting.
 *
 * PUT /admin/settings
 */
export async function upsertSetting(
  accessToken: string,
  data: SettingUpsertInput,
): Promise<StoreSetting> {
  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting>
    >(
      "/admin/settings",
      {
        method: "PUT",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      },
    );

  return unwrap(response);
}

/**
 * Update public visibility.
 *
 * PATCH /admin/settings/:key/public
 */
export async function updateSettingPublic(
  accessToken: string,
  key: string,
  data: SettingPublicInput,
): Promise<StoreSetting> {
  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting>
    >(
      `/admin/settings/${encodeURIComponent(key)}/public`,
      {
        method: "PATCH",
        accessToken,
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(data),
      },
    );

  return unwrap(response);
}

/**
 * Delete a setting.
 *
 * DELETE /admin/settings/:key
 */
export async function deleteSetting(
  accessToken: string,
  key: string,
): Promise<StoreSetting> {
  const response =
    await apiFetch<
      SettingApiResponse<StoreSetting>
    >(
      `/admin/settings/${encodeURIComponent(key)}`,
      {
        method: "DELETE",
        accessToken,
      },
    );

  return unwrap(response);
}