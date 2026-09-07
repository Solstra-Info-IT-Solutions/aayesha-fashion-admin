"use client";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import {
  hasPermissionForRole,
} from "@/lib/permissions";

import type {
  Permission,
} from "@/lib/permissions";

export function usePermission() {
  const {
    user,
  } = useAdminAuth();

  function can(
    permission: Permission,
  ) {
    return hasPermissionForRole(
      user?.adminRole,
      permission,
    );
  }

  return {
    can,
  };
}