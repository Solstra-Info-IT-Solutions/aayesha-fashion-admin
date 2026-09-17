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
  addProductMedia,
  archiveProduct,
  createAdminProduct,
  deleteAdminProduct,
  deleteProductMedia,
  getAdminProduct,
  getProductMedia,
  getProductMerchandising,
  getProductSeo,
  publishProduct,
  saveProductMerchandising,
  saveProductSeo,
  unpublishProduct,
  updateAdminProduct,
  updateProductMedia,
} from "@/services/product-admin.service";

import type {
  Product,
  ProductCreateInput,
  ProductMedia,
  ProductMerchandisingInput,
  ProductSeoInput,
  ProductUpdateInput,
} from "@/types/admin-product";

/* =========================================================
   PROPS
========================================================= */

interface UseProductEditorProps {
  productId?: string;
}

/* =========================================================
   EMPTY PRODUCT
========================================================= */

function createEmptyProduct(): Product {
  const now =
    new Date().toISOString();

  return {
    id: "",

    slug: "",

    name: "",

    categoryId: "",

    pricing: {
      mrp: 0,
      sellingPrice: 0,
      currency: "INR",
    },

    inventory: {
      stock: 0,
      reserved: 0,
      lowStockThreshold: 2,
    },

    content: {
      description: "",
      descriptionFormat: "rich",
    },

    media: [],

    merchandising: {
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      badges: [],
    },

    status: "draft",

    publishedAt:
      undefined,

    createdAt: now,

    updatedAt: now,
  };
}

/* =========================================================
   HOOK
========================================================= */

export function useProductEditor({
  productId,
}: UseProductEditorProps) {
  const {
    accessToken,
    isAuthenticated,
    isInitialized,
  } = useAdminAuth();

  const isEdit =
    Boolean(productId);

  /* =======================================================
     STATE
  ======================================================= */

  const [
    product,
    setProduct,
  ] = useState<Product>(
    createEmptyProduct(),
  );

  const [
    loading,
    setLoading,
  ] = useState(isEdit);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /* =======================================================
     REFRESH PRODUCT
  ======================================================= */

  const refresh =
    useCallback(
      async () => {
        if (
          !productId ||
          !accessToken ||
          !isAuthenticated ||
          !isInitialized
        ) {
          return;
        }

        setLoading(true);
        setError(null);

        try {
          /*
           * Product, media, SEO and
           * merchandising are separate
           * admin resources.
           *
           * There is NO variant request.
           */
          const [
            productData,
            mediaData,
            seoData,
            merchandisingData,
          ] =
            await Promise.all([
              getAdminProduct(
                productId,
                accessToken,
              ),

              getProductMedia(
                productId,
                accessToken,
              ),

              getProductSeo(
                productId,
                accessToken,
              ),

              getProductMerchandising(
                productId,
                accessToken,
              ),
            ]);

          setProduct({
            ...productData,

            media:
              mediaData.media,

            seo:
              seoData.seo ??
              undefined,

            merchandising:
              merchandisingData.merchandising,
          });
        } catch (reason) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load product.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        accessToken,
        isAuthenticated,
        isInitialized,
        productId,
      ],
    );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!isEdit) {
      setProduct(
        createEmptyProduct(),
      );

      setLoading(false);

      setError(null);

      return;
    }

    void refresh();
  }, [
    isEdit,
    refresh,
  ]);

  /* =======================================================
     UPDATE LOCAL PRODUCT
  ======================================================= */

  const updateProduct = <
    K extends keyof Product,
  >(
    key: K,
    value: Product[K],
  ) => {
    setProduct(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  };

  /* =======================================================
     CREATE PRODUCT
  ======================================================= */

  const create =
    async () => {
      if (!accessToken) {
        throw new Error(
          "Admin session is not available.",
        );
      }

      const name =
        product.name.trim();

      if (
        name.length < 2
      ) {
        throw new Error(
          "Product name must contain at least 2 characters.",
        );
      }

      const categoryId =
        product.categoryId.trim();

      if (!categoryId) {
        throw new Error(
          "Product category is required.",
        );
      }

      const mrp =
        Number(
          product.pricing.mrp,
        );

      const sellingPrice =
        Number(
          product.pricing
            .sellingPrice,
        );

      if (
        !Number.isFinite(mrp) ||
        mrp < 0
      ) {
        throw new Error(
          "Please enter a valid MRP.",
        );
      }

      if (
        !Number.isFinite(
          sellingPrice,
        ) ||
        sellingPrice < 0
      ) {
        throw new Error(
          "Please enter a valid selling price.",
        );
      }

      if (
        sellingPrice > mrp
      ) {
        throw new Error(
          "Sale price cannot be greater than MRP.",
        );
      }

      const stock =
        Math.floor(
          Number(
            product.inventory
              .stock,
          ),
        );

      if (
        !Number.isFinite(stock) ||
        stock < 0
      ) {
        throw new Error(
          "Please enter a valid stock quantity.",
        );
      }

      /*
       * Slug is generated from the
       * product name.
       *
       * This keeps product creation
       * simple for the shopkeeper.
       */
      const generatedSlug =
        name
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "",
          );

      if (
        !generatedSlug
      ) {
        throw new Error(
          "Unable to generate a product slug from the product name.",
        );
      }

      const payload:
        ProductCreateInput = {
        id:
          crypto.randomUUID(),

        slug:
          generatedSlug,

        name,

        categoryId,

        pricing: {
          mrp,

          sellingPrice,

          currency: "INR",
        },

        inventory: {
          stock,

          reserved:
            Math.max(
              0,
              Math.floor(
                Number(
                  product
                    .inventory
                    .reserved,
                ),
              ),
            ),

          lowStockThreshold:
            Math.max(
              0,
              Math.floor(
                Number(
                  product
                    .inventory
                    .lowStockThreshold,
                ),
              ),
            ),
        },

        content: {
          description:
            product.content
              .description,

          descriptionFormat:
            product.content
              .descriptionFormat,

          ...(product.content
            .richContent
            ? {
                richContent:
                  product.content
                    .richContent,
              }
            : {}),
        },

        /*
         * Media is normally added
         * after the product receives
         * its ID.
         */
        media: [],

        merchandising: {
          isNew:
            product
              .merchandising
              .isNew,

          isFeatured:
            product
              .merchandising
              .isFeatured,

          isBestSeller:
            product
              .merchandising
              .isBestSeller,

          badges:
            product
              .merchandising
              .badges,

          ...(product
            .merchandising
            .ranking !==
          undefined
            ? {
                ranking:
                  product
                    .merchandising
                    .ranking,
              }
            : {}),
        },

        ...(product.seo
          ? {
              seo:
                product.seo,
            }
          : {}),

        /*
         * Always create as draft.
         *
         * The product can be published
         * later after media is added.
         */
        status:
          "draft",
      };

      setSaving(true);

      setError(null);

      try {
        const created =
          await createAdminProduct(
            payload,
            accessToken,
          );

        setProduct(
          created,
        );

        return created;
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to create product.",
        );

        throw reason;
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     SAVE BASIC PRODUCT INFORMATION
  ======================================================= */

  const saveBasic =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      const name =
        product.name.trim();

      const slug =
        product.slug.trim();

      const categoryId =
        product.categoryId.trim();

      if (
        name.length < 2
      ) {
        throw new Error(
          "Product name must contain at least 2 characters.",
        );
      }

      if (!slug) {
        throw new Error(
          "Product slug is required.",
        );
      }

      if (!categoryId) {
        throw new Error(
          "Product category is required.",
        );
      }

      const payload:
        ProductUpdateInput = {
        name,

        slug,

        categoryId,

        pricing: {
          mrp:
            Number(
              product.pricing.mrp,
            ),

          sellingPrice:
            Number(
              product.pricing
                .sellingPrice,
            ),

          currency: "INR",
        },

        inventory: {
          stock:
            Math.max(
              0,
              Math.floor(
                Number(
                  product
                    .inventory
                    .stock,
                ),
              ),
            ),

          reserved:
            Math.max(
              0,
              Math.floor(
                Number(
                  product
                    .inventory
                    .reserved,
                ),
              ),
            ),

          lowStockThreshold:
            Math.max(
              0,
              Math.floor(
                Number(
                  product
                    .inventory
                    .lowStockThreshold,
                ),
              ),
            ),
        },

        content: {
          description:
            product.content
              .description,

          descriptionFormat:
            product.content
              .descriptionFormat,

          ...(product.content
            .richContent
            ? {
                richContent:
                  product.content
                    .richContent,
              }
            : {}),
        },
      };

      setSaving(true);

      setError(null);

      try {
        const updated =
          await updateAdminProduct(
            productId,
            payload,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,
            ...updated,
          }),
        );

        return updated;
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to save product.",
        );

        throw reason;
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     SAVE MEDIA
  ======================================================= */

  const saveMedia =
    async (
      item: ProductMedia,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        const exists =
          product.media.some(
            (media) =>
              media.id ===
              item.id,
          );

        if (exists) {
          await updateProductMedia(
            productId,
            item.id,
            item,
            accessToken,
          );
        } else {
          await addProductMedia(
            productId,
            item,
            accessToken,
          );
        }

        const result =
          await getProductMedia(
            productId,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,

            media:
              result.media,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to save media.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     REMOVE MEDIA
  ======================================================= */

  const removeMedia =
    async (
      mediaId: string,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        await deleteProductMedia(
          productId,
          mediaId,
          accessToken,
        );

        setProduct(
          (current) => ({
            ...current,

            media:
              current.media.filter(
                (item) =>
                  item.id !==
                  mediaId,
              ),
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to delete media.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     SAVE SEO
  ======================================================= */

  const saveSeo =
    async (
      input: ProductSeoInput,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        const result =
          await saveProductSeo(
            productId,
            input,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,

            seo:
              result.seo,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to save SEO.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     SAVE MERCHANDISING
  ======================================================= */

  const saveMerchandising =
    async (
      input: ProductMerchandisingInput,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        const result =
          await saveProductMerchandising(
            productId,
            input,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,

            merchandising:
              result.merchandising,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to save merchandising.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     PUBLISH
  ======================================================= */

  const publish =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      /*
       * Publishing requires at least
       * one media item.
       */
      if (
        product.media.length ===
        0
      ) {
        throw new Error(
          "Add at least one image or video before publishing the product.",
        );
      }

      setActionLoading(true);

      setError(null);

      try {
        const result =
          await publishProduct(
            productId,
            {
              status:
                "active",
            },
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,

            status:
              result.status,

            publishedAt:
              result.publishedAt ??
              undefined,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to publish product.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     MOVE TO DRAFT
  ======================================================= */

  const moveToDraft =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        const result =
          await publishProduct(
            productId,
            {
              status:
                "draft",
            },
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,

            status:
              result.status,

            publishedAt:
              undefined,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to move product to draft.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     ARCHIVE
  ======================================================= */

  const archive =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        await archiveProduct(
          productId,
          accessToken,
        );

        setProduct(
          (current) => ({
            ...current,

            status:
              "archived",
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to archive product.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     UNPUBLISH
  ======================================================= */

  const unpublish =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        await unpublishProduct(
          productId,
          accessToken,
        );

        setProduct(
          (current) => ({
            ...current,

            status:
              "draft",

            publishedAt:
              undefined,
          }),
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to unpublish product.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const deleteProduct =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      setError(null);

      try {
        await deleteAdminProduct(
          productId,
          accessToken,
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to delete product.",
        );

        throw reason;
      } finally {
        setActionLoading(false);
      }
    };

  /* =======================================================
     RETURN API
  ======================================================= */

  return {
    product,

    setProduct,

    updateProduct,

    loading,

    saving,

    actionLoading,

    error,

    refresh,

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
  };
}