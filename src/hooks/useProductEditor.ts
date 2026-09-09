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
  createProductVariant,
  deleteProductMedia,
  deleteProductVariant,
  getAdminProduct,
  getProductMedia,
  getProductMerchandising,
  getProductSeo,
  getProductVariants,
  publishProduct,
  saveProductMerchandising,
  saveProductSeo,
  unpublishProduct,
  updateAdminProduct,
  updateProductMedia,
  updateProductVariant,
} from "@/services/product-admin.service";

import type {
  Product,
  ProductCreateInput,
  ProductMedia,
  ProductMerchandisingInput,
  ProductSeoInput,
  ProductUpdateInput,
} from "@/types/admin-product";

import type {
  ProductVariant,
} from "@/types/product";

interface UseProductEditorProps {
  productId?: string;
}

function createEmptyProduct(): Product {
  return {
    id: "",
    slug: "",
    name: "",
    productType: "anarkali",
    category: "ethnic",
    tags: [],
    content: {
      description: "",
      descriptionFormat:
        "plain",
      highlights: [],
      stylingNotes: "",
      fitNote: "",
      materialsAndCare:
        "",
      shippingContent:
        "",
      returnContent: "",
    },
    attributes: {
      fabric: "",
      composition: "",
      fit: "",
      occasion: [],
      pattern: "",
      work: "",
      neckline: "",
      sleeve: "",
      silhouette: "",
      length: "",
      lining: "",
      transparency: "",
      careInstructions: [],
    },
    media: [],
    variants: [],
    merchandising: {
      isNew: false,
      isFeatured: false,
      isBestSeller: false,
      badges: [],
    },
    status: "draft",
    createdAt:
      new Date().toISOString(),
    updatedAt:
      new Date().toISOString(),
  } as Product;
}

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

  const [product, setProduct] =
    useState<Product>(
      createEmptyProduct(),
    );

  const [loading, setLoading] =
    useState(isEdit);

  const [saving, setSaving] =
    useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const refresh =
    useCallback(async () => {
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
        const [
          productData,
          mediaData,
          seoData,
          merchandisingData,
          variantsData,
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
            getProductVariants(
              productId,
              accessToken,
            ),
          ]);

        setProduct({
          ...productData,
          media:
            mediaData.media,
          variants:
            variantsData.variants,
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
    }, [
      accessToken,
      isAuthenticated,
      isInitialized,
      productId,
    ]);

  useEffect(() => {
    if (!isEdit) {
      setProduct(
        createEmptyProduct(),
      );
      setLoading(false);
      return;
    }

    void refresh();
  }, [
    isEdit,
    refresh,
  ]);

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

  const create =
    async () => {
      if (!accessToken) {
        throw new Error(
          "Admin session is not available.",
        );
      }

      if (
        product.name.trim().length <
        2
      ) {
        throw new Error(
          "Product name must contain at least 2 characters.",
        );
      }

      if (
        !product.slug.trim()
      ) {
        throw new Error(
          "Product slug is required.",
        );
      }

      const payload: ProductCreateInput =
        {
          id:
            crypto.randomUUID(),

          slug:
            product.slug.trim(),

          name:
            product.name.trim(),

          productType:
            product.productType,

          category:
            product.category,

          ...(product.subcategory?.trim()
            ? {
                subcategory:
                  product.subcategory.trim(),
              }
            : {}),

          ...(product.collectionIds?.length
            ? {
                collectionIds:
                  product.collectionIds,
              }
            : {}),

          tags:
            product.tags,

          content:
            product.content,

          attributes:
            product.attributes,

          media:
            product.media ?? [],

          ...(product.sizeChart
            ? {
                sizeChart:
                  product.sizeChart,
              }
            : {}),

          variants:
            product.variants ??
            [],

          ...(product.faqs
            ? {
                faqs:
                  product.faqs,
              }
            : {}),

          merchandising:
            product.merchandising,

          ...(product.seo
            ? {
                seo:
                  product.seo,
              }
            : {}),

          status:
            "draft",
        };

      setSaving(true);

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
      } finally {
        setSaving(false);
      }
    };

  const saveBasic =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      const payload: ProductUpdateInput =
        {
          name:
            product.name.trim(),

          slug:
            product.slug.trim(),

          productType:
            product.productType,

          category:
            product.category,

          ...(product.subcategory !==
          undefined
            ? {
                subcategory:
                  product.subcategory,
              }
            : {}),

          tags:
            product.tags,

          content:
            product.content,

          attributes:
            product.attributes,

          ...(product.collectionIds
            ? {
                collectionIds:
                  product.collectionIds,
              }
            : {}),

          ...(product.sizeChart
            ? {
                sizeChart:
                  product.sizeChart,
              }
            : {}),
        };

      setSaving(true);

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
      } finally {
        setSaving(false);
      }
    };

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
      } finally {
        setActionLoading(false);
      }
    };

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
      } finally {
        setActionLoading(false);
      }
    };

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
      } finally {
        setActionLoading(false);
      }
    };

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
      } finally {
        setActionLoading(false);
      }
    };

  const createVariant =
    async (
      variant: ProductVariant,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      try {
        await createProductVariant(
          productId,
          variant,
          accessToken,
        );

        const result =
          await getProductVariants(
            productId,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,
            variants:
              result.variants,
          }),
        );
      } finally {
        setActionLoading(false);
      }
    };

  const updateVariant =
    async (
      variantId: string,
      input: Partial<ProductVariant>,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

      try {
        await updateProductVariant(
          productId,
          variantId,
          input,
          accessToken,
        );

        const result =
          await getProductVariants(
            productId,
            accessToken,
          );

        setProduct(
          (current) => ({
            ...current,
            variants:
              result.variants,
          }),
        );
      } finally {
        setActionLoading(false);
      }
    };

  const removeVariant =
    async (
      variantId: string,
    ) => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      if (
        product.variants
          .length <= 1
      ) {
        window.alert(
          "A product must retain at least one variant.",
        );
        return;
      }

      setActionLoading(true);

      try {
        await deleteProductVariant(
          productId,
          variantId,
          accessToken,
        );

        setProduct(
          (current) => ({
            ...current,
            variants:
              current.variants.filter(
                (variant) =>
                  variant.id !==
                  variantId,
              ),
          }),
        );
      } finally {
        setActionLoading(false);
      }
    };

  const publish =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

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
      } finally {
        setActionLoading(false);
      }
    };

  const moveToDraft =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

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
      } finally {
        setActionLoading(false);
      }
    };

  const archive =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

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
      } finally {
        setActionLoading(false);
      }
    };

  const unpublish =
    async () => {
      if (
        !productId ||
        !accessToken
      ) {
        return;
      }

      setActionLoading(true);

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
      } finally {
        setActionLoading(false);
      }
    };

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
    createVariant,
    updateVariant,
    removeVariant,
    publish,
    moveToDraft,
    archive,
    unpublish,
  };
}