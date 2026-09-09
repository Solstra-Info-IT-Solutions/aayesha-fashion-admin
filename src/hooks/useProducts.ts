"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  getAdminProducts,
} from "@/services/product-admin.service";

import type {
  Product,
  ProductListParams,
  ProductPagination,
} from "@/types/admin-product";

export function useProducts(
  params: ProductListParams,
) {
  const {
    accessToken,
    isInitialized,
    isAuthenticated,
  } = useAdminAuth();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<ProductPagination>({
      page: 1,
      limit: 25,
      total: 0,
      totalPages: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const refresh =
    useCallback(async () => {
      if (
        !isInitialized ||
        !isAuthenticated ||
        !accessToken
      ) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await getAdminProducts(
            params,
            accessToken,
          );

        setProducts(
          result.products,
        );

        setPagination(
          result.pagination,
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load products.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      accessToken,
      isAuthenticated,
      isInitialized,
      params,
    ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    products,
    pagination,
    loading,
    error,
    refresh,
  };
}