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
  ) {
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
    if (!accessToken) {
      setErrors((current) => ({
        ...current,
        [type === "desktop"
          ? "image"
          : "mobileImage"]:
          "Authentication required.",
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
        [type === "desktop"
          ? "image"
          : "mobileImage"]:
          "Only JPEG, PNG, and WebP images are allowed.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        [type === "desktop"
          ? "image"
          : "mobileImage"]:
          "Image size must be 5MB or less.",
      }));

      return;
    }

    setUploading(type);

    setErrors((current) => ({
      ...current,
      [type === "desktop"
        ? "image"
        : "mobileImage"]: "",
    }));

    try {
      const result = await uploadImage(
        accessToken,
        file,
      );

      updateField(
        type === "desktop"
          ? "image"
          : "mobileImage",
        result.url,
      );
    } catch (error) {
      console.error(
        "Hero image upload failed:",
        error,
      );

      setErrors((current) => ({
        ...current,
        [type === "desktop"
          ? "image"
          : "mobileImage"]:
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

    await handleImageUpload(file, type);

    event.target.value = "";
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const slide: HomepageHeroSlide = {
      ...form,
      id: form.id.trim() || generateSlideId(),
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      mobileImage: form.mobileImage.trim(),
      href: form.href.trim(),
      buttonLabel: form.buttonLabel.trim(),
    };

    onSubmit(slide);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b border-[#e3ded8] pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#9a928b]">
            Hero Slide
          </p>

          <h4 className="mt-1 font-serif text-xl text-[#292624]">
            {mode === "create"
              ? "Add New Slide"
              : "Edit Slide"}
          </h4>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center border border-[#ddd7d1] text-[#77736e] hover:text-[#9f1239]"
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
            updateField("eyebrow", value)
          }
        />

        <Field
          label="Title"
          value={form.title}
          error={errors.title}
          placeholder="Timeless Elegance"
          onChange={(value) =>
            updateField("title", value)
          }
        />

        <Field
          label="Subtitle"
          value={form.subtitle}
          placeholder="Modern Indian Luxury"
          onChange={(value) =>
            updateField("subtitle", value)
          }
        />

        <div className="md:col-span-2">
          <TextArea
            label="Description"
            value={form.description}
            placeholder="Modern designs rooted in tradition."
            onChange={(value) =>
              updateField("description", value)
            }
          />
        </div>

        <ImageUploadField
          label="Desktop Image"
          value={form.image}
          error={errors.image}
          uploading={uploading === "desktop"}
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
          uploading={uploading === "mobile"}
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
            updateField("buttonLabel", value)
          }
        />

        <Field
          label="Button Link"
          value={form.href}
          error={errors.href}
          placeholder="/collections/new-arrivals"
          onChange={(value) =>
            updateField("href", value)
          }
        />

        <Field
          label="Start Date"
          type="datetime-local"
          value={toDateTimeLocal(form.startsAt)}
          onChange={(value) =>
            updateField(
              "startsAt",
              value
                ? new Date(value).toISOString()
                : null,
            )
          }
        />

        <Field
          label="End Date"
          type="datetime-local"
          value={toDateTimeLocal(form.endsAt)}
          error={errors.endsAt}
          onChange={(value) =>
            updateField(
              "endsAt",
              value
                ? new Date(value).toISOString()
                : null,
            )
          }
        />
      </div>

      <div className="flex items-center justify-between border-t border-[#e3ded8] pt-5">
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
            className="h-4 w-4 accent-[#9f1239]"
          />

          <span className="text-xs text-[#55504b]">
            Slide is active
          </span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#d6d0ca] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#55504b]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading !== null}
            className="bg-[#9f1239] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-60"
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
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#77736e]">
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
        <div className="overflow-hidden border border-[#dcd6d0] bg-[#faf9f7]">
          <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#f1eeeb]">
            <img
              src={value}
              alt={`${label} preview`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#e3ded8] px-3 py-3">
            <p className="min-w-0 truncate text-[11px] text-[#77736e]">
              {value}
            </p>

            <button
              type="button"
              onClick={onUpload}
              disabled={uploading}
              className="flex shrink-0 items-center gap-2 border border-[#d6d0ca] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#55504b] hover:border-[#9f1239] hover:text-[#9f1239] disabled:opacity-50"
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
          className="flex min-h-[145px] w-full flex-col items-center justify-center border border-dashed border-[#d6d0ca] bg-[#faf9f7] px-4 text-center transition hover:border-[#9f1239] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin text-[#9f1239]"
              />

              <span className="mt-3 text-xs font-medium text-[#55504b]">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <Upload
                size={20}
                className="text-[#9f1239]"
              />

              <span className="mt-3 text-xs font-medium uppercase tracking-[0.1em] text-[#55504b]">
                Upload Image
              </span>

              <span className="mt-1 text-[11px] text-[#9a928b]">
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
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#77736e]">
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
          "h-11 w-full border bg-white px-3 text-sm text-[#393532] outline-none transition placeholder:text-[#aaa39d] focus:border-[#9f1239]",
          error
            ? "border-red-400"
            : "border-[#dcd6d0]",
          disabled
            ? "cursor-not-allowed bg-[#f5f2ef] text-[#8b847d]"
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
      <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.15em] text-[#77736e]">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-none border border-[#dcd6d0] bg-white px-3 py-3 text-sm text-[#393532] outline-none transition placeholder:text-[#aaa39d] focus:border-[#9f1239]"
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