"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import { uploadImage } from "@/services/upload.service";

import type { HomepageBrandStory } from "@/types/homepage";

/* =========================================================
   TYPES
========================================================= */

interface BrandStorySectionEditorProps {
  data: HomepageBrandStory;
  onSave: (
    data: HomepageBrandStory,
  ) => Promise<void>;
}

type UploadTarget = "image" | null;

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   BRAND STORY EDITOR
========================================================= */

export function BrandStorySectionEditor({
  data,
  onSave,
}: BrandStorySectionEditorProps): ReactElement {
  const { accessToken } = useAdminAuth();

  const [form, setForm] =
    useState<HomepageBrandStory>(data);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState<UploadTarget>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /* =======================================================
     SYNC DATA
  ======================================================= */

  useEffect(() => {
    setForm(data);
  }, [data]);

  /* =======================================================
     FIELD CHANGE
  ======================================================= */

  function handleChange(
    field: keyof HomepageBrandStory,
    value: string | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];

    /*
     * Reset input so the same file can
     * be selected again if required.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!accessToken) {
      setError(
        "Authentication required. Please log in again.",
      );

      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      setError(
        "Only JPEG, PNG, and WebP images are allowed.",
      );

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image size must be 5MB or less.",
      );

      return;
    }

    setUploading("image");
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadImage(
        accessToken,
        file,
      );

      setForm((current) => ({
        ...current,
        image: result.url,
      }));

      setSuccess(
        "Image uploaded successfully.",
      );
    } catch (uploadError) {
      console.error(
        "Brand Story image upload failed:",
        uploadError,
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.",
      );
    } finally {
      setUploading(null);
    }
  }

  /* =======================================================
     REMOVE IMAGE
  ======================================================= */

  function handleRemoveImage(): void {
    setForm((current) => ({
      ...current,
      image: "",
    }));

    setError(null);
    setSuccess(null);
  }

  /* =======================================================
     SAVE
  ======================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!form.title.trim()) {
      setError(
        "Brand Story title is required.",
      );

      return;
    }

    if (!form.description.trim()) {
      setError(
        "Brand Story description is required.",
      );

      return;
    }

    if (!form.image.trim()) {
      setError(
        "Brand Story image is required.",
      );

      return;
    }

    if (!form.buttonLabel.trim()) {
      setError(
        "Button label is required.",
      );

      return;
    }

    if (!form.href.trim()) {
      setError(
        "Button link is required.",
      );

      return;
    }

    if (uploading) {
      return;
    }

    setSaving(true);

    try {
      const normalized: HomepageBrandStory = {
        enabled: form.enabled,
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description:
          form.description.trim(),
        image: form.image.trim(),
        buttonLabel:
          form.buttonLabel.trim(),
        href: form.href.trim(),
      };

      await onSave(normalized);

      setForm(normalized);

      setSuccess(
        "Brand Story saved successfully.",
      );
    } catch (saveError) {
      console.error(
        "Failed to save Brand Story:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save Brand Story.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          SECTION STATUS
      ===================================================== */}

      <div className="flex items-center justify-between border border-[#e5e0db] bg-[#faf9f7] px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#77736e]">
            Section Status
          </p>

          <p className="mt-1 text-sm text-[#393532]">
            {form.enabled
              ? "Brand Story is visible on the homepage."
              : "Brand Story is hidden from the homepage."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={form.enabled}
          aria-label={
            form.enabled
              ? "Disable Brand Story"
              : "Enable Brand Story"
          }
          onClick={() =>
            handleChange(
              "enabled",
              !form.enabled,
            )
          }
          className={`group relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b58b72]/25 focus:ring-offset-2 ${
            form.enabled
              ? "bg-[#8f6b57]"
              : "bg-[#d8d0c8]"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-[#fffdf9] shadow-[0_1px_3px_rgba(70,55,45,0.18)] transition-transform duration-200 ease-out ${
              form.enabled
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* =====================================================
          TEXT CONTENT
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Eyebrow"
          value={form.eyebrow}
          onChange={(value) =>
            handleChange(
              "eyebrow",
              value,
            )
          }
          placeholder="Our Story"
        />

        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            handleChange(
              "title",
              value,
            )
          }
          placeholder="Made for the woman you are."
        />
      </div>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <TextAreaField
        label="Description"
        value={form.description}
        onChange={(value) =>
          handleChange(
            "description",
            value,
          )
        }
        placeholder="Tell your brand story..."
      />

      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div>
        <Label text="Brand Story Image" />

        <div className="mt-2 border border-[#e3ded8] bg-[#faf9f7] p-4">
          {form.image ? (
            <div className="relative overflow-hidden border border-[#e3ded8] bg-white">
              <img
                src={form.image}
                alt="Brand Story preview"
                className="h-[320px] w-full object-cover"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading !== null}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center border border-white/60 bg-black/60 text-white transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex h-[260px] items-center justify-center border border-dashed border-[#d8d1ca] bg-white">
              <div className="text-center">
                <p className="text-sm text-[#77736e]">
                  No image selected
                </p>

                <p className="mt-1 text-xs text-[#9a928b]">
                  JPEG, PNG or WebP · Max 5MB
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              className={`inline-flex cursor-pointer items-center gap-2 border border-[#8f6b57] bg-[#8f6b57] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#fffdf9] transition hover:border-[#755644] hover:bg-[#755644] ${
                uploading
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              {uploading === "image" ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />

                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} />

                  {form.image
                    ? "Replace Image"
                    : "Upload Image"}
                </>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={
                  uploading !== null
                }
                className="hidden"
              />
            </label>

            {form.image && (
              <p className="text-xs text-[#77736e]">
                Image uploaded to Cloudinary.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Button Label"
          value={form.buttonLabel}
          onChange={(value) =>
            handleChange(
              "buttonLabel",
              value,
            )
          }
          placeholder="Discover Our Story"
        />

        <Field
          label="Button Link"
          value={form.href}
          onChange={(value) =>
            handleChange(
              "href",
              value,
            )
          }
          placeholder="/about"
        />
      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {success && !error && (
        <div className="border border-[#d9e3d8] bg-[#f4f8f2] px-4 py-3">
          <p className="text-sm text-[#557050]">
            {success}
          </p>
        </div>
      )}

      {/* =====================================================
          SAVE
      ===================================================== */}

      <div className="sticky bottom-4 z-20 flex justify-end border-t border-[#e5e0db] bg-white/95 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={
            saving ||
            uploading !== null
          }
          className="inline-flex items-center gap-2 border border-[#8f6b57] bg-[#8f6b57] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#fffdf9] transition hover:border-[#755644] hover:bg-[#755644] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2
                size={15}
                className="animate-spin"
              />

              Saving...
            </>
          ) : (
            <>
              <Save size={15} />

              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   TEXT FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}): ReactElement {
  return (
    <div>
      <Label text={label} />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full border border-[#d8d1ca] bg-white px-3 text-sm text-[#292522] outline-none transition placeholder:text-[#b0a9a2] focus:border-[#8f6b57] focus:ring-1 focus:ring-[#8f6b57]/20"
      />
    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}): ReactElement {
  return (
    <div>
      <Label text={label} />

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={6}
        className="mt-2 w-full resize-y border border-[#d8d1ca] bg-white px-3 py-3 text-sm leading-7 text-[#292522] outline-none transition placeholder:text-[#b0a9a2] focus:border-[#8f6b57] focus:ring-1 focus:ring-[#8f6b57]/20"
      />
    </div>
  );
}

/* =========================================================
   LABEL
========================================================= */

function Label({
  text,
}: {
  text: string;
}): ReactElement {
  return (
    <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#77736e]">
      {text}
    </label>
  );
}