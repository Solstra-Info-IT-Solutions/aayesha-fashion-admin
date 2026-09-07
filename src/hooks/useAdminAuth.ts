"use client";

import { useAuthStore } from "@/store/auth.store";

export function useAdminAuth() {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken,
    );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const isLoading =
    useAuthStore(
      (state) =>
        state.isLoading,
    );

  const isInitialized =
    useAuthStore(
      (state) =>
        state.isInitialized,
    );

  const login =
    useAuthStore(
      (state) => state.login,
    );

  const logout =
    useAuthStore(
      (state) => state.logout,
    );

  const initializeAuth =
    useAuthStore(
      (state) =>
        state.initializeAuth,
    );

  const hasAdminAccess =
    useAuthStore(
      (state) =>
        state.hasAdminAccess,
    );

  const hasAdminRole =
    useAuthStore(
      (state) =>
        state.hasAdminRole,
    );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    logout,
    initializeAuth,
    hasAdminAccess,
    hasAdminRole,
  };
}