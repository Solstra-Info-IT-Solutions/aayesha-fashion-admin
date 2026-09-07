"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import {
  getAttributes,
  getBadges,
  getCategories,
  getCollections,
  getColors,
  getSizes,
  getTags,
} from "@/services/catalog.service";

import type {
  AttributeMaster,
  Badge,
  CatalogSort,
  CatalogStatusFilter,
  Category,
  Collection,
  ColorMaster,
  Pagination,
  SizeMaster,
  Tag,
} from "@/types/catalog";

export type CatalogResource =
  | "categories"
  | "collections"
  | "tags"
  | "badges"
  | "attributes"
  | "sizes"
  | "colors";

export type CatalogItem =
  | Category
  | Collection
  | Tag
  | Badge
  | AttributeMaster
  | SizeMaster
  | ColorMaster;

type UseCatalogOptions = {
  resource: CatalogResource;
  page?: number;
  limit?: number;
  search?: string;
  isActive?: CatalogStatusFilter;
  sort?: CatalogSort;
};

export function useCatalog({
  resource,
  page = 1,
  limit = 20,
  search = "",
  isActive = "all",
  sort = "sort_order",
}: UseCatalogOptions) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const [
    items,
    setItems,
  ] = useState<CatalogItem[]>([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const load = useCallback(
    async () => {
      if (
        !isInitialized ||
        !isAuthenticated ||
        !accessToken
      ) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit,
          search,
          isActive,
          sort,
        };

        let result;

        switch (resource) {
          case "categories":
            result =
              await getCategories(
                accessToken,
                params,
              );
            break;

          case "collections":
            result =
              await getCollections(
                accessToken,
                params,
              );
            break;

          case "tags":
            result =
              await getTags(
                accessToken,
                params,
              );
            break;

          case "badges":
            result =
              await getBadges(
                accessToken,
                params,
              );
            break;

          case "attributes":
            result =
              await getAttributes(
                accessToken,
                params,
              );
            break;

          case "sizes":
            result =
              await getSizes(
                accessToken,
                params,
              );
            break;

          case "colors":
            result =
              await getColors(
                accessToken,
                params,
              );
            break;

          default:
            throw new Error(
              "Unsupported catalog resource.",
            );
        }

        setItems(result.items);
        setPagination(
          result.pagination,
        );
      } catch (err) {
        setItems([]);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load catalog data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      accessToken,
      isAuthenticated,
      isInitialized,
      page,
      limit,
      search,
      isActive,
      sort,
      resource,
    ],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    items,
    pagination,
    loading,
    error,
    refresh: load,
  };
}