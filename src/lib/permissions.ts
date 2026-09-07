import type {
  AdminRole,
} from "@/types/auth";

export const permissionMap =
  {
    dashboard: [
      "super_admin",
      "admin",
      "viewer",
    ],

    orders: [
      "super_admin",
      "admin",
      "order_manager",
      "customer_support",
      "viewer",
    ],

    products: [
      "super_admin",
      "admin",
      "product_manager",
      "viewer",
    ],

    inventory: [
      "super_admin",
      "admin",
      "inventory_manager",
      "product_manager",
      "viewer",
    ],

    customers: [
      "super_admin",
      "admin",
      "customer_support",
      "order_manager",
      "viewer",
    ],

    marketing: [
      "super_admin",
      "admin",
      "marketing_manager",
    ],

    content: [
      "super_admin",
      "admin",
      "content_manager",
    ],

    reports: [
      "super_admin",
      "admin",
      "accountant",
      "viewer",
    ],

    settings: [
      "super_admin",
      "admin",
    ],
  } as const;

export type Permission =
  keyof typeof permissionMap;

export function hasPermissionForRole(
  role:
    | AdminRole
    | null
    | undefined,
  permission: Permission,
) {
  if (!role) {
    return false;
  }

  return (
    permissionMap[
      permission
    ] as readonly string[]
  ).includes(role);
}