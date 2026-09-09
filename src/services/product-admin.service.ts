import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
} from "@/lib/api";

import type {
  Product,
  ProductCreateInput,
  ProductListParams,
  ProductListResponse,
  ProductMediaInput,
  ProductMerchandisingInput,
  ProductPagination,
  ProductResponse,
  ProductSeoInput,
  ProductUpdateInput,
  PublishProductInput,
} from "@/types/admin-product";

import type {
  ProductVariant,
} from "@/types/product";

function buildQuery(
  params: ProductListParams = {},
): string {
  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "page",
    String(params.page ?? 1),
  );

  searchParams.set(
    "limit",
    String(params.limit ?? 25),
  );

  const entries: Array<
    [string, string | number | boolean | undefined]
  > = [
    ["search", params.search],
    ["status", params.status],
    ["category", params.category],
    ["productType", params.productType],
    ["collection", params.collection],
    ["color", params.color],
    ["size", params.size],
    ["badge", params.badge],
    ["minPrice", params.minPrice],
    ["maxPrice", params.maxPrice],
    [
      "inStockOnly",
      params.inStockOnly,
    ],
    ["isNew", params.isNew],
    [
      "isBestSeller",
      params.isBestSeller,
    ],
    [
      "isFeatured",
      params.isFeatured,
    ],
    ["sort", params.sort],
  ];

  entries.forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== ""
      ) {
        searchParams.set(
          key,
          String(value),
        );
      }
    },
  );

  return searchParams.toString();
}

export async function getAdminProducts(
  params: ProductListParams = {},
  accessToken?: string | null,
): Promise<{
  products: Product[];
  pagination: ProductPagination;
}> {
  const response =
    await apiGet<ProductListResponse>(
      `/admin/products?${buildQuery(
        params,
      )}`,
      accessToken,
    );

  return response.data;
}

export async function getAdminProduct(
  id: string,
  accessToken?: string | null,
): Promise<Product> {
  const response =
    await apiGet<ProductResponse>(
      `/admin/products/${encodeURIComponent(
        id,
      )}`,
      accessToken,
    );

  return response.data.product;
}

export async function createAdminProduct(
  input: ProductCreateInput,
  accessToken?: string | null,
): Promise<Product> {
  const response =
    await apiPost<ProductResponse>(
      "/admin/products",
      input,
      accessToken,
    );

  return response.data.product;
}

export async function updateAdminProduct(
  id: string,
  input: ProductUpdateInput,
  accessToken?: string | null,
): Promise<Product> {
  const response =
    await apiPatch<ProductResponse>(
      `/admin/products/${encodeURIComponent(
        id,
      )}`,
      input,
      accessToken,
    );

  return response.data.product;
}

/*
 * -------------------------------------------------------
 * MEDIA
 * -------------------------------------------------------
 */

export async function getProductMedia(
  productId: string,
  accessToken?: string | null,
) {
  return apiGet<{
    success: true;
    data: {
      productId: string;
      media: Product["media"];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/media`,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function addProductMedia(
  productId: string,
  media: ProductMediaInput,
  accessToken?: string | null,
) {
  return apiPost<{
    success: true;
    data: {
      productId: string;
      media: Product["media"][number];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/media`,
    media,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function updateProductMedia(
  productId: string,
  mediaId: string,
  media: Partial<ProductMediaInput>,
  accessToken?: string | null,
) {
  return apiPatch<{
    success: true;
    data: {
      productId: string;
      media: Product["media"][number];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/media/${encodeURIComponent(
      mediaId,
    )}`,
    media,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function deleteProductMedia(
  productId: string,
  mediaId: string,
  accessToken?: string | null,
) {
  return apiDelete<{
    success: true;
    data: {
      productId: string;
      mediaId: string;
      deleted: boolean;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/media/${encodeURIComponent(
      mediaId,
    )}`,
    accessToken,
  );
}

/*
 * -------------------------------------------------------
 * SEO
 * -------------------------------------------------------
 */

export async function getProductSeo(
  productId: string,
  accessToken?: string | null,
) {
  return apiGet<{
    success: true;
    data: {
      productId: string;
      seo: Product["seo"] | null;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/seo`,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function saveProductSeo(
  productId: string,
  input: ProductSeoInput,
  accessToken?: string | null,
) {
  return apiPut<{
    success: true;
    data: {
      productId: string;
      seo: Product["seo"];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/seo`,
    input,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function deleteProductSeo(
  productId: string,
  accessToken?: string | null,
) {
  return apiDelete<{
    success: true;
    data: {
      productId: string;
      seo: null;
      deleted: boolean;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/seo`,
    accessToken,
  );
}

/*
 * -------------------------------------------------------
 * MERCHANDISING
 * -------------------------------------------------------
 */

export async function getProductMerchandising(
  productId: string,
  accessToken?: string | null,
) {
  return apiGet<{
    success: true;
    data: {
      productId: string;
      merchandising: Product["merchandising"];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/merchandising`,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function saveProductMerchandising(
  productId: string,
  input: ProductMerchandisingInput,
  accessToken?: string | null,
) {
  return apiPut<{
    success: true;
    data: {
      productId: string;
      merchandising: Product["merchandising"];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/merchandising`,
    input,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

/*
 * -------------------------------------------------------
 * PUBLISH
 * -------------------------------------------------------
 */

export async function publishProduct(
  productId: string,
  input: PublishProductInput,
  accessToken?: string | null,
) {
  return apiPatch<{
    success: true;
    data: {
      productId: string;
      status: Product["status"];
      publishedAt: string | null;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/publish`,
    input,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function archiveProduct(
  productId: string,
  accessToken?: string | null,
) {
  return apiPatch<{
    success: true;
    data: {
      productId: string;
      status: Product["status"];
      archived: boolean;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/archive`,
    {},
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function unpublishProduct(
  productId: string,
  accessToken?: string | null,
) {
  return apiPatch<{
    success: true;
    data: {
      productId: string;
      status: Product["status"];
      unpublished: boolean;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/unpublish`,
    {},
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

/*
 * -------------------------------------------------------
 * VARIANTS
 * -------------------------------------------------------
 */

export async function getProductVariants(
  productId: string,
  accessToken?: string | null,
) {
  return apiGet<{
    success: true;
    data: {
      productId: string;
      variants: ProductVariant[];
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/variants`,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function getProductVariant(
  productId: string,
  variantId: string,
  accessToken?: string | null,
) {
  return apiGet<{
    success: true;
    data: {
      productId: string;
      variant: ProductVariant;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/variants/${encodeURIComponent(
      variantId,
    )}`,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function createProductVariant(
  productId: string,
  input: ProductVariant,
  accessToken?: string | null,
) {
  return apiPost<{
    success: true;
    data: {
      productId: string;
      variant: ProductVariant;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/variants`,
    input,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  input: Partial<ProductVariant>,
  accessToken?: string | null,
) {
  return apiPatch<{
    success: true;
    data: {
      productId: string;
      variant: ProductVariant;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/variants/${encodeURIComponent(
      variantId,
    )}`,
    input,
    accessToken,
  ).then(
    (response) =>
      response.data,
  );
}

export async function deleteProductVariant(
  productId: string,
  variantId: string,
  accessToken?: string | null,
) {
  return apiDelete<{
    success: true;
    data: {
      productId: string;
      variantId: string;
      deleted: boolean;
    };
  }>(
    `/admin/products/${encodeURIComponent(
      productId,
    )}/variants/${encodeURIComponent(
      variantId,
    )}`,
    accessToken,
  );
}