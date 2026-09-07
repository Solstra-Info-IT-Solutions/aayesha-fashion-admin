import {
  apiGet,
  apiPost,
} from "@/lib/api";

import type {
  AuthResponse,
  AuthUser,
} from "@/types/auth";

/* =========================================================
   LOGIN
========================================================= */

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response =
    await apiPost<{
      success: boolean;
      data: AuthResponse;
    }>(
      "/auth/login",
      {
        email: email.trim(),
        password,
      },
    );

  return response.data;
}

/* =========================================================
   REFRESH SESSION
========================================================= */

export async function refreshAdminSession(): Promise<AuthResponse> {
  const response =
    await apiPost<{
      success: boolean;
      data: AuthResponse;
    }>(
      "/auth/refresh",
    );

  return response.data;
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getCurrentAdmin(
  accessToken: string,
): Promise<AuthUser> {
  const response =
    await apiGet<{
      success: boolean;
      data: {
        user: AuthUser;
      };
    }>(
      "/auth/me",
      accessToken,
    );

  return response.data.user;
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logoutAdmin(
  accessToken?: string | null,
): Promise<void> {
  await apiPost(
    "/auth/logout",
    undefined,
    accessToken,
  );
}