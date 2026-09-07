"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  ChevronDown,
} from "lucide-react";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import {
  useCatalog,
} from "@/hooks/useCatalog";

import type {
  CatalogItem,
  CatalogResource,
} from "@/hooks/useCatalog";

import {
  createAttribute,
  createBadge,
  createCategory,
  createCollection,
  createColor,
  createSize,
  createTag,
  updateAttribute,
  updateBadge,
  updateCategory,
  updateCollection,
  updateColor,
  updateSize,
  updateTag,
} from "@/services/catalog.service";

import type {
  AttributeMaster,
  Badge,
  Category,
  Collection,
  ColorMaster,
  CreateAttributeInput,
  CreateBadgeInput,
  CreateCategoryInput,
  CreateCollectionInput,
  CreateColorInput,
  CreateSizeInput,
  CreateTagInput,
  SizeMaster,
  Tag,
  CatalogFormState,
} from "@/types/catalog";

import CatalogHeader from "./CatalogHeader";
import CatalogToolbar from "./CatalogToolbar";
import CatalogTable from "./CatalogTable";
import CatalogPagination from "./CatalogPagination";
import CatalogEmptyState from "./CatalogEmptyState";
import CatalogFormModal from "./CatalogFormModal";

const RESOURCE_CONFIG: Record<
  CatalogResource,
  {
    title: string;
    description: string;
    addLabel: string;
  }
> = {
  categories: {
    title: "Categories",
    description:
      "Manage primary and nested product categories.",
    addLabel: "Add Category",
  },

  collections: {
    title: "Collections",
    description:
      "Manage curated and featured product collections.",
    addLabel: "Add Collection",
  },

  tags: {
    title: "Tags",
    description:
      "Manage reusable product discovery tags.",
    addLabel: "Add Tag",
  },

  badges: {
    title: "Badges",
    description:
      "Manage product labels and promotional badges.",
    addLabel: "Add Badge",
  },

  attributes: {
    title: "Attributes",
    description:
      "Define reusable product attributes and value types.",
    addLabel: "Add Attribute",
  },

  sizes: {
    title: "Sizes",
    description:
      "Manage standard product size codes and labels.",
    addLabel: "Add Size",
  },

  colors: {
    title: "Colors",
    description:
      "Manage product colors, slugs and swatches.",
    addLabel: "Add Color",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function slugify(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9\s-]/g,
      "",
    )
    .replace(
      /\s+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    );
}

function createEmptyForm(
  resource: CatalogResource,
): CatalogFormState {
  switch (resource) {
    case "categories":
      return {
        name: "",
        slug: "",
        description: "",
        image: "",
        parentId: "",
        sortOrder: "0",
        isActive: true,
        seoTitle: "",
        seoDescription: "",
      };

    case "collections":
      return {
        name: "",
        slug: "",
        description: "",
        image: "",
        bannerImage: "",
        sortOrder: "0",
        isFeatured: false,
        isActive: true,
        startsAt: "",
        endsAt: "",
        seoTitle: "",
        seoDescription: "",
      };

    case "tags":
      return {
        name: "",
        slug: "",
        description: "",
        isActive: true,
      };

    case "badges":
      return {
        name: "",
        slug: "",
        label: "",
        tone: "neutral",
        sortOrder: "0",
        isActive: true,
      };

    case "attributes":
      return {
        key: "",
        label: "",
        type: "text",
        options: "",
        sortOrder: "0",
        isActive: true,
      };

    case "sizes":
      return {
        code: "",
        label: "",
        sortOrder: "0",
        isActive: true,
      };

    case "colors":
      return {
        name: "",
        slug: "",
        hex: "",
        swatchImage: "",
        sortOrder: "0",
        isActive: true,
      };
  }
}

/* =========================================================
   PAGE
========================================================= */

type Props = {
  resource: CatalogResource;
};

export default function CatalogResourcePage({
  resource,
}: Props) {
  const config =
    RESOURCE_CONFIG[resource];

  const {
    accessToken,
  } = useAdminAuth();

  const [page, setPage] =
    useState(1);

  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [isActive, setIsActive] =
    useState<
      "all" |
      "true" |
      "false"
    >("all");

  const [sort, setSort] =
    useState<
      | "newest"
      | "oldest"
      | "name"
      | "sort_order"
    >("sort_order");

  const {
    items,
    pagination,
    loading,
    error,
    refresh,
  } = useCatalog({
    resource,
    page,
    limit: 20,
    search,
    isActive,
    sort,
  });

  const categories =
    useMemo(
      () =>
        resource ===
        "categories"
          ? (
              items as Category[]
            )
          : [],
      [
        items,
        resource,
      ],
    );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] = useState<
    CatalogItem | null
  >(null);

  const [
    form,
    setForm,
  ] = useState<CatalogFormState>(
    createEmptyForm(resource),
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  /* =======================================================
     CREATE
  ======================================================= */

  function openCreate() {
    setEditingItem(null);

    setForm(
      createEmptyForm(
        resource,
      ),
    );

    setFormError("");
    setModalOpen(true);
  }

  /* =======================================================
     EDIT
  ======================================================= */

  function openEdit(
    item: CatalogItem,
  ) {
    setEditingItem(item);
    setFormError("");

    switch (resource) {
      case "categories": {
        const category =
          item as Category;

        setForm({
          name:
            category.name,
          slug:
            category.slug,
          description:
            category.description ??
            "",
          image:
            category.image ??
            "",
          parentId:
            category.parentId ??
            "",
          sortOrder:
            String(
              category.sortOrder ??
                0,
            ),
          isActive:
            category.isActive,
          seoTitle:
            category.seoTitle ??
            "",
          seoDescription:
            category.seoDescription ??
            "",
        });

        break;
      }

      case "collections": {
        const collection =
          item as Collection;

        setForm({
          name:
            collection.name,
          slug:
            collection.slug,
          description:
            collection.description ??
            "",
          image:
            collection.image ??
            "",
          bannerImage:
            collection.bannerImage ??
            "",
          sortOrder:
            String(
              collection.sortOrder ??
                0,
            ),
          isFeatured:
            collection.isFeatured,
          isActive:
            collection.isActive,
          startsAt:
            collection.startsAt
              ? collection.startsAt.slice(
                  0,
                  16,
                )
              : "",
          endsAt:
            collection.endsAt
              ? collection.endsAt.slice(
                  0,
                  16,
                )
              : "",
          seoTitle:
            collection.seoTitle ??
            "",
          seoDescription:
            collection.seoDescription ??
            "",
        });

        break;
      }

      case "tags": {
        const tag =
          item as Tag;

        setForm({
          name:
            tag.name,
          slug:
            tag.slug,
          description:
            tag.description ??
            "",
          isActive:
            tag.isActive,
        });

        break;
      }

      case "badges": {
        const badge =
          item as Badge;

        setForm({
          name:
            badge.name,
          slug:
            badge.slug,
          label:
            badge.label,
          tone:
            badge.tone,
          sortOrder:
            String(
              badge.sortOrder ??
                0,
            ),
          isActive:
            badge.isActive,
        });

        break;
      }

      case "attributes": {
        const attribute =
          item as AttributeMaster;

        setForm({
          key:
            attribute.key,
          label:
            attribute.label,
          type:
            attribute.type,
          options:
            attribute.options.join(
              ", ",
            ),
          sortOrder:
            String(
              attribute.sortOrder ??
                0,
            ),
          isActive:
            attribute.isActive,
        });

        break;
      }

      case "sizes": {
        const size =
          item as SizeMaster;

        setForm({
          code:
            size.code,
          label:
            size.label,
          sortOrder:
            String(
              size.sortOrder ??
                0,
            ),
          isActive:
            size.isActive,
        });

        break;
      }

      case "colors": {
        const color =
          item as ColorMaster;

        setForm({
          name:
            color.name,
          slug:
            color.slug,
          hex:
            color.hex ?? "",
          swatchImage:
            color.swatchImage ??
            "",
          sortOrder:
            String(
              color.sortOrder ??
                0,
            ),
          isActive:
            color.isActive,
        });

        break;
      }
    }

    setModalOpen(true);
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingItem(null);

    setForm(
      createEmptyForm(
        resource,
      ),
    );

    setFormError("");
  }

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  function updateField(
    key: string,
    value:
      | string
      | boolean,
  ) {
    setForm(
      (
        current: CatalogFormState,
      ) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!accessToken) {
      setFormError(
        "Authentication is required.",
      );

      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const id =
        editingItem?._id;

      /* ===================================================
         CATEGORIES
      =================================================== */

      if (
        resource ===
        "categories"
      ) {
        const name =
          String(
            form.name ?? "",
          ).trim();

        const slug =
          String(
            form.slug ?? "",
          ).trim() ||
          slugify(name);

        if (!name) {
          throw new Error(
            "Category name is required.",
          );
        }

        if (!slug) {
          throw new Error(
            "Category slug is required.",
          );
        }

        const payload: CreateCategoryInput =
          {
            name,
            slug,
            description:
              String(
                form.description ??
                  "",
              ).trim(),
            image:
              String(
                form.image ??
                  "",
              ).trim(),
            parentId:
              String(
                form.parentId ??
                  "",
              ) || null,
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isActive:
              Boolean(
                form.isActive,
              ),
            seoTitle:
              String(
                form.seoTitle ??
                  "",
              ).trim(),
            seoDescription:
              String(
                form.seoDescription ??
                  "",
              ).trim(),
          };

        if (id) {
          await updateCategory(
            id,
            payload,
            accessToken,
          );
        } else {
          await createCategory(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         COLLECTIONS
      =================================================== */

      if (
        resource ===
        "collections"
      ) {
        const name =
          String(
            form.name ?? "",
          ).trim();

        const slug =
          String(
            form.slug ?? "",
          ).trim() ||
          slugify(name);

        if (!name) {
          throw new Error(
            "Collection name is required.",
          );
        }

        if (!slug) {
          throw new Error(
            "Collection slug is required.",
          );
        }

        const startsAt =
          String(
            form.startsAt ??
              "",
          ).trim();

        const endsAt =
          String(
            form.endsAt ??
              "",
          ).trim();

        const payload: CreateCollectionInput =
          {
            name,
            slug,
            description:
              String(
                form.description ??
                  "",
              ).trim(),
            image:
              String(
                form.image ??
                  "",
              ).trim(),
            bannerImage:
              String(
                form.bannerImage ??
                  "",
              ).trim(),
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isFeatured:
              Boolean(
                form.isFeatured,
              ),
            isActive:
              Boolean(
                form.isActive,
              ),
            startsAt: startsAt
              ? new Date(
                  startsAt,
                ).toISOString()
              : null,
            endsAt: endsAt
              ? new Date(
                  endsAt,
                ).toISOString()
              : null,
            seoTitle:
              String(
                form.seoTitle ??
                  "",
              ).trim(),
            seoDescription:
              String(
                form.seoDescription ??
                  "",
              ).trim(),
          };

        if (id) {
          await updateCollection(
            id,
            payload,
            accessToken,
          );
        } else {
          await createCollection(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         TAGS
      =================================================== */

      if (
        resource ===
        "tags"
      ) {
        const name =
          String(
            form.name ?? "",
          ).trim();

        const slug =
          String(
            form.slug ?? "",
          ).trim() ||
          slugify(name);

        if (!name) {
          throw new Error(
            "Tag name is required.",
          );
        }

        if (!slug) {
          throw new Error(
            "Tag slug is required.",
          );
        }

        const payload: CreateTagInput =
          {
            name,
            slug,
            description:
              String(
                form.description ??
                  "",
              ).trim(),
            isActive:
              Boolean(
                form.isActive,
              ),
          };

        if (id) {
          await updateTag(
            id,
            payload,
            accessToken,
          );
        } else {
          await createTag(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         BADGES
      =================================================== */

      if (
        resource ===
        "badges"
      ) {
        const name =
          String(
            form.name ?? "",
          ).trim();

        const slug =
          String(
            form.slug ?? "",
          ).trim() ||
          slugify(name);

        const label =
          String(
            form.label ?? "",
          ).trim();

        if (!name) {
          throw new Error(
            "Badge name is required.",
          );
        }

        if (!slug) {
          throw new Error(
            "Badge slug is required.",
          );
        }

        if (!label) {
          throw new Error(
            "Badge label is required.",
          );
        }

        const payload: CreateBadgeInput =
          {
            name,
            slug,
            label,
            tone:
              form.tone as CreateBadgeInput["tone"],
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isActive:
              Boolean(
                form.isActive,
              ),
          };

        if (id) {
          await updateBadge(
            id,
            payload,
            accessToken,
          );
        } else {
          await createBadge(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         ATTRIBUTES
      =================================================== */

      if (
        resource ===
        "attributes"
      ) {
        const key =
          String(
            form.key ?? "",
          )
            .trim()
            .toLowerCase();

        const label =
          String(
            form.label ?? "",
          ).trim();

        if (!key) {
          throw new Error(
            "Attribute key is required.",
          );
        }

        if (!label) {
          throw new Error(
            "Attribute label is required.",
          );
        }

        const options =
          String(
            form.options ?? "",
          )
            .split(",")
            .map(
              (
                value,
              ) =>
                value.trim(),
            )
            .filter(Boolean);

        const payload: CreateAttributeInput =
          {
            key,
            label,
            type:
              form.type as CreateAttributeInput["type"],
            options,
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isActive:
              Boolean(
                form.isActive,
              ),
          };

        if (id) {
          await updateAttribute(
            id,
            payload,
            accessToken,
          );
        } else {
          await createAttribute(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         SIZES
      =================================================== */

      if (
        resource ===
        "sizes"
      ) {
        const code =
          String(
            form.code ?? "",
          )
            .trim()
            .toUpperCase();

        const label =
          String(
            form.label ?? "",
          ).trim();

        if (!code) {
          throw new Error(
            "Size code is required.",
          );
        }

        if (!label) {
          throw new Error(
            "Size label is required.",
          );
        }

        const payload: CreateSizeInput =
          {
            code,
            label,
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isActive:
              Boolean(
                form.isActive,
              ),
          };

        if (id) {
          await updateSize(
            id,
            payload,
            accessToken,
          );
        } else {
          await createSize(
            payload,
            accessToken,
          );
        }
      }

      /* ===================================================
         COLORS
      =================================================== */

      if (
        resource ===
        "colors"
      ) {
        const name =
          String(
            form.name ?? "",
          ).trim();

        const slug =
          String(
            form.slug ?? "",
          ).trim() ||
          slugify(name);

        if (!name) {
          throw new Error(
            "Color name is required.",
          );
        }

        if (!slug) {
          throw new Error(
            "Color slug is required.",
          );
        }

        const hex =
          String(
            form.hex ?? "",
          ).trim();

        const payload: CreateColorInput =
          {
            name,
            slug,
            hex: hex || null,
            swatchImage:
              String(
                form.swatchImage ??
                  "",
              ).trim(),
            sortOrder:
              Number(
                form.sortOrder ??
                  0,
              ) || 0,
            isActive:
              Boolean(
                form.isActive,
              ),
          };

        if (id) {
          await updateColor(
            id,
            payload,
            accessToken,
          );
        } else {
          await createColor(
            payload,
            accessToken,
          );
        }
      }

      closeModal();

      await refresh();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to save changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  function applySearch() {
    setPage(1);

    setSearch(
      searchInput.trim(),
    );
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  /* =======================================================
     PARENT OPTIONS
  ======================================================= */

  const parentOptions =
    categories
      .filter(
        (category) =>
          category._id !==
          editingItem?._id,
      )
      .map(
        (category) => ({
          value:
            category._id,
          label:
            category.name,
        }),
      );

  return (
    <div className="space-y-6">
      <CatalogHeader
        title={
          config.title
        }
        description={
          config.description
        }
        addLabel={
          config.addLabel
        }
        loading={
          loading
        }
        onRefresh={() =>
          void refresh()
        }
        onAdd={
          openCreate
        }
      />

      <CatalogToolbar
        searchInput={
          searchInput
        }
        search={
          search
        }
        isActive={
          isActive
        }
        sort={
          sort
        }
        onSearchInputChange={
          setSearchInput
        }
        onSearch={
          applySearch
        }
        onClearSearch={
          clearSearch
        }
        onStatusChange={(
          value,
        ) => {
          setPage(1);
          setIsActive(
            value,
          );
        }}
        onSortChange={(
          value,
        ) => {
          setPage(1);
          setSort(
            value,
          );
        }}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {loading ||
        items.length > 0 ? (
          <CatalogTable
            resource={
              resource
            }
            items={
              items
            }
            loading={
              loading
            }
            onEdit={
              openEdit
            }
          />
        ) : (
          <CatalogEmptyState
            title={`No ${config.title.toLowerCase()} found`}
            description={`There are no ${config.title.toLowerCase()} matching the current filters.`}
            actionLabel={
              config.addLabel
            }
            onAction={
              openCreate
            }
          />
        )}

        {!loading &&
          items.length >
            0 && (
            <CatalogPagination
              page={
                pagination.page
              }
              totalPages={
                pagination.totalPages
              }
              total={
                pagination.total
              }
              loading={
                loading
              }
              onPrevious={() =>
                setPage(
                  (
                    current,
                  ) =>
                    Math.max(
                      1,
                      current -
                        1,
                    ),
                )
              }
              onNext={() =>
                setPage(
                  (
                    current,
                  ) =>
                    current +
                    1,
                )
              }
            />
          )}
      </div>

      {modalOpen && (
        <CatalogFormModal
          resource={
            resource
          }
          title={
            editingItem
              ? `Edit ${config.title.slice(
                  0,
                  -1,
                )}`
              : config.addLabel
          }
          form={
            form
          }
          saving={
            saving
          }
          error={
            formError
          }
          categoryOptions={
            parentOptions
          }
          isEditing={
            Boolean(
              editingItem,
            )
          }
          onChange={
            updateField
          }
          onSubmit={
            handleSubmit
          }
          onClose={
            closeModal
          }
        />
      )}
    </div>
  );
}