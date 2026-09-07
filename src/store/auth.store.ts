"use client";

import { create } from "zustand";

import {
  loginAdmin,
  logoutAdmin,
  refreshAdminSession,
} from "@/services/auth.service";

import type {
  AdminRole,
  AuthUser,
} from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<AuthUser>;

  initializeAuth: () => Promise<void>;

  logout: () => Promise<void>;

  hasAdminAccess: () => boolean;

  hasAdminRole: (
    role: AdminRole,
  ) => boolean;
};

export const useAuthStore =
  create<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,

      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      /* =====================================================
         LOGIN
      ===================================================== */

      login: async (
        email,
        password,
      ) => {
        set({
          isLoading: true,
        });

        try {
          const result =
            await loginAdmin(
              email,
              password,
            );

          if (
            result.user.role !==
            "admin"
          ) {
            throw new Error(
              "This account does not have admin access.",
            );
          }

          if (
            result.user.status &&
            result.user.status !==
              "active"
          ) {
            throw new Error(
              "This admin account is not active.",
            );
          }

          set({
            user: result.user,
            accessToken:
              result.accessToken,
            isAuthenticated: true,
            isInitialized: true,
          });

          return result.user;
        } finally {
          set({
            isLoading: false,
          });
        }
      },

      /* =====================================================
         SESSION INITIALIZATION
      ===================================================== */

      initializeAuth:
        async () => {
          if (
            get()
              .isInitialized
          ) {
            return;
          }

          set({
            isLoading: true,
          });

          try {
            const result =
              await refreshAdminSession();

            if (
              result.user.role !==
              "admin"
            ) {
              set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
              });

              return;
            }

            if (
              result.user.status &&
              result.user.status !==
                "active"
            ) {
              set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
              });

              return;
            }

            set({
              user: result.user,
              accessToken:
                result.accessToken,
              isAuthenticated: true,
            });
          } catch {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
            });
          } finally {
            set({
              isInitialized: true,
              isLoading: false,
            });
          }
        },

      /* =====================================================
         LOGOUT
      ===================================================== */

      logout: async () => {
        const token =
          get().accessToken;

        try {
          await logoutAdmin(
            token,
          );
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },

      /* =====================================================
         ADMIN ACCESS
      ===================================================== */

      hasAdminAccess:
        () => {
          const user =
            get().user;

          return (
            user?.role ===
              "admin" &&
            (!user.status ||
              user.status ===
                "active")
          );
        },

      /* =====================================================
         ROLE
      ===================================================== */

      hasAdminRole:
        (role) => {
          const user =
            get().user;

          return (
            user?.role ===
              "admin" &&
            user.adminRole ===
              role
          );
        },
    }),
  );