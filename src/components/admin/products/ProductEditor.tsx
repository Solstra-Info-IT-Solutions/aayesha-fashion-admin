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
      <div className="space-y-4">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-[#f5f1ec]"
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
      <div className="rounded-2xl border border-[#f0d1d1] bg-[#fff5f5] p-6">
        <p className="text-sm font-semibold text-[#a33a3a]">
          Authentication is required.
        </p>

        <p className="mt-2 text-sm text-[#6f706f]">
          Your admin session is no longer available.
          Please login again to continue.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/login")
          }
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#171717] px-4 text-sm font-medium text-white"
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
      <div className="space-y-4">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-[#f5f1ec]"
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
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 border-b border-[#e7e2dd] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/products",
              )
            }
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#6f706f] hover:text-[#171717]"
          >
            <ArrowLeft size={13} />

            Products
          </button>

          <p className="text-xs uppercase tracking-[0.16em] text-[#969696]">
            {isEdit
              ? "Edit Product"
              : "New Product"}
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#171717]">
            {product.name ||
              "Untitled Product"}
          </h1>

          {product.id && (
            <p className="mt-1 text-xs text-[#969696]">
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
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={15} />

          {saving
            ? "Saving..."
            : isEdit
              ? "Save Product"
              : "Create Product"}
        </button>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {formError && (
        <div className="rounded-xl border border-[#f0d1d1] bg-[#fff5f5] px-4 py-3 text-sm text-[#a33a3a]">
          {formError}
        </div>
      )}

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="space-y-6">
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

        <aside className="space-y-6">
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
            <div className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
              <p className="text-sm font-semibold text-[#171717]">
                Next steps
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6f706f]">
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

          <div className="rounded-2xl border border-[#e7e2dd] bg-[#fcfbf9] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#969696]">
              Product State
            </p>

            <p className="mt-2 text-lg font-semibold capitalize text-[#171717]">
              {product.status}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#6f706f]">
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