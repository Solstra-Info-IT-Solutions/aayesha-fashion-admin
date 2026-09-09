import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api";

import type {
  CreateProductVariantInput,
  CreateProductVariantResponse,
  DeleteProductVariantResponse,
  GetProductVariantResponse,
  GetProductVariantsResponse,
  UpdateProductVariantInput,
  UpdateProductVariantResponse,
} from "@/types/product-variant";

const buildBasePath = (
  productId: string,
) => {
  return `/admin/products/${encodeURIComponent(
    productId,
  )}/variants`;
};

export async function getProductVariants(
  productId: string,
  accessToken?: string | null,
) {
  return apiGet<GetProductVariantsResponse>(
    buildBasePath(productId),
    accessToken,
  );
}

export async function getProductVariant(
  productId: string,
  variantId: string,
  accessToken?: string | null,
) {
  return apiGet<GetProductVariantResponse>(
    `${buildBasePath(
      productId,
    )}/${encodeURIComponent(variantId)}`,
    accessToken,
  );
}

export async function createProductVariant(
  productId: string,
  payload: CreateProductVariantInput,
  accessToken?: string | null,
) {
  return apiPost<CreateProductVariantResponse>(
    buildBasePath(productId),
    payload,
    accessToken,
  );
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  payload: UpdateProductVariantInput,
  accessToken?: string | null,
) {
  return apiPatch<UpdateProductVariantResponse>(
    `${buildBasePath(
      productId,
    )}/${encodeURIComponent(variantId)}`,
    payload,
    accessToken,
  );
}

export async function deleteProductVariant(
  productId: string,
  variantId: string,
  accessToken?: string | null,
) {
  return apiDelete<DeleteProductVariantResponse>(
    `${buildBasePath(
      productId,
    )}/${encodeURIComponent(variantId)}`,
    accessToken,
  );
}