"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

import { uploadImage } from "@/services/upload.service";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import type { HomepageHeroSlide } from "@/types/homepage";

interface HeroSlideFormProps {
  mode: "create" | "edit";
  initialData?: HomepageHeroSlide;
  onSubmit: (slide: HomepageHeroSlide) => void;
  onCancel: () => void;
}

const emptySlide: HomepageHeroSlide = {
  id: "",
  eyebrow: "",
  title: "",
  subtitle: "",
  description: "",
  image: "",
  mobileImage: "",
  href: "",
  buttonLabel: "",
  sortOrder: 1,
  isActive: true,
  startsAt: null,
  endsAt: null,
};

export function HeroSlideForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: HeroSlideFormProps) {
  const { accessToken } = useAdminAuth();

  const [form, setForm] = useState<HomepageHeroSlide>(
    initialData ?? emptySlide,
  );

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [uploading, setUploading] = useState<
    "desktop" | "mobile" | null
  >(null);

  const desktopInputRef =
    useRef<HTMLInputElement>(null);

  const mobileInputRef =
    useRef<HTMLInputElement>(null);

  function updateField<K extends keyof HomepageHeroSlide>(
    field: K,
    value: HomepageHeroSlide[K],
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};

    if (mode === "edit" && !form.id.trim()) {
      nextErrors.id = "Slide ID is required.";
    }

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!form.image.trim()) {
      nextErrors.image =
        "Desktop image is required.";
    }

    if (!form.href.trim()) {
      nextErrors.href = "Link is required.";
    }

    if (!form.buttonLabel.trim()) {
      nextErrors.buttonLabel =
        "Button label is required.";
    }

    if (
      form.startsAt &&
      form.endsAt &&
      new Date(form.endsAt).getTime() <=
        new Date(form.startsAt).getTime()
    ) {
      nextErrors.endsAt =
        "End date must be after start date.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function generateSlideId(): string {
    return `hero-${Date.now()}`;
  }

  async function handleImageUpload(
    file: File,
    type: "desktop" | "mobile",
  ): Promise<void> {
    const field =
      type === "desktop"
        ? "image"
        : "mobileImage";

    if (!accessToken) {
      setErrors((current) => ({
        ...current,
        [field]: "Authentication required.",
      }));

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        [field]:
          "Only JPEG, PNG, and WebP images are allowed.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        [field]:
          "Image size must be 5MB or less.",
      }));

      return;
    }

    /*
     * A new hero slide needs an ID before
     * its images can be uploaded.
     *
     * Existing slides keep their existing ID.
     */
    const slideId =
      form.id.trim() || generateSlideId();

    /*
     * Store the generated ID immediately.
     * This ensures desktop and mobile uploads
     * use the same slide ID.
     */
    if (!form.id.trim()) {
      setForm((current) => ({
        ...current,
        id: slideId,
      }));
    }

    setUploading(type);

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    try {
      const result = await uploadImage(
        accessToken,
        file,
        {
          resource: "homepage",
          resourceId: slideId,
          folder: type,
        },
      );

      updateField(
        field,
        result.url,
      );
    } catch (error) {
      console.error(
        "Hero image upload failed:",
        error,
      );

      setErrors((current) => ({
        ...current,
        [field]:
          error instanceof Error
            ? error.message
            : "Failed to upload image.",
      }));
    } finally {
      setUploading(null);
    }
  }

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile",
  ): Promise<void> {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await handleImageUpload(
      file,
      type,
    );

    event.target.value = "";
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const slide: HomepageHeroSlide = {
      ...form,
      id:
        form.id.trim() ||
        generateSlideId(),
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description:
        form.description.trim(),
      image: form.image.trim(),
      mobileImage:
        form.mobileImage.trim(),
      href: form.href.trim(),
      buttonLabel:
        form.buttonLabel.trim(),
    };

    onSubmit(slide);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b border-[#e5e7ec] pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#737a8c]">
            Hero Slide
          </p>

          <h4 className="mt-1 font-serif text-xl text-[#0f172a]">
            {mode === "create"
              ? "Add New Slide"
              : "Edit Slide"}
          </h4>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center border border-[#d3d7df] text-[#5b6270] hover:text-[#4338ca]"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Slide ID"
          value={form.id}
          error={errors.id}
          placeholder={
            mode === "create"
              ? "Auto-generated"
              : "hero-01"
          }
          disabled={mode === "create"}
          onChange={(value) =>
            updateField("id", value)
          }
        />

        <Field
          label="Eyebrow"
          value={form.eyebrow}
          placeholder="New Season"
          onChange={(value) =>
            updateField(
              "eyebrow",
              value,
            )
          }
        />

        <Field
          label="Title"
          value={form.title}
          error={errors.title}
          placeholder="Timeless Elegance"
          onChange={(value) =>
            updateField(
              "title",
              value,
            )
          }
        />

        <Field
          label="Subtitle"
          value={form.subtitle}
          placeholder="Modern Indian Luxury"
          onChange={(value) =>
            updateField(
              "subtitle",
              value,
            )
          }
        />

        <div className="md:col-span-2">
          <TextArea
            label="Description"
            value={form.description}
            placeholder="Modern designs rooted in tradition."
            onChange={(value) =>
              updateField(
                "description",
                value,
              )
            }
          />
        </div>

        <ImageUploadField
          label="Desktop Image"
          value={form.image}
          error={errors.image}
          uploading={
            uploading === "desktop"
          }
          inputRef={desktopInputRef}
          onUpload={() =>
            desktopInputRef.current?.click()
          }
          onFileChange={(event) =>
            void handleFileChange(
              event,
              "desktop",
            )
          }
        />

        <ImageUploadField
          label="Mobile Image"
          value={form.mobileImage}
          error={errors.mobileImage}
          uploading={
            uploading === "mobile"
          }
          inputRef={mobileInputRef}
          onUpload={() =>
            mobileInputRef.current?.click()
          }
          onFileChange={(event) =>
            void handleFileChange(
              event,
              "mobile",
            )
          }
        />

        <Field
          label="Button Label"
          value={form.buttonLabel}
          error={errors.buttonLabel}
          placeholder="Shop Collection"
          onChange={(value) =>
            updateField(
              "buttonLabel",
              value,
            )
          }
        />

        <Field
          label="Button Link"
          value={form.href}
          error={errors.href}
          placeholder="/collections/new-arrivals"
          onChange={(value) =>
            updateField(
              "href",
              value,
            )
          }
        />

        <Field
          label="Start Date"
          type="datetime-local"
          value={toDateTimeLocal(
            form.startsAt,
          )}
          onChange={(value) =>
            updateField(
              "startsAt",
              value
                ? new Date(
                    value,
                  ).toISOString()
                : null,
            )
          }
        />

        <Field
          label="End Date"
          type="datetime-local"
          value={toDateTimeLocal(
            form.endsAt,
          )}
          error={errors.endsAt}
          onChange={(value) =>
            updateField(
              "endsAt",
              value
                ? new Date(
                    value,
                  ).toISOString()
                : null,
            )
          }
        />
      </div>

      <div className="flex items-center justify-between border-t border-[#e5e7ec] pt-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              updateField(
                "isActive",
                event.target.checked,
              )
            }
            className="h-4 w-4 accent-[#4338ca]"
          />

          <span className="text-xs text-[#5b6270]">
            Slide is active
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#d3d7df] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#5b6270]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading !== null}
            className="bg-[#4338ca] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[#3730a3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === "create"
              ? "Add Slide"
              : "Update Slide"}
          </button>
        </div>
      </div>
    </form>
  );
}

interface ImageUploadFieldProps {
  label: string;
  value: string;
  error?: string;
  uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: () => void;
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

function ImageUploadField({
  label,
  value,
  error,
  uploading,
  inputRef,
  onUpload,
  onFileChange,
}: ImageUploadFieldProps) {
  return (
    <div>
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#5b6270]">
        {label}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className="hidden"
      />

      {value ? (
        <div className="overflow-hidden border border-[#d3d7df] bg-[#f6f7fb]">
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#e5e7ec]">
            <img
              src={value}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7ec] px-3 py-3">
            <p className="min-w-0 truncate text-[11px] text-[#5b6270]">
              {value}
            </p>

            <button
              type="button"
              onClick={onUpload}
              disabled={uploading}
              className="flex shrink-0 items-center gap-2 border border-[#d3d7df] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#5b6270] hover:border-[#4338ca] hover:text-[#4338ca] disabled:opacity-50"
            >
              {uploading ? (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Upload size={13} />
              )}

              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          disabled={uploading}
          className="flex min-h-[145px] w-full flex-col items-center justify-center border border-dashed border-[#d3d7df] bg-[#f6f7fb] px-4 text-center transition hover:border-[#4338ca] hover:bg-[#ffffff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin text-[#4338ca]"
              />

              <span className="mt-3 text-xs font-medium text-[#5b6270]">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <Upload
                size={20}
                className="text-[#4338ca]"
              />

              <span className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-[#5b6270]">
                Upload Image
              </span>

              <span className="mt-1 text-[11px] text-[#737a8c]">
                JPEG, PNG or WebP · Max 5MB
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <span className="mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  error,
  disabled = false,
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#5b6270]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={[
          "h-11 w-full border bg-[#ffffff] px-3 text-sm text-[#0f172a] outline-none transition placeholder:text-[#737a8c] focus:border-[#4338ca]",
          error
            ? "border-red-400"
            : "border-[#d3d7df]",
          disabled
            ? "cursor-not-allowed bg-[#eef0f4] text-[#737a8c]"
            : "",
        ].join(" ")}
      />

      {error && (
        <span className="mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function TextArea({
  label,
  value,
  placeholder,
  onChange,
}: TextAreaProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#5b6270]">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-none border border-[#d3d7df] bg-[#ffffff] px-3 py-3 text-sm text-[#0f172a] outline-none transition placeholder:text-[#737a8c] focus:border-[#4338ca]"
      />
    </label>
  );
}

function toDateTimeLocal(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const hours = String(
    date.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}