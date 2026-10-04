"use client";

import { goBackTo } from "@/lib/nav-history";
import {
  useEffect,
  useMemo,
  useRef,
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
import ProductStatusBadge from "./ProductStatusBadge";

interface ProductEditorProps {
  productId?: string;
}

/* =========================================================
   INPUT STYLES
========================================================= */

const inputClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#3a352f] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2a241b]";

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

  /* Fields saved by the main "Save" button, for unsaved-change tracking. */
  const basicJson = useMemo(
    () =>
      JSON.stringify({
        name: product.name,
        categoryId: product.categoryId,
        content: product.content,
        pricing: product.pricing,
        inventory: product.inventory,
      }),
    [
      product.name,
      product.categoryId,
      product.content,
      product.pricing,
      product.inventory,
    ],
  );

  const [baseline, setBaseline] = useState<string | null>(null);
  const wasSaving = useRef(false);

  useEffect(() => {
    // First settled state (after load) is the saved baseline.
    if (!loading && baseline === null) {
      Promise.resolve().then(() => setBaseline(basicJson));
    }
  }, [loading, baseline, basicJson]);

  useEffect(() => {
    // After a successful save the new values become the baseline.
    if (saving) {
      wasSaving.current = true;
      return;
    }

    if (wasSaving.current) {
      wasSaving.current = false;

      if (!formError) {
        Promise.resolve().then(() => setBaseline(basicJson));
      }
    }
  }, [saving, formError, basicJson]);

  const dirty = baseline !== null && baseline !== basicJson;

  useEffect(() => {
    if (!dirty) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

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

      // The Publish card already asks for confirmation before calling this.
      await runDelete();
    };

  const runDelete =
    async () => {
      if (
        !isEdit ||
        !productId
      ) {
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
            className="h-24 min-w-0 animate-pulse rounded-2xl bg-[#211e1b]"
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
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[#2b1a18] bg-[#2b1a18] p-4 sm:p-5">
        <p className="break-words text-sm font-semibold leading-5 text-[#e08b84]">
          Authentication is required.
        </p>

        <p className="mt-2 break-words text-sm leading-5 text-[#cfc7bb]">
          Your admin session is no longer
          available. Please login again to
          continue.
        </p>

        <button
          type="button"
          onClick={() =>
            router.replace(
              "/admin/login",
            )
          }
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#b79a6a] px-4 text-sm font-medium text-[#111111] transition hover:opacity-90"
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
            className="h-24 min-w-0 animate-pulse rounded-2xl bg-[#211e1b]"
          />
        ))}
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="w-full min-w-0 space-y-5 pb-10">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="min-w-0">
        <button
          type="button"
          onClick={() => goBackTo(router, "/admin/products")}
          className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d9c7a3] hover:underline"
        >
          <ArrowLeft size={14} className="shrink-0" />
          Products
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a9185]">
          {isEdit ? "Edit product" : "New product"}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="min-w-0 max-w-full break-words text-[#f8f3f1]">
            {product.name || "Untitled product"}
          </h1>

          {isEdit ? <ProductStatusBadge status={product.status} /> : null}
        </div>

        {product.id ? (
          <p className="mt-2 inline-flex max-w-full break-all rounded-full bg-[#211e1b] px-3 py-1 text-[11px] font-semibold text-[#cfc7bb]">
            ID · {product.id}
          </p>
        ) : null}
      </div>

      {/* Sticky save bar: always reachable, shows unsaved changes. */}
      <div className="sticky top-[72px] z-20 -mx-4 border-y border-[#2e2a26] bg-[#111111]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <p
            className={`flex items-center gap-2 text-sm ${
              dirty ? "font-semibold text-[#d0a566]" : "text-[#cfc7bb]"
            }`}
            aria-live="polite"
          >
            <span className={`h-2 w-2 rounded-full ${dirty ? "bg-[#e0b56a]" : "bg-[#8fb08a]"}`} />
            {dirty
              ? "You have unsaved changes"
              : isEdit
                ? "All changes saved"
                : "Fill in the basics, then create the product"}
          </p>

          <button
            type="button"
            onClick={() => void saveMain()}
            disabled={saving || (isEdit && !dirty)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={15} className="shrink-0" />
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      {/* ===================================================
          ERROR
      =================================================== */}

      {formError && (
        <div className="min-w-0 overflow-hidden rounded-lg border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 text-sm leading-5 text-[#f0a39d]">
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

          <section className="surface min-w-0 overflow-hidden p-5 sm:p-6">

            <div>
              <h2 className="display break-words text-[26px] font-semibold leading-tight text-[#f8f3f1]">
                Pricing
              </h2>

              <p className="mt-1 break-words text-sm leading-5 text-[#cfc7bb]">
                Set the product MRP and
                selling price.
              </p>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

              {/* MRP */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
                <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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

            {/* LIVE PREVIEW */}
            {product.pricing.sellingPrice > product.pricing.mrp &&
            product.pricing.mrp > 0 ? (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 text-sm font-medium text-[#f0a39d]"
              >
                The sale price is higher than the MRP. Customers will not see a discount.
              </p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2e2a26] bg-[#111111] px-4 py-3">
              <span className="text-sm text-[#cfc7bb]">Customers will see</span>

              <span className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[#f8f3f1]">
                  ₹{Math.round(product.pricing.sellingPrice).toLocaleString("en-IN")}
                </span>

                {product.pricing.mrp > product.pricing.sellingPrice ? (
                  <>
                    <span className="text-sm text-[#9a9185] line-through">
                      ₹{Math.round(product.pricing.mrp).toLocaleString("en-IN")}
                    </span>

                    <span className="rounded-full bg-[#1a2419] px-2 py-0.5 text-xs font-bold text-[#8fb08a]">
                      {Math.round(
                        ((product.pricing.mrp - product.pricing.sellingPrice) /
                          product.pricing.mrp) *
                          100,
                      )}
                      % OFF
                    </span>
                  </>
                ) : null}
              </span>
            </div>
          </section>

          {/* ===============================================
              INVENTORY
          =============================================== */}

          <section className="surface min-w-0 overflow-hidden p-5 sm:p-6">

            <div>
              <h2 className="display break-words text-[26px] font-semibold leading-tight text-[#f8f3f1]">
                Stock
              </h2>

              <p className="mt-1 break-words text-sm leading-5 text-[#cfc7bb]">
                Manage the available product
                quantity.
              </p>
            </div>

            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

              {/* TOTAL STOCK */}

              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
                <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
            {(() => {
              const available = Math.max(
                0,
                product.inventory.stock - product.inventory.reserved,
              );

              const low = available > 0 && available <= product.inventory.lowStockThreshold;

              const tone =
                available <= 0
                  ? "border-[#5a2a27] bg-[#2b1a18] text-[#f0a39d]"
                  : low
                    ? "border-[#5a4420] bg-[#2b2216] text-[#e0b56a]"
                    : "border-[#2c4a33] bg-[#1a2419] text-[#8fb08a]";

              return (
                <div className={`mt-4 rounded-xl border px-4 py-3 ${tone}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-semibold">
                      {available <= 0
                        ? "Out of stock"
                        : low
                          ? "Running low"
                          : "In stock"}
                    </span>

                    <span className="text-sm font-bold">{available} available</span>
                  </div>

                  <p className="mt-1 text-xs opacity-80">
                    {product.inventory.reserved} reserved for unpaid orders · alert at{" "}
                    {product.inventory.lowStockThreshold} or fewer
                  </p>
                </div>
              );
            })()}
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
              STOREFRONT PREVIEW
          =============================================== */}
          <section className="surface min-w-0 overflow-hidden">
            <div className="flex h-56 items-center justify-center bg-[#2a241b]">
              {(() => {
                const image =
                  product.media?.find((item) => item.type === "image" && item.isPrimary)?.src ??
                  product.media?.find((item) => item.type === "image")?.src;

                return image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-6 text-center text-xs font-semibold uppercase tracking-wide text-[#d9c7a3]">
                    {isEdit ? "Add an image in Media" : "Images can be added after creating"}
                  </span>
                );
              })()}
            </div>

            <div className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">
                Storefront preview
              </p>

              <p className="mt-1 line-clamp-2 text-base font-semibold text-[#f8f3f1]">
                {product.name || "Untitled product"}
              </p>

              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold text-[#f8f3f1]">
                  ₹{Math.round(product.pricing.sellingPrice).toLocaleString("en-IN")}
                </span>

                {product.pricing.mrp > product.pricing.sellingPrice ? (
                  <span className="text-sm text-[#9a9185] line-through">
                    ₹{Math.round(product.pricing.mrp).toLocaleString("en-IN")}
                  </span>
                ) : null}
              </p>
            </div>
          </section>


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
            <div className="surface min-w-0 overflow-hidden p-5 sm:p-6">
              <p className="break-words text-sm font-semibold leading-5 text-[#f8f3f1]">
                Product Setup
              </p>

              <p className="mt-2 break-words text-sm leading-5 text-[#cfc7bb]">
                Save the product to generate
                its product ID. You can then
                add product media and publish
                it.
              </p>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}