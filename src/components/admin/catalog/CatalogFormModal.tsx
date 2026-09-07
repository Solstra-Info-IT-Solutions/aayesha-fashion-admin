"use client";

import {
  Loader2,
  X,
} from "lucide-react";

import type {
  AttributeType,
  BadgeTone,
  CatalogFormState,
  CatalogResource,
} from "@/types/catalog";

type Option = {
  value: string;
  label: string;
};

type Props = {
  resource: CatalogResource;
  title: string;
  form: CatalogFormState;
  saving: boolean;
  error: string;
  categoryOptions?: Option[];
  isEditing: boolean;
  onChange: (
    key: string,
    value: string | boolean,
  ) => void;
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void;
  onClose: () => void;
};

/* =========================================================
   FIELD HELPERS
========================================================= */

function getString(
  form: CatalogFormState,
  key: string,
): string {
  const value = form[key];

  return typeof value === "string"
    ? value
    : "";
}

function getBoolean(
  form: CatalogFormState,
  key: string,
): boolean {
  return form[key] === true;
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      />
    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      >
        {options.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ),
        )}
      </select>
    </div>
  );
}

/* =========================================================
   ACTIVE FIELD
========================================================= */

function ActiveField({
  value,
  onChange,
  label = "Active",
}: {
  value: boolean;
  onChange: (
    value: boolean,
  ) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="h-4 w-4 rounded border-neutral-300"
      />

      <span className="text-sm font-medium text-neutral-800">
        {label}
      </span>
    </label>
  );
}

/* =========================================================
   MODAL
========================================================= */

export default function CatalogFormModal({
  resource,
  title,
  form,
  saving,
  error,
  categoryOptions = [],
  isEditing,
  onChange,
  onSubmit,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {title}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              {isEditing
                ? "Update the existing catalog record."
                : "Create a new catalog record."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* =================================================
              CATEGORIES
          ================================================= */}

          {resource ===
            "categories" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange(
                      "name",
                      value,
                    )
                  }
                  placeholder="Sarees"
                />

                <Input
                  label="Slug"
                  value={getString(
                    form,
                    "slug",
                  )}
                  onChange={(value) =>
                    onChange(
                      "slug",
                      value.toLowerCase(),
                    )
                  }
                  placeholder="sarees"
                />
              </div>

              <TextArea
                label="Description"
                value={getString(
                  form,
                  "description",
                )}
                onChange={(value) =>
                  onChange(
                    "description",
                    value,
                  )
                }
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Select
                  label="Parent Category"
                  value={getString(
                    form,
                    "parentId",
                  )}
                  options={[
                    {
                      value: "",
                      label:
                        "No Parent",
                    },
                    ...categoryOptions,
                  ]}
                  onChange={(value) =>
                    onChange(
                      "parentId",
                      value,
                    )
                  }
                />

                <Input
                  label="Sort Order"
                  type="number"
                  value={getString(
                    form,
                    "sortOrder",
                  )}
                  onChange={(value) =>
                    onChange(
                      "sortOrder",
                      value,
                    )
                  }
                />
              </div>

              <Input
                label="Image URL"
                value={getString(
                  form,
                  "image",
                )}
                onChange={(value) =>
                  onChange(
                    "image",
                    value,
                  )
                }
                placeholder="https://..."
              />

              <div className="border-t border-neutral-200 pt-5">
                <p className="text-sm font-semibold text-neutral-900">
                  SEO
                </p>

                <div className="mt-4 space-y-4">
                  <Input
                    label="SEO Title"
                    value={getString(
                      form,
                      "seoTitle",
                    )}
                    onChange={(value) =>
                      onChange(
                        "seoTitle",
                        value,
                      )
                    }
                  />

                  <TextArea
                    label="SEO Description"
                    value={getString(
                      form,
                      "seoDescription",
                    )}
                    onChange={(value) =>
                      onChange(
                        "seoDescription",
                        value,
                      )
                    }
                  />
                </div>
              </div>

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              COLLECTIONS
          ================================================= */}

          {resource ===
            "collections" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange(
                      "name",
                      value,
                    )
                  }
                  placeholder="Festive Edit"
                />

                <Input
                  label="Slug"
                  value={getString(
                    form,
                    "slug",
                  )}
                  onChange={(value) =>
                    onChange(
                      "slug",
                      value.toLowerCase(),
                    )
                  }
                  placeholder="festive-edit"
                />
              </div>

              <TextArea
                label="Description"
                value={getString(
                  form,
                  "description",
                )}
                onChange={(value) =>
                  onChange(
                    "description",
                    value,
                  )
                }
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Image URL"
                  value={getString(
                    form,
                    "image",
                  )}
                  onChange={(value) =>
                    onChange(
                      "image",
                      value,
                    )
                  }
                />

                <Input
                  label="Banner Image URL"
                  value={getString(
                    form,
                    "bannerImage",
                  )}
                  onChange={(value) =>
                    onChange(
                      "bannerImage",
                      value,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Sort Order"
                  type="number"
                  value={getString(
                    form,
                    "sortOrder",
                  )}
                  onChange={(value) =>
                    onChange(
                      "sortOrder",
                      value,
                    )
                  }
                />

                <Select
                  label="Featured"
                  value={
                    getBoolean(
                      form,
                      "isFeatured",
                    )
                      ? "true"
                      : "false"
                  }
                  options={[
                    {
                      value: "false",
                      label: "No",
                    },
                    {
                      value: "true",
                      label: "Yes",
                    },
                  ]}
                  onChange={(value) =>
                    onChange(
                      "isFeatured",
                      value ===
                        "true",
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Starts At"
                  type="datetime-local"
                  value={getString(
                    form,
                    "startsAt",
                  )}
                  onChange={(value) =>
                    onChange(
                      "startsAt",
                      value,
                    )
                  }
                />

                <Input
                  label="Ends At"
                  type="datetime-local"
                  value={getString(
                    form,
                    "endsAt",
                  )}
                  onChange={(value) =>
                    onChange(
                      "endsAt",
                      value,
                    )
                  }
                />
              </div>

              <div className="border-t border-neutral-200 pt-5">
                <p className="text-sm font-semibold text-neutral-900">
                  SEO
                </p>

                <div className="mt-4 space-y-4">
                  <Input
                    label="SEO Title"
                    value={getString(
                      form,
                      "seoTitle",
                    )}
                    onChange={(value) =>
                      onChange(
                        "seoTitle",
                        value,
                      )
                    }
                  />

                  <TextArea
                    label="SEO Description"
                    value={getString(
                      form,
                      "seoDescription",
                    )}
                    onChange={(value) =>
                      onChange(
                        "seoDescription",
                        value,
                      )
                    }
                  />
                </div>
              </div>

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              TAGS
          ================================================= */}

          {resource === "tags" && (
            <div className="space-y-5">
              <Input
                label="Name"
                value={getString(
                  form,
                  "name",
                )}
                onChange={(value) =>
                  onChange(
                    "name",
                    value,
                  )
                }
                placeholder="New Arrival"
              />

              <Input
                label="Slug"
                value={getString(
                  form,
                  "slug",
                )}
                onChange={(value) =>
                  onChange(
                    "slug",
                    value.toLowerCase(),
                  )
                }
                placeholder="new-arrival"
              />

              <TextArea
                label="Description"
                value={getString(
                  form,
                  "description",
                )}
                onChange={(value) =>
                  onChange(
                    "description",
                    value,
                  )
                }
              />

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              BADGES
          ================================================= */}

          {resource ===
            "badges" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange(
                      "name",
                      value,
                    )
                  }
                  placeholder="Bestseller"
                />

                <Input
                  label="Slug"
                  value={getString(
                    form,
                    "slug",
                  )}
                  onChange={(value) =>
                    onChange(
                      "slug",
                      value.toLowerCase(),
                    )
                  }
                  placeholder="bestseller"
                />
              </div>

              <Input
                label="Label"
                value={getString(
                  form,
                  "label",
                )}
                onChange={(value) =>
                  onChange(
                    "label",
                    value,
                  )
                }
                placeholder="Bestseller"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Select
                  label="Tone"
                  value={getString(
                    form,
                    "tone",
                  )}
                  options={[
                    "neutral",
                    "rose",
                    "dark",
                    "success",
                    "warning",
                    "danger",
                  ].map(
                    (tone) => ({
                      value: tone,
                      label:
                        tone
                          .charAt(
                            0,
                          )
                          .toUpperCase() +
                        tone.slice(
                          1,
                        ),
                    }),
                  )}
                  onChange={(value) =>
                    onChange(
                      "tone",
                      value as BadgeTone,
                    )
                  }
                />

                <Input
                  label="Sort Order"
                  type="number"
                  value={getString(
                    form,
                    "sortOrder",
                  )}
                  onChange={(value) =>
                    onChange(
                      "sortOrder",
                      value,
                    )
                  }
                />
              </div>

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              ATTRIBUTES
          ================================================= */}

          {resource ===
            "attributes" && (
            <div className="space-y-5">
              <Input
                label="Key"
                value={getString(
                  form,
                  "key",
                )}
                onChange={(value) =>
                  onChange(
                    "key",
                    value
                      .toLowerCase()
                      .replace(
                        /[^a-z0-9_]/g,
                        "",
                      ),
                  )
                }
                placeholder="fabric"
              />

              <Input
                label="Label"
                value={getString(
                  form,
                  "label",
                )}
                onChange={(value) =>
                  onChange(
                    "label",
                    value,
                  )
                }
                placeholder="Fabric"
              />

              <Select
                label="Type"
                value={getString(
                  form,
                  "type",
                )}
                options={[
                  "text",
                  "number",
                  "boolean",
                  "single_select",
                  "multi_select",
                ].map(
                  (type) => ({
                    value: type,
                    label:
                      type
                        .replace(
                          /_/g,
                          " ",
                        )
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase(),
                        ),
                  }),
                )}
                onChange={(value) =>
                  onChange(
                    "type",
                    value as AttributeType,
                  )
                }
              />

              <Input
                label="Options"
                value={getString(
                  form,
                  "options",
                )}
                onChange={(value) =>
                  onChange(
                    "options",
                    value,
                  )
                }
                placeholder="Cotton, Silk, Linen"
              />

              <Input
                label="Sort Order"
                type="number"
                value={getString(
                  form,
                  "sortOrder",
                )}
                onChange={(value) =>
                  onChange(
                    "sortOrder",
                    value,
                  )
                }
              />

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              SIZES
          ================================================= */}

          {resource === "sizes" && (
            <div className="space-y-5">
              <Input
                label="Code"
                value={getString(
                  form,
                  "code",
                )}
                onChange={(value) =>
                  onChange(
                    "code",
                    value.toUpperCase(),
                  )
                }
                placeholder="M"
              />

              <Input
                label="Label"
                value={getString(
                  form,
                  "label",
                )}
                onChange={(value) =>
                  onChange(
                    "label",
                    value,
                  )
                }
                placeholder="Medium"
              />

              <Input
                label="Sort Order"
                type="number"
                value={getString(
                  form,
                  "sortOrder",
                )}
                onChange={(value) =>
                  onChange(
                    "sortOrder",
                    value,
                  )
                }
              />

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* =================================================
              COLORS
          ================================================= */}

          {resource ===
            "colors" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange(
                      "name",
                      value,
                    )
                  }
                  placeholder="Rose"
                />

                <Input
                  label="Slug"
                  value={getString(
                    form,
                    "slug",
                  )}
                  onChange={(value) =>
                    onChange(
                      "slug",
                      value.toLowerCase(),
                    )
                  }
                  placeholder="rose"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Hex Color"
                  value={getString(
                    form,
                    "hex",
                  )}
                  onChange={(value) =>
                    onChange(
                      "hex",
                      value,
                    )
                  }
                  placeholder="#EFA7AE"
                />

                <Input
                  label="Swatch Image URL"
                  value={getString(
                    form,
                    "swatchImage",
                  )}
                  onChange={(value) =>
                    onChange(
                      "swatchImage",
                      value,
                    )
                  }
                />
              </div>

              <Input
                label="Sort Order"
                type="number"
                value={getString(
                  form,
                  "sortOrder",
                )}
                onChange={(value) =>
                  onChange(
                    "sortOrder",
                    value,
                  )
                }
              />

              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
                <span
                  className="h-10 w-10 rounded-full border border-neutral-200"
                  style={{
                    backgroundColor:
                      getString(
                        form,
                        "hex",
                      ) ||
                      "#ffffff",
                  }}
                />

                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    Color Preview
                  </p>

                  <p className="text-xs text-neutral-500">
                    {getString(
                      form,
                      "hex",
                    ) ||
                      "No hex value"}
                  </p>
                </div>
              </div>

              <ActiveField
                value={getBoolean(
                  form,
                  "isActive",
                )}
                onChange={(value) =>
                  onChange(
                    "isActive",
                    value,
                  )
                }
              />
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onClose}
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
                : isEditing
                  ? "Save Changes"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}