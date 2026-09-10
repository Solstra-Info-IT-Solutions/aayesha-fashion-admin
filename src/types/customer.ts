export type CustomerStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "blocked";

export type Customer = {
  userId: string;

  name: string;
  email: string;
  phone: string;

  dateOfBirth: string | null;
  gender: "female" | "male" | "other" | null;

  preferredSizes: string[];
  preferredColors: string[];

  marketingEmails: boolean;
  marketingWhatsapp: boolean;

  lastOrderAt: string | null;
  totalOrders: number;
  totalSpent: number;

  status: CustomerStatus;

  isArchived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  archiveReason: string;

  createdAt: string;
  updatedAt: string;
};

export type CustomerPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type CustomerListResponse = {
  customers: Customer[];
  pagination: CustomerPagination;
};

export type CustomerStats = {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  blocked: number;
  archived: number;
  totalOrders: number;
  totalSpent: number;
};

export type CustomerAddress = {
  _id?: string;
  id?: string;

  firstName?: string;
  lastName?: string;

  addressLine1?: string;
  addressLine2?: string;

  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  phone?: string;

  isDefault?: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type CustomerActivity = {
  _id: string;

  entity: string;
  entityId: string;
  action: string;

  description: string;

  performedBy:
    | {
        _id: string;
        name?: string;
        email?: string;
      }
    | null;

  metadata?: Record<string, unknown>;

  createdAt: string;
};

export type CustomerOrder = {
  orderNumber: string;

  status?: string;

  total?: number;
  grandTotal?: number;

  createdAt?: string;

  paymentStatus?: string;

  items?: Array<{
    productId?: string;
    variantId?: string;
    quantity?: number;
    name?: string;
    price?: number;
  }>;
};