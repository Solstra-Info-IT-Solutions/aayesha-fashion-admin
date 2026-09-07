export type UserRole =
  | "customer"
  | "admin";

export type AdminRole =
  | "super_admin"
  | "admin"
  | "order_manager"
  | "product_manager"
  | "inventory_manager"
  | "customer_support"
  | "marketing_manager"
  | "content_manager"
  | "accountant"
  | "viewer";

export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "blocked";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  adminRole?: AdminRole | null;
  status?: UserStatus;
  isEmailVerified?: boolean;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};