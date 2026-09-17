"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  useProductEditor,
} from "@/hooks/useProductEditor";

import type {
  ProductSEO,
} from "@/types/admin-product";

import ProductBasicSection from "./ProductBasicSection";
import ProductContentSection from "./ProductContentSection";
import ProductMediaSection from "./ProductMediaSection";
import ProductSeoSection from "./ProductSeoSection";
import ProductMerchandisingSection from "./ProductMerchandisingSection";
import ProductPublishSection from "./ProductPublishSection";

interface ProductEditorProps {
  productId?: string;
}

/* =========================================================
   INPUT STYLES
========================================================= */

const inputClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]";

/* =========================================================
   PRODUCT EDITOR
========================================================= */

export default function ProductEditor({
  productId,
}: ProductEditorProps) {
  const router = useRouter();

  /* =======================================================
     ADMIN AUTH
  ======================================================= */

  const {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading:
      authLoading,
  } = useAdminAuth();

  /* =======================================================
     PRODUCT EDITOR
  ======================================================= */

  const {
    product,
    updateProduct,
    loading,
    saving,
    actionLoading,
    error,
    create,
    saveBasic,
    saveMedia,
    removeMedia,
    saveSeo,
    saveMerchandising,
    publish,
    moveToDraft,
    archive,
    unpublish,
    deleteProduct,
  } = useProductEditor({
    productId,
  });

  const isEdit =
    Boolean(productId);

  const [
    formError,
    setFormError,
  ] = useState<string | null>(
    null,
  );

  /* =======================================================
     AUTH / ERROR STATE
  ======================================================= */

  useEffect(() => {
    if (error) {
      setFormError(error);
      return;
    }

    if (
      isInitialized &&
      !authLoading &&
      !isAuthenticated
    ) {
      setFormError(
        "Authentication is required. Please login again.",
      );
    }
  }, [
    error,
    isInitialized,
    authLoading,
    isAuthenticated,
  ]);

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const handleDeleteProduct =
    async () => {
      if (
        !isEdit ||
        !productId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete this product? This action cannot be undone.",
        );

      if (!confirmed) {
        return;
      }

      setFormError(null);

      try {
        await deleteProduct();

        router.replace(
          "/admin/products",
        );
      } catch (reason) {
        setFormError(
          reason instanceof Error
            ? reason.message
            : "Unable to delete product.",
        );
      }
    };

  /* =======================================================
     SAVE / CREATE
  ======================================================= */

  const saveMain =
    async () => {
      setFormError(null);

      /*
       * Authentication must be initialized
       * before any API operation.
       */

      if (!isInitialized) {
        setFormError(
          "Authentication is still initializing. Please wait.",
        );

        return;
      }

      if (
        !isAuthenticated ||
        !accessToken
      ) {
        setFormError(
          "Authentication is required. Please login again.",
        );

        return;
      }

      try {
        /* ================================================
           CREATE
        ================================================ */

        if (!isEdit) {
          const created =
            await create();

          if (!created?.id) {
            setFormError(
              "Product was created, but no product ID was returned.",
            );

            return;
          }

          /*
           * Open the newly created product
           * in edit mode so media and
           * advanced settings can be added.
           */

          router.replace(
            `/admin/products/${encodeURIComponent(
              created.id,
            )}`,
          );

          return;
        }

        /* ================================================
           EDIT
        ================================================ */

        await saveBasic();
      } catch (reason) {
        setFormError(
          reason instanceof Error
            ? reason.message
            : "Unable to save product.",
        );
      }
    };

  /* =======================================================
     AUTH INITIALIZATION
  ======================================================= */

  if (
    !isInitialized ||
    authLoading
  ) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-24 min-w-0 animate-pulse rounded-2xl bg-[#f5f1ec]"
          />
        ))}
      </div>
    );
  }

  /* =======================================================
     NOT AUTHENTICATED
  ======================================================= */

  if (
    !isAuthenticated ||
    !accessToken
  ) {
    return (
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[#f0d1d1] bg-[#fff5f5] p-4 sm:p-5">
        <p className="break-words text-sm font-semibold leading-5 text-[#a33a3a]">
          Authentication is required.
        </p>

        <p className="mt-2 break-words text-sm leading-5 text-[#6f706f]">
          Your admin session is no longer
          available. Please login again to
          continue.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/login",
            )
          }
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:opacity-90"
        >
          Login Again
        </button>
      </div>
    );
  }

  /* =======================================================
     PRODUCT LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-24 min-w-0 animate-pulse rounded-2xl bg-[#f5f1ec]"
          />
        ))}
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="min-w-0 w-full space-y-5 overflow-x-hidden pb-10">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex min-w-0 flex-col gap-4 border-b border-[#e7e2dd] pb-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products",
              )
            }
            className="mb-3 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-[#6f706f] transition hover:text-[#171717]"
          >
            <ArrowLeft
              size={13}
              className="shrink-0"
            />

            <span>
              Products
            </span>
          </button>

          <p className="break-words text-[11px] uppercase tracking-[0.16em] text-[#969696]">
            {isEdit
              ? "Edit Product"
              : "New Product"}
          </p>

          <h1 className="mt-1 max-w-full break-words text-xl font-semibold leading-7 text-[#171717] sm:text-2xl">
            {product.name ||
              "Untitled Product"}
          </h1>

          {product.id && (
            <p className="mt-1 max-w-full break-all text-[11px] leading-5 text-[#969696]">
              ID: {product.id}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            void saveMain()
          }
          disabled={saving}
          className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <Save
            size={15}
            className="shrink-0"
          />

          <span className="truncate">
            {saving
              ? "Saving..."
              : isEdit
                ? "Save Product"
                : "Create Product"}
          </span>
        </button>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {formError && (
        <div className="min-w-0 overflow-hidden rounded-xl border border-[#f0d1d1] bg-[#fff5f5] px-3.5 py-3 text-sm leading-5 text-[#a33a3a]">
          <p className="break-words">
            {formError}
          </p>
        </div>
      )}

      {/* ===================================================
          CONTENT GRID
      =================================================== */}

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="min-w-0 space-y-5">

          {/* ===============================================
              BASIC
          =============================================== */}

          <ProductBasicSection
            name={
              product.name
            }
            categoryId={
              product.categoryId
            }
            onChange={(
              values,
            ) => {
              if (
                values.name !==
                undefined
              ) {
                updateProduct(
                  "name",
                  values.name,
                );
              }

              if (
                values.categoryId !==
                undefined
              ) {
                updateProduct(
                  "categoryId",
                  values.categoryId,
                );
              }
            }}
          />

          {/* ===============================================
              CONTENT
          =============================================== */}

          <ProductContentSection
            content={
              product.content
            }
            onChange={(
              value,
            ) =>
              updateProduct(
                "content",
                value,
              )
            }
          />

          {/* ===============================================
              PRICING
          =============================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">

            <div>
              <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
                Pricing
              </h2>

              <p className="mt-1 break-words text-sm leading-5 text-[#6f706f]">
                Set the product MRP and
                selling price.
              </p>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

              {/* MRP */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                  Price / MRP
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    product.pricing
                      .mrp
                  }
                  onChange={(
                    event,
                  ) =>
                    updateProduct(
                      "pricing",
                      {
                        ...product.pricing,
                        mrp:
                          Number(
                            event
                              .target
                              .value,
                          ) || 0,
                      },
                    )
                  }
                  placeholder="1500"
                  className={
                    inputClassName
                  }
                />
              </label>

              {/* SELLING PRICE */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                  Sale Price
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    product
                      .pricing
                      .sellingPrice
                  }
                  onChange={(
                    event,
                  ) =>
                    updateProduct(
                      "pricing",
                      {
                        ...product.pricing,
                        sellingPrice:
                          Number(
                            event
                              .target
                              .value,
                          ) || 0,
                      },
                    )
                  }
                  placeholder="1299"
                  className={
                    inputClassName
                  }
                />
              </label>
            </div>

            {/* DISCOUNT */}

            {product.pricing
              .mrp > 0 &&
              product.pricing
                .sellingPrice <
                product.pricing
                  .mrp && (
                <div className="mt-4 rounded-xl bg-[#fcf3f4] px-4 py-3">
                  <p className="text-sm text-[#6f706f]">
                    Discount
                  </p>

                  <p className="mt-1 text-lg font-semibold text-[#171717]">
                    {Math.round(
                      ((product
                        .pricing
                        .mrp -
                        product
                          .pricing
                          .sellingPrice) /
                        product
                          .pricing
                          .mrp) *
                        100,
                    )}
                    % OFF
                  </p>
                </div>
              )}
          </section>

          {/* ===============================================
              INVENTORY
          =============================================== */}

          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">

            <div>
              <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
                Stock
              </h2>

              <p className="mt-1 break-words text-sm leading-5 text-[#6f706f]">
                Manage the available product
                quantity.
              </p>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

              {/* TOTAL STOCK */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                  Total Quantity
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    product
                      .inventory
                      .stock
                  }
                  onChange={(
                    event,
                  ) =>
                    updateProduct(
                      "inventory",
                      {
                        ...product.inventory,
                        stock:
                          Math.max(
                            0,
                            Math.floor(
                              Number(
                                event
                                  .target
                                  .value,
                              ) ||
                                0,
                            ),
                          ),
                      },
                    )
                  }
                  placeholder="10"
                  className={
                    inputClassName
                  }
                />
              </label>

              {/* LOW STOCK THRESHOLD */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                  Low Stock Alert
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    product
                      .inventory
                      .lowStockThreshold
                  }
                  onChange={(
                    event,
                  ) =>
                    updateProduct(
                      "inventory",
                      {
                        ...product.inventory,
                        lowStockThreshold:
                          Math.max(
                            0,
                            Math.floor(
                              Number(
                                event
                                  .target
                                  .value,
                              ) ||
                                0,
                            ),
                          ),
                      },
                    )
                  }
                  placeholder="2"
                  className={
                    inputClassName
                  }
                />
              </label>
            </div>

            {/* STOCK STATUS */}

            <div className="mt-4 rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#6f706f]">
                  Current Stock
                </span>

                <span className="text-sm font-semibold text-[#171717]">
                  {Math.max(
                    0,
                    product
                      .inventory
                      .stock -
                      product
                        .inventory
                        .reserved,
                  )}{" "}
                  available
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between gap-4">
                <span className="text-xs text-[#969696]">
                  Reserved
                </span>

                <span className="text-xs text-[#969696]">
                  {
                    product
                      .inventory
                      .reserved
                  }
                </span>
              </div>
            </div>
          </section>

          {/* ===============================================
              MEDIA
          =============================================== */}

          {product.id && (
            <ProductMediaSection
              productId={
                product.id
              }
              media={
                product.media ??
                []
              }
              saving={
                actionLoading
              }
              onSaveMedia={
                saveMedia
              }
              onDeleteMedia={
                removeMedia
              }
            />
          )}

        </div>

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="min-w-0 space-y-5">

          {/* ===============================================
              EDIT ONLY
          =============================================== */}

          {isEdit &&
            product.id && (
              <>
                {/* =========================================
                    SEO
                ========================================= */}

                <ProductSeoSection
                  seo={
                    product.seo ??
                    ({} as ProductSEO)
                  }
                  onChange={(
                    value,
                  ) =>
                    void saveSeo(
                      value,
                    )
                  }
                />

                {/* =========================================
                    MERCHANDISING
                ========================================= */}

                <ProductMerchandisingSection
                  merchandising={
                    product
                      .merchandising
                  }
                  onChange={(
                    value,
                  ) =>
                    void saveMerchandising(
                      value,
                    )
                  }
                />

                {/* =========================================
                    PUBLISH
                ========================================= */}

                <ProductPublishSection
                  product={
                    product
                  }
                  saving={
                    actionLoading
                  }
                  onPublish={
                    publish
                  }
                  onDraft={
                    moveToDraft
                  }
                  onArchive={
                    archive
                  }
                  onUnpublish={
                    unpublish
                  }
                  onDelete={
                    handleDeleteProduct
                  }
                />
              </>
            )}

          {/* ===============================================
              CREATE MODE INFO
          =============================================== */}

          {!isEdit && (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
              <p className="break-words text-sm font-semibold leading-5 text-[#171717]">
                Product Setup
              </p>

              <p className="mt-2 break-words text-sm leading-5 text-[#6f706f]">
                Save the product to generate
                its product ID. You can then
                add product media and publish
                it.
              </p>
            </div>
          )}

          {/* ===============================================
              PRODUCT STATE
          =============================================== */}

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-[#fcfbf9] p-4 sm:p-5">
            <p className="break-words text-[11px] font-semibold uppercase tracking-[0.14em] text-[#969696]">
              Product State
            </p>

            <p className="mt-2 max-w-full break-words text-base font-semibold capitalize leading-6 text-[#171717]">
              {
                product.status
              }
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-[#6f706f]">
              Products are created as
              drafts and can be published
              after media is added.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}