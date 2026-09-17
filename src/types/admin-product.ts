import type {
  Product,
  ProductContent,
  ProductMedia,
  ProductMerchandising,
  ProductSEO,
  ProductPricing,
  ProductInventory,
} from "@/types/product";

export type {
  Product,
  ProductContent,
  ProductMedia,
  ProductMerchandising,
  ProductSEO,
  ProductPricing,
  ProductInventory,
};

/* =========================================================
   PRODUCT STATUS
========================================================= */

export type ProductStatus =
  | "draft"
  | "active"
  | "archived"
  | "discontinued";

/* =========================================================
   PRODUCT SORT
========================================================= */

export type ProductSort =
  | "relevance"
  | "newest"
  | "price-low"
  | "price-high"
  | "best-selling"
  | "featured";

/* =========================================================
   PRODUCT LIST
========================================================= */

export type ProductListParams = {
  page?: number;
  limit?: number;

  search?: string;

  status?: ProductStatus;

  categoryId?: string;

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
};

/* =========================================================
   PRODUCT UPDATE
========================================================= */

export type ProductUpdateInput = {
  name?: string;

  slug?: string;

  categoryId?: string;

  pricing?: ProductPricing;

  inventory?: ProductInventory;

  content?: ProductContent;
};

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

/* =========================================================
   DELETE
========================================================= */

export type DeleteProductResponse = {
  success: true;

  data: {
    productId: string;

    deleted: true;
  };
};