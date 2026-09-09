"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useProducts,
} from "@/hooks/useProducts";

import {
  archiveProduct,
} from "@/services/product-admin.service";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import type {
  Product,
  ProductListParams,
} from "@/types/admin-product";

import ProductHeader from "./ProductHeader";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductEmptyState from "./ProductEmptyState";

export default function ProductPage() {
  const {
    accessToken,
  } = useAdminAuth();

  const [filters, setFilters] =
    useState<ProductListParams>({
      page: 1,
      limit: 25,
      sort: "newest",
    });

  const {
    products,
    pagination,
    loading,
    error,
    refresh,
  } = useProducts(filters);

  const archive = async (
    product: Product,
  ) => {
    if (
      !accessToken ||
      product.status ===
        "archived"
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Archive "${product.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await archiveProduct(
        product.id,
        accessToken,
      );

      await refresh();
    } catch (reason) {
      window.alert(
        reason instanceof Error
          ? reason.message
          : "Unable to archive product.",
      );
    }
  };

  const hasProducts =
    products.length > 0;

  const filterKey = useMemo(
    () =>
      JSON.stringify(
        filters,
      ),
    [filters],
  );

  void filterKey;

  return (
    <div className="space-y-6">
      <ProductHeader
        loading={loading}
        onRefresh={() =>
          void refresh()
        }
      />

      <ProductToolbar
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <div className="rounded-xl border border-[#f0d1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
          {error}
        </div>
      )}

      {hasProducts ? (
        <>
          <ProductTable
            products={products}
            loading={loading}
            onArchive={archive}
          />

          <ProductPagination
            page={
              pagination.page
            }
            totalPages={
              pagination.totalPages
            }
            total={
              pagination.total
            }
            onPageChange={(
              page,
            ) =>
              setFilters(
                (
                  current,
                ) => ({
                  ...current,
                  page,
                }),
              )
            }
          />
        </>
      ) : loading ? (
        <ProductTable
          products={[]}
          loading
          onArchive={
            archive
          }
        />
      ) : (
        <ProductEmptyState />
      )}
    </div>
  );
}