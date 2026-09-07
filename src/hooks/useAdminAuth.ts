"use client";

import {
  useAuthStore,
} from "@/store/auth.store";

export function useAdminAuth() {
  return {
    user: useAuthStore(
      (state) => state.user,
    ),

    accessToken:
      useAuthStore(
        (state) =>
          state.accessToken,
      ),

    isAuthenticated:
      useAuthStore(
        (state) =>
          state.isAuthenticated,
      ),

    isLoading:
      useAuthStore(
        (state) =>
          state.isLoading,
      ),

    isInitialized:
      useAuthStore(
        (state) =>
          state.isInitialized,
      ),

    login:
      useAuthStore(
        (state) => state.login,
      ),

    logout:
      useAuthStore(
        (state) => state.logout,
      ),

    initializeAuth:
      useAuthStore(
        (state) =>
          state.initializeAuth,
      ),

    hasAdminAccess:
      useAuthStore(
        (state) =>
          state.hasAdminAccess,
      ),

    hasAdminRole:
      useAuthStore(
        (state) =>
          state.hasAdminRole,
      ),
  };
}