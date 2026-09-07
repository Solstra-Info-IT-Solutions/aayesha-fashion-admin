export type InventoryStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

export type InventorySort =
  | "newest"
  | "oldest"
  | "stock-low"
  | "stock-high"
  | "reserved-high"
  | "sku";

export type InventoryStatusFilter =
  | "all"
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

export type InventoryLedgerType =
  | "stock_adjustment"
  | "reserve"
  | "release_reservation"
  | "sale"
  | "return"
  | "exchange"
  | "restock"
  | "correction";

export type InventoryReferenceType =
  | "manual"
  | "order"
  | "return"
  | "exchange"
  | "system"
  | "bulk";

export interface InventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface InventoryVariantProperty {
  id?: string;
  name?: string;
  label?: string;
  code?: string;
  hex?: string;
  value?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface InventoryPricing {
  mrp?: number;
  price?: number;
  salePrice?: number;
  compareAtPrice?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  slug: string;
  productType: string;

  category?: unknown;

  variantId: string;
  sku: string;

  color?: unknown;
  size?: unknown;

  pricing?: InventoryPricing | null;

  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;

  status: InventoryStatus;

  variantStatus?: string;
}

export interface InventorySummary {
  totalSkus: number;
  activeSkus: number;
  totalStock: number;
  totalReserved: number;
  totalAvailable: number;
  lowStockSkus: number;
  outOfStockSkus: number;
}

export interface InventoryLedgerEntry {
  id: string;

  productId: string;
  variantId: string;
  sku: string;

  type: InventoryLedgerType | string;

  quantity: number;

  stockBefore: number;
  stockAfter: number;

  reservedBefore: number;
  reservedAfter: number;

  reason: string;

  referenceType?: InventoryReferenceType | string;
  referenceId?: string;

  notes?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface InventoryListResponse {
  success: true;
  data: {
    items: InventoryItem[];
    pagination: InventoryPagination;
  };
}

export interface InventorySummaryResponse {
  success: true;
  data: InventorySummary;
}

export interface InventoryItemResponse {
  success: true;
  data: InventoryItem;
}

export interface InventoryLedgerResponse {
  success: true;
  data: {
    entries: InventoryLedgerEntry[];
    pagination: InventoryPagination;
  };
}

export interface StockAdjustmentInput {
  productId: string;
  variantId: string;
  quantity: number;
  reason: string;
  referenceType?: InventoryReferenceType;
  referenceId?: string;
  notes?: string;
}

export interface ReservationInput {
  productId: string;
  variantId: string;
  quantity: number;
  reason: string;
  referenceType?: InventoryReferenceType;
  referenceId?: string;
  notes?: string;
}

export interface ThresholdInput {
  productId: string;
  variantId: string;
  lowStockThreshold: number;
}

export interface InventoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: InventoryStatusFilter;
  sort?: InventorySort;
}

export interface LedgerQuery {
  productId?: string;
  variantId?: string;
  sku?: string;
  type?: InventoryLedgerType;
  page?: number;
  limit?: number;
}