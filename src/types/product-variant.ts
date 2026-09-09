import type {
  ProductColor,
  ProductInventory,
  ProductPricing,
  ProductSize,
  ProductVariant,
  VariantStatus,
} from "@/types/product";

/* =========================================================
   RE-EXPORT CANONICAL PRODUCT TYPES
========================================================= */

export type {
  ProductColor,
  ProductInventory,
  ProductPricing,
  ProductSize,
  ProductVariant,
  VariantStatus,
};

/* =========================================================
   API RESPONSE TYPES
========================================================= */

export interface GetProductVariantsResponse {
  success: true;

  data: {
    productId: string;
    variants: ProductVariant[];
  };
}

export interface GetProductVariantResponse {
  success: true;

  data: {
    productId: string;
    variant: ProductVariant;
  };
}

export interface CreateProductVariantResponse {
  success: true;

  data: {
    productId: string;
    variant: ProductVariant;
  };
}

export interface UpdateProductVariantResponse {
  success: true;

  data: {
    productId: string;
    variant: ProductVariant;
  };
}

export interface DeleteProductVariantResponse {
  success: true;

  data: {
    productId: string;
    variantId: string;
    deleted: boolean;
  };
}

/* =========================================================
   CREATE INPUT
========================================================= */

export interface CreateProductVariantInput {
  id: string;

  sku: string;

  barcode?: string;

  color: ProductColor;

  size: ProductSize;

  pricing: ProductPricing;

  /*
   * Inventory is required by the backend when
   * creating a new variant.
   */
  inventory: ProductInventory;

  mediaIds?: string[];

  weight?: number;

  status: VariantStatus;
}

/* =========================================================
   UPDATE INPUT
========================================================= */

export interface UpdateProductVariantInput {
  sku?: string;

  barcode?: string;

  color?: ProductColor;

  size?: ProductSize;

  pricing?: ProductPricing;

  /*
   * Inventory is deliberately excluded.
   *
   * Backend handles inventory through the
   * dedicated inventory module.
   */
  mediaIds?: string[];

  weight?: number;

  status?: VariantStatus;
}