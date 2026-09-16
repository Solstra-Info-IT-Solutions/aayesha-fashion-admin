"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import type {
  AttributeType,
  BadgeTone,
  CatalogFormState,
  CatalogResource,
} from "@/types/catalog";

import {
  ImageSelectorModal,
} from "@/components/media/ImageSelectorModal";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

import type {
  ListedImage,
} from "@/services/upload.service";

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

  onPendingImageChange: (
    field: "image" | "bannerImage",
    file: File | null,
  ) => void;

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
  ) => void;

  onClose: () => void;
};

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

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ActiveField({
  value,
  onChange,
  label = "Active",
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-4 w-4 rounded border-neutral-300"
      />

      <span className="text-sm font-medium text-neutral-800">
        {label}
      </span>
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onSelect,
  onPendingImageChange,
  disabled,
  isEditing,
  helperText,
  selectTitle = "Select from media library",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: () => void;
  onPendingImageChange: (
    file: File | null,
  ) => void;
  disabled: boolean;
  isEditing: boolean;
  helperText?: string;
  selectTitle?: string;
}) {
  const [
    pendingFile,
    setPendingFile,
  ] = useState<File | null>(null);

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      window.alert(
        "Only JPEG, PNG, and WebP images are allowed.",
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert(
        "Image size must be 5 MB or less.",
      );

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreviewUrl =
      URL.createObjectURL(file);

    setPendingFile(file);
    setPreviewUrl(nextPreviewUrl);

    onPendingImageChange(file);
  }

  function removePendingImage(): void {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPendingFile(null);
    setPreviewUrl("");

    onPendingImageChange(null);
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="https://..."
          className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-400"
        />

        {isEditing ? (
          <button
            type="button"
            onClick={onSelect}
            disabled={disabled}
            title={selectTitle}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ImageIcon className="h-4 w-4" />
            Select
          </button>
        ) : (
          <label
            className={[
              "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-white",
              disabled
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : "",
            ].join(" ")}
          >
            <Upload className="h-4 w-4" />
            Choose Image

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        )}
      </div>

      {helperText && (
        <p className="mt-1.5 text-xs text-neutral-400">
          {helperText}
        </p>
      )}

      {pendingFile && previewUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="aspect-[16/7] w-full">
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 px-3 py-2">
            <p className="min-w-0 truncate text-xs text-neutral-600">
              {pendingFile.name}
            </p>

            <button
              type="button"
              onClick={removePendingImage}
              disabled={disabled}
              className="ml-3 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {!pendingFile && value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="aspect-[16/7] w-full">
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CatalogFormModal({
  resource,
  title,
  form,
  saving,
  error,
  categoryOptions = [],
  isEditing,
  onChange,
  onPendingImageChange,
  onSubmit,
  onClose,
}: Props) {
  const { accessToken } =
    useAdminAuth();

  const [
    imageSelector,
    setImageSelector,
  ] = useState<{
    open: boolean;
    field: "image" | "bannerImage";
    folder: "images" | "banners";
  }>({
    open: false,
    field: "image",
    folder: "images",
  });

  const resourceId =
    getString(form, "id");

  function openImageSelector(
    field: "image" | "bannerImage",
    folder: "images" | "banners",
  ): void {
    if (!isEditing || !resourceId) {
      return;
    }

    setImageSelector({
      open: true,
      field,
      folder,
    });
  }

  function handleImageSelected(
    image: ListedImage,
  ): void {
    onChange(
      imageSelector.field,
      image.url,
    );

    setImageSelector(
      (current) => ({
        ...current,
        open: false,
      }),
    );
  }

  function closeImageSelector(): void {
    setImageSelector(
      (current) => ({
        ...current,
        open: false,
      }),
    );
  }

  const canSelectImages =
    isEditing &&
    Boolean(resourceId) &&
    Boolean(accessToken);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
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

        <form
          onSubmit={onSubmit}
          className="overflow-y-auto p-6"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {resource === "categories" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(form, "name")}
                  onChange={(value) =>
                    onChange("name", value)
                  }
                  placeholder="Sarees"
                />

                <Input
                  label="Slug"
                  value={getString(form, "slug")}
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
                      label: "No Parent",
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

              <ImageField
                label="Category Image"
                value={getString(
                  form,
                  "image",
                )}
                onChange={(value) =>
                  onChange("image", value)
                }
                onSelect={() =>
                  openImageSelector(
                    "image",
                    "images",
                  )
                }
                onPendingImageChange={(file) =>
                  onPendingImageChange(
                    "image",
                    file,
                  )
                }
                disabled={saving}
                isEditing={isEditing}
                helperText={
                  isEditing
                    ? "Select an existing image from the category media library."
                    : "Choose an image. It will be uploaded after the category is created."
                }
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

              <div className="space-y-3">
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

  <ActiveField
    value={getBoolean(
      form,
      "isFeatured",
    )}
    onChange={(value) =>
      onChange(
        "isFeatured",
        value,
      )
    }
    label="Featured on Homepage"
  />

  <p className="ml-1 text-xs text-neutral-500">
    Show this category in the Featured Categories section on the homepage.
  </p>
</div>
            </div>
          )}

          {resource === "collections" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange("name", value)
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

              <div className="space-y-5">
                <ImageField
                  label="Collection Image"
                  value={getString(
                    form,
                    "image",
                  )}
                  onChange={(value) =>
                    onChange("image", value)
                  }
                  onSelect={() =>
                    openImageSelector(
                      "image",
                      "images",
                    )
                  }
                  onPendingImageChange={(file) =>
                    onPendingImageChange(
                      "image",
                      file,
                    )
                  }
                  disabled={saving}
                  isEditing={isEditing}
                  helperText={
                    isEditing
                      ? "Select an existing image from the collection media library."
                      : "Choose an image. It will be uploaded after the collection is created."
                  }
                />

                <ImageField
                  label="Collection Banner"
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
                  onSelect={() =>
                    openImageSelector(
                      "bannerImage",
                      "banners",
                    )
                  }
                  onPendingImageChange={(file) =>
                    onPendingImageChange(
                      "bannerImage",
                      file,
                    )
                  }
                  disabled={saving}
                  isEditing={isEditing}
                  helperText={
                    isEditing
                      ? "Select an existing banner from the collection media library."
                      : "Choose a banner. It will be uploaded after the collection is created."
                  }
                  selectTitle="Select from collection banner library"
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
                      value === "true",
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

          {resource === "tags" && (
            <div className="space-y-5">
              <Input
                label="Name"
                value={getString(
                  form,
                  "name",
                )}
                onChange={(value) =>
                  onChange("name", value)
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

          {resource === "badges" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange("name", value)
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
                  onChange("label", value)
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
                  ].map((tone) => ({
                    value: tone,
                    label:
                      tone.charAt(0).toUpperCase() +
                      tone.slice(1),
                  }))}
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

          {resource === "attributes" && (
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
                ].map((type) => ({
                  value: type,
                  label: type
                    .replace(/_/g, " ")
                    .replace(
                      /\b\w/g,
                      (char) =>
                        char.toUpperCase(),
                    ),
                }))}
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

          {resource === "colors" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Input
                  label="Name"
                  value={getString(
                    form,
                    "name",
                  )}
                  onChange={(value) =>
                    onChange("name", value)
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
                    onChange("hex", value)
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
                      ) || "#ffffff",
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
                    ) || "No hex value"}
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

      <ImageSelectorModal
        open={imageSelector.open}
        accessToken={accessToken}
        resource={
          resource === "categories"
            ? "category"
            : "collection"
        }
        resourceId={resourceId}
        folder={imageSelector.folder}
        selectedUrl={getString(
          form,
          imageSelector.field,
        )}
        title={
          imageSelector.folder === "banners"
            ? "Select Collection Banner"
            : resource === "categories"
              ? "Select Category Image"
              : "Select Collection Image"
        }
        onSelect={handleImageSelected}
        onClose={closeImageSelector}
      />
    </div>
  );
}