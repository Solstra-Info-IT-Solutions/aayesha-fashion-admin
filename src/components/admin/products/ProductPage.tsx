"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useProducts } from "@/hooks/useProducts";
import { getCategories } from "@/services/catalog.service";
import { archiveProduct, deleteProduct, getAdminProducts } from "@/services/product-admin.service";
import type { Product, ProductListParams, ProductStatus } from "@/types/admin-product";

import ProductEmptyState from "./ProductEmptyState";
import ProductHeader from "./ProductHeader";
import ProductPagination from "./ProductPagination";
import ProductTable from "./ProductTable";
import ProductToolbar from "./ProductToolbar";

const TABS: Array<{ id: "all" | ProductStatus; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
];

const VIEW_KEY = "aayesha-admin-products-view";

type Pending = { type: "archive" | "delete"; product: Product } | null;

export default function ProductPage() {
  const { accessToken, isInitialized } = useAdminAuth();

  const [filters, setFilters] = useState<ProductListParams>({ page: 1, limit: 25, sort: "newest" });
  const [view, setView] = useState<"table" | "grid">("table");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [counts, setCounts] = useState<Partial<Record<"all" | ProductStatus, number>>>({});
  const [pending, setPending] = useState<Pending>(null);
  const [busy, setBusy] = useState(false);

  // Remember the preferred view.
  useEffect(() => {
    // Read after mount (asynchronously) so server and client markup match.
    Promise.resolve().then(() => {
      try {
        const saved = window.localStorage.getItem(VIEW_KEY);

        if (saved === "grid" || saved === "table") setView(saved);
      } catch {
        /* storage unavailable */
      }
    });
  }, []);

  const changeView = useCallback((next: "table" | "grid") => {
    setView(next);

    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    getCategories(accessToken, { page: 1, limit: 100 })
      .then((response) => {
        if (!cancelled) {
          setCategories(response.items.map((category) => ({ id: String(category.id), name: category.name })));
        }
      })
      // Names are a nicety: fall back to the raw id if this fails.
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const { products, pagination, loading, error, refresh } = useProducts(filters);

  // Counts for the status tabs.
  const loadCounts = useCallback(() => {
    if (!isInitialized || !accessToken) return () => undefined;

    let cancelled = false;

    Promise.allSettled(
      TABS.map((tab) =>
        getAdminProducts(
          { page: 1, limit: 1, ...(tab.id === "all" ? {} : { status: tab.id }) },
          accessToken,
        ),
      ),
    ).then((results) => {
      if (cancelled) return;

      const next: Partial<Record<"all" | ProductStatus, number>> = {};

      results.forEach((result, index) => {
        if (result.status === "fulfilled") next[TABS[index]!.id] = result.value.pagination.total;
      });

      setCounts(next);
    });

    return () => {
      cancelled = true;
    };
  }, [isInitialized, accessToken]);

  useEffect(() => loadCounts(), [loadCounts]);

  async function runPending() {
    if (!pending || !accessToken) return;

    setBusy(true);

    try {
      if (pending.type === "archive") {
        await archiveProduct(pending.product.id, accessToken);
        toast.success(`"${pending.product.name}" archived.`);
      } else {
        await deleteProduct(pending.product.id, accessToken);
        toast.success(`"${pending.product.name}" deleted.`);
      }

      setPending(null);
      await refresh();
      loadCounts();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "That action failed.");
    } finally {
      setBusy(false);
    }
  }

  const filtered = Boolean(
    filters.search ||
      filters.status ||
      filters.categoryId ||
      filters.inStockOnly ||
      filters.isNew ||
      filters.isFeatured ||
      filters.isBestSeller,
  );

  const activeTab = filters.status ?? "all";
  const reset = () => setFilters({ page: 1, limit: filters.limit ?? 25, sort: "newest" });

  return (
    <div className="space-y-6">
      <ProductHeader loading={loading} total={counts.all ?? pagination.total} onRefresh={() => void refresh()} />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Product status">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilters((current) => ({ ...current, status: tab.id === "all" ? undefined : tab.id, page: 1 }))}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                active
                  ? "border-[#26221d] bg-[#26221d] text-[#fffdf8] shadow-[0_6px_14px_-8px_rgba(38,34,29,0.7)]"
                  : "border-[#d6ccb6] bg-[#fffdf8] text-[#2a2520] hover:border-[#b08d57]"
              }`}
            >
              {tab.label}

              {count !== undefined ? (
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-white/15 text-[#fffdf8]" : "bg-[#efe8d8] text-[#5f584d]"}`}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <ProductToolbar
        categories={categories}
        filters={filters}
        onChange={setFilters}
        view={view}
        onViewChange={changeView}
      />

      {error ? (
        <div role="alert" className="rounded-lg border border-[#f5b5b1] bg-[#fdecec] px-4 py-3 text-sm text-[#8f1f19]">
          {error}
        </div>
      ) : null}

      {!loading && products.length === 0 ? (
        <ProductEmptyState filtered={filtered} onReset={reset} />
      ) : (
        <>
          <ProductTable
            categoryNames={categoryNames}
            products={products}
            loading={loading}
            view={view}
            onArchive={(product) => setPending({ type: "archive", product })}
            onDelete={(product) => setPending({ type: "delete", product })}
          />

          <ProductPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
          />
        </>
      )}

      <ConfirmDialog
        open={pending !== null}
        busy={busy}
        title={pending?.type === "delete" ? "Delete this product?" : "Archive this product?"}
        description={
          pending
            ? pending.type === "delete"
              ? `"${pending.product.name}" will be permanently removed and cannot be recovered.`
              : `"${pending.product.name}" will be hidden from the store. You can find it under the Archived tab.`
            : ""
        }
        confirmLabel={pending?.type === "delete" ? "Delete permanently" : "Archive"}
        tone={pending?.type === "delete" ? "danger" : "default"}
        onConfirm={() => void runPending()}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
