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
import ProductAttributesSection from "./ProductAttributesSection";
import ProductMediaSection from "./ProductMediaSection";
import ProductSeoSection from "./ProductSeoSection";
import ProductMerchandisingSection from "./ProductMerchandisingSection";
import ProductVariantsSection from "./ProductVariantsSection";
import ProductPublishSection from "./ProductPublishSection";

interface ProductEditorProps {
  productId?: string;
}

export default function ProductEditor({
  productId,
}: ProductEditorProps) {
  const router = useRouter();

  /*
   * =========================================================
   * ADMIN AUTH
   * =========================================================
   */

  const {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading: authLoading,
  } = useAdminAuth();

  console.log("PRODUCT EDITOR AUTH:", {
    hasToken: Boolean(accessToken),
    tokenLength: accessToken?.length ?? 0,
    isAuthenticated,
    isInitialized,
  });

  /*
   * =========================================================
   * PRODUCT EDITOR
   * =========================================================
   */

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
    createVariant,
    updateVariant,
    removeVariant,
    publish,
    moveToDraft,
    archive,
    unpublish,
  } = useProductEditor({
    productId,
  });

  const isEdit = Boolean(productId);

  const [
    formError,
    setFormError,
  ] = useState<string | null>(null);

  /*
   * =========================================================
   * AUTH / ERROR STATE
   * =========================================================
   */

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

  /*
   * =========================================================
   * SAVE MAIN PRODUCT
   * =========================================================
   */

  const saveMain = async () => {
    setFormError(null);

    /*
     * Do not allow API operation until
     * authentication has been initialized.
     */
    if (!isInitialized) {
      setFormError(
        "Authentication is still initializing. Please wait.",
      );

      return;
    }

    if (!isAuthenticated || !accessToken) {
      setFormError(
        "Authentication is required. Please login again.",
      );

      return;
    }

    try {
      if (!isEdit) {
        const created = await create();

        router.replace(
          `/admin/products/${encodeURIComponent(
            created.id,
          )}`,
        );

        return;
      }

      await saveBasic();
    } catch (reason) {
      setFormError(
        reason instanceof Error
          ? reason.message
          : "Unable to save product.",
      );
    }
  };

  /*
   * =========================================================
   * AUTH INITIALIZATION
   * =========================================================
   */

  if (!isInitialized || authLoading) {
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

  /*
   * =========================================================
   * NOT AUTHENTICATED
   * =========================================================
   */

  if (!isAuthenticated || !accessToken) {
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
            router.push("/admin/login")
          }
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:opacity-90"
        >
          Login Again
        </button>
      </div>
    );
  }

  /*
   * =========================================================
   * PRODUCT LOADING
   * =========================================================
   */

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

  /*
   * =========================================================
   * MAIN UI
   * =========================================================
   */

  return (
    <div className="min-w-0 w-full space-y-5 overflow-x-hidden pb-10">
      {/* =====================================================
          HEADER
      ===================================================== */}

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

            <span>Products</span>
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

      {/* =====================================================
          ERROR
      ===================================================== */}

      {formError && (
        <div className="min-w-0 overflow-hidden rounded-xl border border-[#f0d1d1] bg-[#fff5f5] px-3.5 py-3 text-sm leading-5 text-[#a33a3a]">
          <p className="break-words">
            {formError}
          </p>
        </div>
      )}

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="min-w-0 space-y-5">
          {/* =================================================
              BASIC
          ================================================= */}

          <ProductBasicSection
            name={product.name}
            slug={product.slug}
            productType={
              product.productType
            }
            category={
              product.category
            }
            subcategory={
              product.subcategory ??
              ""
            }
            tags={product.tags}
            onChange={(values) => {
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
                values.slug !==
                undefined
              ) {
                updateProduct(
                  "slug",
                  values.slug,
                );
              }

              if (
                values.productType !==
                undefined
              ) {
                updateProduct(
                  "productType",
                  values.productType,
                );
              }

              if (
                values.category !==
                undefined
              ) {
                updateProduct(
                  "category",
                  values.category,
                );
              }

              if (
                values.subcategory !==
                undefined
              ) {
                updateProduct(
                  "subcategory",
                  values.subcategory,
                );
              }

              if (
                values.tags !==
                undefined
              ) {
                updateProduct(
                  "tags",
                  values.tags,
                );
              }
            }}
          />

          {/* =================================================
              CONTENT
          ================================================= */}

          <ProductContentSection
            content={
              product.content
            }
            onChange={(value) =>
              updateProduct(
                "content",
                value,
              )
            }
          />

          {/* =================================================
              ATTRIBUTES
          ================================================= */}

          <ProductAttributesSection
            attributes={
              product.attributes
            }
            onChange={(value) =>
              updateProduct(
                "attributes",
                value,
              )
            }
          />

          {/* =================================================
              MEDIA + VARIANTS
          ================================================= */}

          {isEdit &&
            product.id && (
              <>
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

                <ProductVariantsSection
                  productId={
                    product.id
                  }
                  variants={
                    product.variants ??
                    []
                  }
                  accessToken={
                    accessToken
                  }
                  saving={
                    actionLoading
                  }
                  onCreate={
                    createVariant
                  }
                  onUpdate={
                    updateVariant
                  }
                  onDelete={
                    removeVariant
                  }
                />
              </>
            )}
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="min-w-0 space-y-5">
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
                  onChange={(value) =>
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
                    product.merchandising
                  }
                  onChange={(value) =>
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
                />
              </>
            )}

          {/* =================================================
              NEW PRODUCT
          ================================================= */}

          {!isEdit && (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
              <p className="break-words text-sm font-semibold leading-5 text-[#171717]">
                Next steps
              </p>

              <p className="mt-2 break-words text-sm leading-5 text-[#6f706f]">
                Create the product first.
                After creation, dedicated
                sections for media, SEO,
                merchandising, variants and
                publishing become available.
              </p>
            </div>
          )}

          {/* =================================================
              PRODUCT STATE
          ================================================= */}

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-[#fcfbf9] p-4 sm:p-5">
            <p className="break-words text-[11px] font-semibold uppercase tracking-[0.14em] text-[#969696]">
              Product State
            </p>

            <p className="mt-2 max-w-full break-words text-base font-semibold capitalize leading-6 text-[#171717]">
              {product.status}
            </p>

            <p className="mt-1 break-words text-xs leading-5 text-[#6f706f]">
              Publishing is handled by the
              dedicated product publishing
              endpoint.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}