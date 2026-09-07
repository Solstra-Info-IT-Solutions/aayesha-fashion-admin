export type CatalogStatusFilter =
  | "true"
  | "false"
  | "all";

export type CatalogSort =
  | "newest"
  | "oldest"
  | "name"
  | "sort_order";

export type CatalogResource =
  | "categories"
  | "collections"
  | "tags"
  | "badges"
  | "attributes"
  | "sizes"
  | "colors";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CatalogListResponse<T> = {
  success: true;
  data: {
    items: T[];
    pagination: Pagination;
  };
};

/* =========================================================
   FORM STATE
========================================================= */

export type CatalogFormState = Record<
  string,
  string | boolean
>;

/* =========================================================
   CATEGORY
========================================================= */

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   COLLECTION
========================================================= */

export type Collection = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   TAG
========================================================= */

export type Tag = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   BADGE
========================================================= */

export type BadgeTone =
  | "neutral"
  | "rose"
  | "dark"
  | "success"
  | "warning"
  | "danger";

export type Badge = {
  _id: string;
  name: string;
  slug: string;
  label: string;
  tone: BadgeTone;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   ATTRIBUTE
========================================================= */

export type AttributeType =
  | "text"
  | "number"
  | "boolean"
  | "single_select"
  | "multi_select";

export type AttributeMaster = {
  _id: string;
  key: string;
  label: string;
  type: AttributeType;
  options: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   SIZE
========================================================= */

export type SizeMaster = {
  _id: string;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   COLOR
========================================================= */

export type ColorMaster = {
  _id: string;
  name: string;
  slug: string;
  hex: string | null;
  swatchImage: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/* =========================================================
   CREATE INPUTS
========================================================= */

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type CreateCollectionInput = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
};

export type CreateTagInput = {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
};

export type CreateBadgeInput = {
  name: string;
  slug: string;
  label: string;
  tone?: BadgeTone;
  sortOrder?: number;
  isActive?: boolean;
};

export type CreateAttributeInput = {
  key: string;
  label: string;
  type: AttributeType;
  options?: string[];
  isActive?: boolean;
  sortOrder?: number;
};

export type CreateSizeInput = {
  code: string;
  label: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type CreateColorInput = {
  name: string;
  slug: string;
  hex?: string | null;
  swatchImage?: string;
  sortOrder?: number;
  isActive?: boolean;
};