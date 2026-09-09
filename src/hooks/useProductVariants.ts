"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  createProductVariant,
  deleteProductVariant,
  getProductVariants,
  updateProductVariant,
} from "@/services/product-variant.service";

import type {
  CreateProductVariantInput,
  ProductVariant,
  UpdateProductVariantInput,
} from "@/types/product-variant";

export function useProductVariants(
  productId: string,
) {
  const {
    isAuthenticated,
    isLoading: authLoading,
    accessToken,
  } = useAdminAuth();

  const [variants, setVariants] =
    useState<ProductVariant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchVariants =
    useCallback(async () => {
      if (
        !productId ||
        !isAuthenticated ||
        !accessToken
      ) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await getProductVariants(
            productId,
            accessToken,
          );

        setVariants(
          response.data.variants,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product variants.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      productId,
      isAuthenticated,
      accessToken,
    ]);

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated ||
      !accessToken ||
      !productId
    ) {
      return;
    }

    void fetchVariants();
  }, [
    authLoading,
    isAuthenticated,
    accessToken,
    productId,
    fetchVariants,
  ]);

  const createVariant = useCallback(
    async (
      payload: CreateProductVariantInput,
    ) => {
      if (!accessToken) {
        throw new Error(
          "Your admin session has expired. Please login again.",
        );
      }

      setActionLoading(true);

      try {
        const response =
          await createProductVariant(
            productId,
            payload,
            accessToken,
          );

        await fetchVariants();

        return response.data.variant;
      } finally {
        setActionLoading(false);
      }
    },
    [
      productId,
      accessToken,
      fetchVariants,
    ],
  );

  const updateVariant = useCallback(
    async (
      variantId: string,
      payload: UpdateProductVariantInput,
    ) => {
      if (!accessToken) {
        throw new Error(
          "Your admin session has expired. Please login again.",
        );
      }

      setActionLoading(true);

      try {
        const response =
          await updateProductVariant(
            productId,
            variantId,
            payload,
            accessToken,
          );

        await fetchVariants();

        return response.data.variant;
      } finally {
        setActionLoading(false);
      }
    },
    [
      productId,
      accessToken,
      fetchVariants,
    ],
  );

  const removeVariant = useCallback(
    async (
      variantId: string,
    ) => {
      if (!accessToken) {
        throw new Error(
          "Your admin session has expired. Please login again.",
        );
      }

      setActionLoading(true);

      try {
        await deleteProductVariant(
          productId,
          variantId,
          accessToken,
        );

        await fetchVariants();
      } finally {
        setActionLoading(false);
      }
    },
    [
      productId,
      accessToken,
      fetchVariants,
    ],
  );

  return {
    variants,
    loading:
      authLoading || loading,
    actionLoading,
    error,
    refresh: fetchVariants,
    createVariant,
    updateVariant,
    removeVariant,
  };
}