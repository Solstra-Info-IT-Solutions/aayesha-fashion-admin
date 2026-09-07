import {
  apiGet,
  apiPost,
  apiPatch,
} from "@/lib/api";

import type {
  Badge,
  CatalogListResponse,
  CatalogSort,
  CatalogStatusFilter,
  Category,
  Collection,
  Tag,
  AttributeMaster,
  SizeMaster,
  ColorMaster,
  CreateBadgeInput,
  CreateCategoryInput,
  CreateCollectionInput,
  CreateTagInput,
  CreateAttributeInput,
  CreateSizeInput,
  CreateColorInput,
} from "@/types/catalog";

export type CatalogListParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: CatalogStatusFilter;
  sort?: CatalogSort;
};

function buildQuery(
  params: CatalogListParams = {},
): string {
  const query =
    new URLSearchParams();

  query.set(
    "page",
    String(params.page ?? 1),
  );

  query.set(
    "limit",
    String(params.limit ?? 20),
  );

  if (params.search?.trim()) {
    query.set(
      "search",
      params.search.trim(),
    );
  }

  query.set(
    "isActive",
    params.isActive ?? "all",
  );

  query.set(
    "sort",
    params.sort ?? "sort_order",
  );

  return query.toString();
}

/* =========================================================
   CATEGORIES
========================================================= */

export async function getCategories(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<Category>
    >(
      `/admin/catalog/categories?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createCategory(
  input: CreateCategoryInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: Category;
    }>(
      "/admin/catalog/categories",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateCategory(
  id: string,
  input: Partial<CreateCategoryInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: Category;
    }>(
      `/admin/catalog/categories/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   COLLECTIONS
========================================================= */

export async function getCollections(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<Collection>
    >(
      `/admin/catalog/collections?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createCollection(
  input: CreateCollectionInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: Collection;
    }>(
      "/admin/catalog/collections",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateCollection(
  id: string,
  input: Partial<CreateCollectionInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: Collection;
    }>(
      `/admin/catalog/collections/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   TAGS
========================================================= */

export async function getTags(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<Tag>
    >(
      `/admin/catalog/tags?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createTag(
  input: CreateTagInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: Tag;
    }>(
      "/admin/catalog/tags",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateTag(
  id: string,
  input: Partial<CreateTagInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: Tag;
    }>(
      `/admin/catalog/tags/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   BADGES
========================================================= */

export async function getBadges(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<Badge>
    >(
      `/admin/catalog/badges?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createBadge(
  input: CreateBadgeInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: Badge;
    }>(
      "/admin/catalog/badges",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateBadge(
  id: string,
  input: Partial<CreateBadgeInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: Badge;
    }>(
      `/admin/catalog/badges/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   ATTRIBUTES
========================================================= */

export async function getAttributes(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<AttributeMaster>
    >(
      `/admin/catalog/attributes?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createAttribute(
  input: CreateAttributeInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: AttributeMaster;
    }>(
      "/admin/catalog/attributes",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateAttribute(
  id: string,
  input: Partial<CreateAttributeInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: AttributeMaster;
    }>(
      `/admin/catalog/attributes/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   SIZES
========================================================= */

export async function getSizes(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<SizeMaster>
    >(
      `/admin/catalog/sizes?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createSize(
  input: CreateSizeInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: SizeMaster;
    }>(
      "/admin/catalog/sizes",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateSize(
  id: string,
  input: Partial<CreateSizeInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: SizeMaster;
    }>(
      `/admin/catalog/sizes/${id}`,
      input,
      accessToken,
    );

  return response.data;
}

/* =========================================================
   COLORS
========================================================= */

export async function getColors(
  accessToken: string,
  params: CatalogListParams = {},
) {
  const response =
    await apiGet<
      CatalogListResponse<ColorMaster>
    >(
      `/admin/catalog/colors?${buildQuery(params)}`,
      accessToken,
    );

  return response.data;
}

export async function createColor(
  input: CreateColorInput,
  accessToken: string,
) {
  const response =
    await apiPost<{
      success: true;
      data: ColorMaster;
    }>(
      "/admin/catalog/colors",
      input,
      accessToken,
    );

  return response.data;
}

export async function updateColor(
  id: string,
  input: Partial<CreateColorInput>,
  accessToken: string,
) {
  const response =
    await apiPatch<{
      success: true;
      data: ColorMaster;
    }>(
      `/admin/catalog/colors/${id}`,
      input,
      accessToken,
    );

  return response.data;
}