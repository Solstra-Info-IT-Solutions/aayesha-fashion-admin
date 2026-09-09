/* ============================================================
   AAYESHA FASHION — PRODUCT DOMAIN TYPES
   API / CMS / ADMIN / STOREFRONT
============================================================ */

export const PRODUCT_CURRENCY =
  "INR" as const;

/* ============================================================
   ENUMS
============================================================ */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived"
  | "discontinued";

export type VariantStatus =
  | "active"
  | "inactive"
  | "discontinued";

export type ProductType =
  | "anarkali"
  | "kurta"
  | "kurta-set"
  | "suit-set"
  | "lehenga"
  | "saree"
  | "dress"
  | "top"
  | "bottom"
  | "co-ord"
  | "jacket"
  | "dupatta"
  | "other";

export type ProductCategory =
  | "festive"
  | "ethnic"
  | "contemporary"
  | "new-arrival";

export type ProductBadge =
  | "new"
  | "best-seller"
  | "featured"
  | "exclusive"
  | "limited"
  | "sale"
  | "trending"
  | "back-in-stock";

export type ProductMediaType =
  | "image"
  | "video"
  | "external-video"
  | "360";

export type ProductImageType =
  | "model"
  | "front"
  | "back"
  | "detail"
  | "flat-lay"
  | "lifestyle"
  | "video-poster";

export type ProductContentFormat =
  | "plain"
  | "html"
  | "rich";

export type ProductContentBlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "quote"
  | "image"
  | "video"
  | "divider";

export type SizeChartUnit =
  | "inch"
  | "cm";

export type ProductSort =
  | "relevance"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "best-selling"
  | "featured";

/* ============================================================
   PRICING
============================================================ */

export interface ProductPricing {
  mrp: number;
  sellingPrice: number;
  currency: typeof PRODUCT_CURRENCY;
  compareAtPrice?: number;
}

/* ============================================================
   COLOR
============================================================ */

export interface ProductColor {
  id: string;
  name: string;
  slug: string;
  hex?: string;
  swatchImage?: string;
}

/* ============================================================
   SIZE
============================================================ */

export interface ProductSize {
  code: string;
  label: string;
  sortOrder: number;
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
   MEDIA
============================================================ */

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

  colorId?: string;

  imageType?: ProductImageType;

  sortOrder: number;

  isPrimary?: boolean;
}

/* ============================================================
   VARIANT
============================================================ */

export interface ProductVariant {
  id: string;

  sku: string;

  barcode?: string;

  color: ProductColor;

  size: ProductSize;

  pricing: ProductPricing;

  inventory: ProductInventory;

  mediaIds?: string[];

  weight?: number;

  status: VariantStatus;
}

/* ============================================================
   ATTRIBUTES
============================================================ */

export interface ProductAttributes {
  fabric?: string;

  composition?: string;

  fit?: string;

  occasion?: string[];

  pattern?: string;

  work?: string;

  neckline?: string;

  sleeve?: string;

  silhouette?: string;

  length?: string;

  lining?: string;

  transparency?: string;

  careInstructions?: string[];
}

/* ============================================================
   SIZE CHART
============================================================ */

export interface ProductSizeMeasurement {
  size: string;

  bust?: number | string;

  waist?: number | string;

  hip?: number | string;

  shoulder?: number | string;

  armhole?: number | string;

  sleeveLength?: number | string;

  garmentLength?: number | string;

  bottomLength?: number | string;

  inseam?: number | string;

  rise?: number | string;
}

export interface ProductSizeChart {
  unit: SizeChartUnit;

  measurements: ProductSizeMeasurement[];

  fitNote?: string;
}

/* ============================================================
   CONTENT
============================================================ */

export interface ProductContentBlock {
  type: ProductContentBlockType;

  content?: string | string[];

  src?: string;

  alt?: string;

  caption?: string;
}

export interface ProductContent {
  description?: string;

  descriptionFormat: ProductContentFormat;

  richContent?:
    | string
    | ProductContentBlock[];

  highlights?: string[];

  stylingNotes?: string;

  fitNote?: string;

  materialsAndCare?:
    | string
    | string[];

  shippingContent?: string;

  returnContent?: string;
}

/* ============================================================
   FAQ
============================================================ */

export interface ProductFAQ {
  id: string;

  question: string;

  answer: string;

  answerFormat:
    | "plain"
    | "html";
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
   MERCHANDISING
============================================================ */

export interface ProductMerchandising {
  isNew: boolean;

  isFeatured: boolean;

  isBestSeller: boolean;

  badges: ProductBadge[];

  ranking?: number;
}

/* ============================================================
   REVIEWS
============================================================ */

export interface ProductReviewBreakdown {
  5?: number;
  4?: number;
  3?: number;
  2?: number;
  1?: number;
}

export interface ProductReviewSummary {
  averageRating: number;

  reviewCount: number;

  breakdown?: ProductReviewBreakdown;
}

/* ============================================================
   PRODUCT
============================================================ */

export interface Product {
  id: string;

  slug: string;

  name: string;

  productType: ProductType;

  category: ProductCategory;

  subcategory?: string;

  collectionIds?: string[];

  tags: string[];

  content: ProductContent;

  attributes: ProductAttributes;

  media: ProductMedia[];

  sizeChart?: ProductSizeChart;

  variants: ProductVariant[];

  faqs?: ProductFAQ[];

  reviews?: ProductReviewSummary;

  merchandising: ProductMerchandising;

  seo?: ProductSEO;

  status: ProductStatus;

  publishedAt?: string;

  createdAt: string;

  updatedAt: string;
}

/* ============================================================
   FILTERS
============================================================ */

export interface ProductFilters {
  category?: ProductCategory[];

  subcategory?: string[];

  productType?: ProductType[];

  collectionIds?: string[];

  tags?: string[];

  colorIds?: string[];

  sizeCodes?: string[];

  badges?: ProductBadge[];

  status?: ProductStatus[];

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

export function getVariantAvailableStock(
  variant: ProductVariant,
): number {
  return Math.max(
    0,
    variant.inventory.stock -
      variant.inventory.reserved,
  );
}

export function getVariantInventoryStatus(
  variant: ProductVariant,
):
  | "in-stock"
  | "low-stock"
  | "out-of-stock" {
  const available =
    getVariantAvailableStock(
      variant,
    );

  if (available <= 0) {
    return "out-of-stock";
  }

  if (
    available <=
    variant.inventory
      .lowStockThreshold
  ) {
    return "low-stock";
  }

  return "in-stock";
}

export function getDiscountPercentage(
  pricing: ProductPricing,
): number {
  if (
    pricing.mrp <= 0 ||
    pricing.sellingPrice >=
      pricing.mrp
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

export function getProductStartingPrice(
  product: Product,
): number {
  const prices =
    product.variants
      .filter(
        (variant) =>
          variant.status ===
          "active",
      )
      .map(
        (variant) =>
          variant.pricing
            .sellingPrice,
      );

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

export function getProductStartingMrp(
  product: Product,
): number {
  const prices =
    product.variants
      .filter(
        (variant) =>
          variant.status ===
          "active",
      )
      .map(
        (variant) =>
          variant.pricing.mrp,
      );

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

export function getProductColors(
  product: Product,
): ProductColor[] {
  const map =
    new Map<
      string,
      ProductColor
    >();

  for (const variant of product.variants) {
    map.set(
      variant.color.id,
      variant.color,
    );
  }

  return Array.from(
    map.values(),
  );
}

export function getProductSizes(
  product: Product,
): ProductSize[] {
  const map =
    new Map<
      string,
      ProductSize
    >();

  for (const variant of product.variants) {
    map.set(
      variant.size.code,
      variant.size,
    );
  }

  return Array.from(
    map.values(),
  ).sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}