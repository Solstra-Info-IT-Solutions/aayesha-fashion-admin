/* ============================================================
   AAYESHA FASHION — PRODUCT DOMAIN TYPES
   SIMPLE PRODUCT ARCHITECTURE
============================================================ */

export const PRODUCT_CURRENCY = "INR" as const;

/* ============================================================
   STATUS
============================================================ */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived"
  | "discontinued";

/* ============================================================
   MEDIA
============================================================ */

export type ProductMediaType =
  | "image"
  | "video";

export interface ProductMedia {
  id: string;

  type: ProductMediaType;

  src: string;

  alt?: string;

  thumbnail?: string;

  poster?: string;

  mimeType?: string;

  width?: number;

  height?: number;

  duration?: number;

  sortOrder: number;

  isPrimary: boolean;
}

/* ============================================================
   PRICING
============================================================ */

export interface ProductPricing {
  mrp: number;

  sellingPrice: number;

  currency: typeof PRODUCT_CURRENCY;
}

/* ============================================================
   INVENTORY
============================================================ */

export interface ProductInventory {
  stock: number;

  reserved: number;

  lowStockThreshold: number;
}

/* ============================================================
   CONTENT
============================================================ */

export type ProductContentFormat =
  | "plain"
  | "html"
  | "rich";

export interface ProductContent {
  description: string;

  descriptionFormat: ProductContentFormat;

  richContent?: string;
}

/* ============================================================
   MERCHANDISING
============================================================ */

export type ProductBadge =
  | "new"
  | "best-seller"
  | "featured"
  | "exclusive"
  | "limited"
  | "sale"
  | "trending"
  | "back-in-stock";

export interface ProductMerchandising {
  isNew: boolean;

  isFeatured: boolean;

  isBestSeller: boolean;

  badges: ProductBadge[];

  ranking?: number;
}

/* ============================================================
   SEO
============================================================ */

export interface ProductSEO {
  title?: string;

  description?: string;

  keywords?: string[];

  canonical?: string;

  noIndex?: boolean;
}

/* ============================================================
   PRODUCT
============================================================ */

export interface Product {
  id: string;

  slug: string;

  name: string;

  categoryId: string;

  pricing: ProductPricing;

  inventory: ProductInventory;

  content: ProductContent;

  media: ProductMedia[];

  merchandising: ProductMerchandising;

  seo?: ProductSEO;

  status: ProductStatus;

  publishedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   CREATE PRODUCT
============================================================ */

export interface CreateProductInput {
  id: string;

  slug?: string;

  name: string;

  categoryId: string;

  pricing: ProductPricing;

  inventory: ProductInventory;

  content: ProductContent;

  media?: ProductMedia[];

  merchandising?: ProductMerchandising;

  seo?: ProductSEO;

  status?: ProductStatus;

  publishedAt?: string;
}

/* ============================================================
   UPDATE PRODUCT
============================================================ */

export interface UpdateProductInput {
  name?: string;

  slug?: string;

  categoryId?: string;

  pricing?: ProductPricing;

  inventory?: ProductInventory;

  content?: ProductContent;

  merchandising?: ProductMerchandising;

  seo?: ProductSEO;

  status?: ProductStatus;

  publishedAt?: string | null;
}

/* ============================================================
   FILTERS
============================================================ */

export interface ProductFilters {
  categoryId?: string;

  status?: ProductStatus;

  minPrice?: number;

  maxPrice?: number;

  inStockOnly?: boolean;

  isNew?: boolean;

  isBestSeller?: boolean;

  isFeatured?: boolean;

  search?: string;
}

/* ============================================================
   HELPERS
============================================================ */

export function getAvailableStock(
  product: Product,
): number {
  return Math.max(
    0,
    product.inventory.stock -
      product.inventory.reserved,
  );
}

export function getInventoryStatus(
  product: Product,
):
  | "in-stock"
  | "low-stock"
  | "out-of-stock" {
  const available =
    getAvailableStock(product);

  if (available <= 0) {
    return "out-of-stock";
  }

  if (
    available <=
    product.inventory.lowStockThreshold
  ) {
    return "low-stock";
  }

  return "in-stock";
}

/* ============================================================
   DISCOUNT
============================================================ */

export function getDiscountPercentage(
  pricing: ProductPricing,
): number {
  if (
    pricing.mrp <= 0 ||
    pricing.sellingPrice >= pricing.mrp
  ) {
    return 0;
  }

  return Math.round(
    ((pricing.mrp -
      pricing.sellingPrice) /
      pricing.mrp) *
      100,
  );
}

/* ============================================================
   PRODUCT PRICE HELPERS
============================================================ */

export function getProductStartingPrice(
  product: Product,
): number {
  return product.pricing.sellingPrice;
}

export function getProductStartingMrp(
  product: Product,
): number {
  return product.pricing.mrp;
}