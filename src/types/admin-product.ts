import type {
  Product,
  ProductAttributes,
  ProductContent,
  ProductFAQ,
  ProductMedia,
  ProductMerchandising,
  ProductPricing,
  ProductSEO,
  ProductVariant,
} from "@/types/product";

export type {
  Product,
  ProductAttributes,
  ProductContent,
  ProductFAQ,
  ProductMedia,
  ProductMerchandising,
  ProductPricing,
  ProductSEO,
  ProductVariant,
};

/* =========================================================
   PRODUCT ENUMS
========================================================= */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived"
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

export type ProductSort =
  | "relevance"
  | "newest"
  | "price-low"
  | "price-high"
  | "rating"
  | "best-selling"
  | "featured";

/* =========================================================
   SIZE CHART
========================================================= */

export type SizeChartUnit =
  | "inch"
  | "cm";

export type SizeMeasurement = {
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
};

export type SizeChart = {
  unit: SizeChartUnit;
  measurements: SizeMeasurement[];
  fitNote?: string;
};

/* =========================================================
   PRODUCT LIST
========================================================= */

export type ProductListParams = {
  page?: number;
  limit?: number;

  search?: string;

  status?: ProductStatus;

  category?: ProductCategory;

  productType?: ProductType;

  collection?: string;

  color?: string;

  size?: string;

  badge?: string;

  minPrice?: number;

  maxPrice?: number;

  inStockOnly?: boolean;

  isNew?: boolean;

  isBestSeller?: boolean;

  isFeatured?: boolean;

  sort?: ProductSort;
};

/* =========================================================
   PAGINATION
========================================================= */

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/* =========================================================
   API RESPONSES
========================================================= */

export type ProductListResponse = {
  success: true;
  data: {
    products: Product[];
    pagination: ProductPagination;
  };
};

export type ProductResponse = {
  success: true;
  data: {
    product: Product;
  };
};

/* =========================================================
   PRODUCT CREATE
========================================================= */

export type ProductCreateInput = {
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

  sizeChart?: SizeChart;

  variants: ProductVariant[];

  faqs?: ProductFAQ[];

  merchandising: ProductMerchandising;

  seo?: ProductSEO;

  status: ProductStatus;
};

/* =========================================================
   PRODUCT UPDATE
========================================================= */

/*
 * These fields are intentionally excluded from the
 * general product update endpoint because the backend
 * handles them through dedicated permission-specific
 * endpoints:
 *
 * - status
 * - media
 * - variants
 * - merchandising
 * - seo
 */

export type ProductUpdateInput = Partial<
  Omit<
    ProductCreateInput,
    | "id"
    | "status"
    | "media"
    | "variants"
    | "merchandising"
    | "seo"
  >
>;

/* =========================================================
   SEO
========================================================= */

export type ProductSeoInput = {
  title?: string;

  description?: string;

  keywords?: string[];

  canonical?: string;

  noIndex?: boolean;
};

export type ProductSeoResponse = {
  success: true;
  data: {
    productId: string;
    seo: ProductSEO | null;
  };
};

/* =========================================================
   MERCHANDISING
========================================================= */

export type ProductMerchandisingInput = {
  isNew: boolean;

  isFeatured: boolean;

  isBestSeller: boolean;

  badges: Array<
    | "new"
    | "best-seller"
    | "featured"
    | "exclusive"
    | "limited"
    | "sale"
    | "trending"
    | "back-in-stock"
  >;

  ranking?: number;
};

export type ProductMerchandisingResponse = {
  success: true;
  data: {
    productId: string;
    merchandising: ProductMerchandising;
  };
};

/* =========================================================
   PUBLISH
========================================================= */

export type PublishProductInput = {
  status:
    | "draft"
    | "active"
    | "discontinued";

  publishedAt?: string;
};

export type PublishProductResponse = {
  success: true;
  data: {
    productId: string;
    status: ProductStatus;
    publishedAt: string | null;
  };
};

/* =========================================================
   MEDIA
========================================================= */

export type ProductMediaInput =
  ProductMedia;

export type ProductMediaResponse = {
  success: true;
  data: {
    productId: string;
    media: ProductMedia;
  };
};

export type ProductMediaListResponse = {
  success: true;
  data: {
    productId: string;
    media: ProductMedia[];
  };
};

/* =========================================================
   VARIANTS
========================================================= */

export type ProductVariantsResponse = {
  success: true;
  data: {
    productId: string;
    variants: ProductVariant[];
  };
};

export type ProductVariantResponse = {
  success: true;
  data: {
    productId: string;
    variant: ProductVariant;
  };
};

/* =========================================================
   PRODUCT ARCHIVE
========================================================= */

export type ArchiveProductResponse = {
  success: true;
  data: {
    productId: string;
    status: "archived";
    archived: true;
  };
};

/* =========================================================
   UNPUBLISH
========================================================= */

export type UnpublishProductResponse = {
  success: true;
  data: {
    productId: string;
    status: "draft";
    unpublished: true;
  };
};