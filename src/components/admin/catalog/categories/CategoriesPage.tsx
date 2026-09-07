"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  ChevronDown,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useCatalog,
} from "@/hooks/useCatalog";

import {
  apiPost,
  apiPatch,
} from "@/lib/api";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import type {
  Category,
  CatalogSort,
  CatalogStatusFilter,
  CreateCategoryInput,
} from "@/types/catalog";

const LIMIT = 20;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string;
  sortOrder: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

const emptyForm: FormState = {
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

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-neutral-100 text-neutral-500",
      ].join(" ")}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function CategoriesPage() {
  const {
    accessToken,
  } = useAdminAuth();

  const [page, setPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [isActive, setIsActive] =
    useState<CatalogStatusFilter>(
      "all",
    );

  const [sort, setSort] =
    useState<CatalogSort>(
      "sort_order",
    );

  const {
    items,
    pagination,
    loading,
    error,
    refresh,
  } = useCatalog({
    resource: "categories",
    page,
    limit: LIMIT,
    search,
    isActive,
    sort,
  });

  const categories =
    useMemo(
      () => items as Category[],
      [items],
    );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    formError,
    setFormError,
  ] = useState("");

  const [
    editingCategory,
    setEditingCategory,
  ] = useState<Category | null>(
    null,
  );

  const [
    form,
    setForm,
  ] = useState<FormState>(
    emptyForm,
  );

  function openCreate() {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(
    category: Category,
  ) {
    setEditingCategory(category);

    setForm({
      name: category.name,
      slug: category.slug,
      description:
        category.description ?? "",
      image: category.image ?? "",
      parentId:
        category.parentId ?? "",
      sortOrder: String(
        category.sortOrder ?? 0,
      ),
      isActive:
        category.isActive,
      seoTitle:
        category.seoTitle ?? "",
      seoDescription:
        category.seoDescription ?? "",
    });

    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError("");
  }

  function updateField(
    field: keyof FormState,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

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

    const name =
      form.name.trim();

    const slug =
      form.slug.trim() ||
      slugify(name);

    if (!name) {
      setFormError(
        "Category name is required.",
      );
      return;
    }

    if (!slug) {
      setFormError(
        "Category slug is required.",
      );
      return;
    }

    const payload: CreateCategoryInput =
      {
        name,
        slug,
        description:
          form.description.trim(),
        image:
          form.image.trim(),
        parentId:
          form.parentId || null,
        sortOrder:
          Number(form.sortOrder) || 0,
        isActive:
          form.isActive,
        seoTitle:
          form.seoTitle.trim(),
        seoDescription:
          form.seoDescription.trim(),
      };

    setSaving(true);
    setFormError("");

    try {
      if (editingCategory) {
        await apiPatch(
          `/admin/catalog/categories/${editingCategory._id}`,
          payload,
          accessToken,
        );
      } else {
        await apiPost(
          "/admin/catalog/categories",
          payload,
          accessToken,
        );
      }

      closeModal();
      await refresh();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to save category.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleSearch() {
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

  const parentOptions =
    categories.filter(
      (category) =>
        category._id !==
        editingCategory?._id,
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            Catalog / Categories
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
            Categories
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Manage primary and nested product categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                loading
                  ? "animate-spin"
                  : "",
              ].join(" ")}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex min-w-0 flex-1 gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    handleSearch();
                  }
                }}
                placeholder="Search categories..."
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="h-11 shrink-0 rounded-xl bg-neutral-950 px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Search
            </button>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="h-11 shrink-0 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <span className="sr-only">
                Status
              </span>

              <select
                value={isActive}
                onChange={(event) => {
                  setPage(1);
                  setIsActive(
                    event.target
                      .value as CatalogStatusFilter,
                  );
                }}
                className="h-11 min-w-[145px] appearance-none rounded-xl border border-neutral-200 bg-white pl-3 pr-9 text-sm text-neutral-700 outline-none focus:border-neutral-400"
              >
                <option value="all">
                  All Status
                </option>
                <option value="true">
                  Active
                </option>
                <option value="false">
                  Inactive
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </label>

            <label className="relative">
              <span className="sr-only">
                Sort
              </span>

              <select
                value={sort}
                onChange={(event) => {
                  setPage(1);
                  setSort(
                    event.target
                      .value as CatalogSort,
                  );
                }}
                className="h-11 min-w-[165px] appearance-none rounded-xl border border-neutral-200 bg-white pl-3 pr-9 text-sm text-neutral-700 outline-none focus:border-neutral-400"
              >
                <option value="sort_order">
                  Sort Order
                </option>
                <option value="name">
                  Name
                </option>
                <option value="newest">
                  Newest
                </option>
                <option value="oldest">
                  Oldest
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            </label>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b border-neutral-200 bg-neutral-50/70">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Category
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Slug
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Parent
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Sort
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center"
                  >
                    <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center"
                  >
                    <p className="text-sm font-medium text-neutral-700">
                      No categories found
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      Create your first category
                      to get started.
                    </p>

                    <button
                      type="button"
                      onClick={openCreate}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
                    >
                      <Plus className="h-4 w-4" />
                      Add Category
                    </button>
                  </td>
                </tr>
              ) : (
                categories.map(
                  (category) => {
                    const parent =
                      categories.find(
                        (item) =>
                          item._id ===
                          category.parentId,
                      );

                    return (
                      <tr
                        key={
                          category._id
                        }
                        className="transition hover:bg-neutral-50/60"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {
                                category.name
                              }
                            </p>

                            {category.description && (
                              <p className="mt-1 max-w-md truncate text-xs text-neutral-500">
                                {
                                  category.description
                                }
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-neutral-600">
                          {category.slug}
                        </td>

                        <td className="px-5 py-4 text-sm text-neutral-600">
                          {parent?.name ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-neutral-600">
                          {
                            category.sortOrder
                          }
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            active={
                              category.isActive
                            }
                          />
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                category,
                              )
                            }
                            className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            {pagination.total === 0
              ? "0 categories"
              : `Showing ${
                  (pagination.page -
                    1) *
                    pagination.limit +
                  1
                }–${Math.min(
                  pagination.page *
                    pagination.limit,
                  pagination.total,
                )} of ${
                  pagination.total
                }`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={
                pagination.page <= 1 ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                )
              }
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-neutral-500">
              Page{" "}
              {pagination.page}{" "}
              of{" "}
              {Math.max(
                1,
                pagination.totalPages,
              )}
            </span>

            <button
              type="button"
              disabled={
                pagination.page >=
                  pagination.totalPages ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1,
                )
              }
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="border-b border-neutral-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-neutral-950">
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Configure category information and SEO.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {formError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) => {
                      const value =
                        event.target
                          .value;

                      updateField(
                        "name",
                        value,
                      );

                      if (
                        !editingCategory
                      ) {
                        updateField(
                          "slug",
                          slugify(
                            value,
                          ),
                        );
                      }
                    }}
                    placeholder="e.g. Sarees"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Slug *
                  </label>

                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target
                          .value
                          .toLowerCase(),
                      )
                    }
                    placeholder="sarees"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Description
                  </label>

                  <textarea
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateField(
                        "description",
                        event.target
                          .value,
                      )
                    }
                    rows={3}
                    placeholder="Describe this category..."
                    className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Parent Category
                  </label>

                  <select
                    value={
                      form.parentId
                    }
                    onChange={(event) =>
                      updateField(
                        "parentId",
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  >
                    <option value="">
                      No Parent
                    </option>

                    {parentOptions.map(
                      (category) => (
                        <option
                          key={
                            category._id
                          }
                          value={
                            category._id
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    value={
                      form.sortOrder
                    }
                    onChange={(event) =>
                      updateField(
                        "sortOrder",
                        event.target
                          .value,
                      )
                    }
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Image URL
                  </label>

                  <input
                    value={form.image}
                    onChange={(event) =>
                      updateField(
                        "image",
                        event.target
                          .value,
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-sm font-semibold text-neutral-900">
                  SEO
                </h3>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-800">
                      SEO Title
                    </label>

                    <input
                      value={
                        form.seoTitle
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "seoTitle",
                          event.target
                            .value,
                        )
                      }
                      className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-800">
                      SEO Description
                    </label>

                    <textarea
                      value={
                        form.seoDescription
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          "seoDescription",
                          event.target
                            .value,
                        )
                      }
                      rows={3}
                      className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    form.isActive
                  }
                  onChange={(event) =>
                    updateField(
                      "isActive",
                      event.target
                        .checked,
                    )
                  }
                  className="h-4 w-4 rounded border-neutral-300"
                />

                <span className="text-sm font-medium text-neutral-800">
                  Category is active
                </span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Save Changes"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;