"use client";

import {
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import type { HomepageInstagram } from "@/types/homepage";

import { RichTextEditor } from "./RichTextEditor";

interface InstagramSectionEditorProps {
  data: HomepageInstagram;
  onSave: (
    data: HomepageInstagram,
  ) => Promise<void>;
}

export function InstagramSectionEditor({
  data,
  onSave,
}: InstagramSectionEditorProps): ReactElement {
  const [form, setForm] =
    useState<HomepageInstagram>(normalizeData(data));

  const [saving, setSaving] = useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    setForm(normalizeData(data));
  }, [data]);

  function updateSection(
    field:
      | "enabled"
      | "eyebrow"
      | "title"
      | "description"
      | "username"
      | "href",
    value: string | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  function handleAddImage(): void {
    setForm((current) => ({
      ...current,
      images: [
        ...current.images,
        {
          id: `instagram-${Date.now()}`,
          image: "",
          alt: "",
          href: "",
          sortOrder: current.images.length + 1,
          isActive: true,
        },
      ],
    }));

    setError(null);
    setSuccess(null);
  }

  function handleUpdateImage(
    id: string,
    field:
      | "image"
      | "alt"
      | "href"
      | "sortOrder"
      | "isActive",
    value: string | number | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      images: current.images.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));

    setError(null);
    setSuccess(null);
  }

  function handleDeleteImage(id: string): void {
    setForm((current) => ({
      ...current,
      images: normalizeImages(
        current.images.filter(
          (item) => item.id !== id,
        ),
      ),
    }));

    setError(null);
    setSuccess(null);
  }

  function moveImage(
    index: number,
    direction: "up" | "down",
  ): void {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= form.images.length
    ) {
      return;
    }

    const images = [...form.images];

    const currentImage = images[index];

    images[index] = images[targetIndex];
    images[targetIndex] = currentImage;

    setForm((current) => ({
      ...current,
      images: normalizeImages(images),
    }));

    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!form.title.trim()) {
      setError(
        "Instagram title is required.",
      );
      return;
    }

    if (!stripHtml(form.description).trim()) {
      setError(
        "Instagram description is required.",
      );
      return;
    }

    if (!form.username.trim()) {
      setError(
        "Instagram username is required.",
      );
      return;
    }

    if (!form.href.trim()) {
      setError(
        "Instagram profile link is required.",
      );
      return;
    }

    for (const image of form.images) {
      if (!image.image.trim()) {
        setError(
          "Every Instagram image must have an image URL.",
        );
        return;
      }

      if (!image.alt.trim()) {
        setError(
          "Every Instagram image must have alt text.",
        );
        return;
      }
    }

    setSaving(true);

    try {
      const normalized: HomepageInstagram = {
        enabled: form.enabled,
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        username: form.username.trim(),
        href: form.href.trim(),
        images: normalizeImages(form.images),
      };

      await onSave(normalized);

      setForm(normalized);

      setSuccess(
        "Instagram section saved successfully.",
      );
    } catch (saveError) {
      console.error(
        "Failed to save Instagram section:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save Instagram section.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <SectionStatus
        enabled={form.enabled}
        onChange={(value) =>
          updateSection("enabled", value)
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Eyebrow"
          value={form.eyebrow}
          onChange={(value) =>
            updateSection("eyebrow", value)
          }
          placeholder="Follow Ayesha"
        />

        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            updateSection("title", value)
          }
          placeholder="Ayesha on Instagram"
        />
      </div>

      <RichTextEditor
        label="Description"
        value={form.description}
        onChange={(value) =>
          updateSection("description", value)
        }
        placeholder="Invite customers to follow your Instagram..."
        minHeight={180}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Instagram Username"
          value={form.username}
          onChange={(value) =>
            updateSection("username", value)
          }
          placeholder="@aayeshafashion"
        />

        <Field
          label="Instagram Profile Link"
          value={form.href}
          onChange={(value) =>
            updateSection("href", value)
          }
          placeholder="https://instagram.com/..."
        />
      </div>

      <div className="border-t border-[#2e2a26] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
              Instagram Gallery
            </p>

            <p className="mt-1 text-sm text-[#f8f3f1]">
              Add the images displayed in the Instagram section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddImage}
            className="inline-flex shrink-0 items-center gap-2 border border-[#f8f3f1] bg-[#b79a6a] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#1a1816] transition hover:bg-[#c8ad7f] rounded-lg"
          >
            <Plus size={15} />
            Add Image
          </button>
        </div>
      </div>

      {form.images.length === 0 ? (
        <EmptyState
          title="No Instagram images yet."
          description="Add your first Instagram gallery image."
          buttonLabel="Add First Image"
          onClick={handleAddImage}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {form.images.map((image, index) => (
            <InstagramImageCard
              key={image.id}
              image={image}
              index={index}
              totalImages={form.images.length}
              onUpdate={handleUpdateImage}
              onDelete={handleDeleteImage}
              onMove={moveImage}
            />
          ))}
        </div>
      )}

      <Messages
        error={error}
        success={success}
      />

      <SaveButton saving={saving} />
    </form>
  );
}

function InstagramImageCard({
  image,
  index,
  totalImages,
  onUpdate,
  onDelete,
  onMove,
}: {
  image: HomepageInstagram["images"][number];
  index: number;
  totalImages: number;
  onUpdate: (
    id: string,
    field:
      | "image"
      | "alt"
      | "href"
      | "sortOrder"
      | "isActive",
    value: string | number | boolean,
  ) => void;
  onDelete: (id: string) => void;
  onMove: (
    index: number,
    direction: "up" | "down",
  ) => void;
}): ReactElement {
  return (
    <div className="border border-[#2e2a26] bg-[#1a1816] rounded-lg">
      <div className="flex items-center justify-between border-b border-[#2e2a26] bg-[#111111] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center border border-[#3a352f] bg-[#1a1816] text-[10px] text-[#cfc7bb] rounded-lg">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="text-[10px] uppercase tracking-[0.16em] text-[#cfc7bb]">
            Instagram Image
          </span>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            label="Move image up"
            disabled={index === 0}
            onClick={() => onMove(index, "up")}
          >
            <ArrowUp size={14} />
          </IconButton>

          <IconButton
            label="Move image down"
            disabled={index === totalImages - 1}
            onClick={() => onMove(index, "down")}
          >
            <ArrowDown size={14} />
          </IconButton>

          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center border border-[#5a2a27] text-[#e08b84] rounded-lg"
            aria-label="Delete image"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {image.image && (
          <div className="overflow-hidden border border-[#2e2a26] bg-[#111111] rounded-lg">
            <img
              src={image.image}
              alt={image.alt || "Instagram preview"}
              className="aspect-square w-full object-cover"
            />
          </div>
        )}

        <Field
          label="Image URL"
          value={image.image}
          onChange={(value) =>
            onUpdate(image.id, "image", value)
          }
          placeholder="https://..."
        />

        <Field
          label="Alt Text"
          value={image.alt}
          onChange={(value) =>
            onUpdate(image.id, "alt", value)
          }
          placeholder="Ayesha fashion look"
        />

        <Field
          label="Image Link"
          value={image.href ?? ""}
          onChange={(value) =>
            onUpdate(image.id, "href", value)
          }
          placeholder="https://instagram.com/p/..."
        />

        <StatusToggle
          label="Image Status"
          enabled={image.isActive}
          onChange={(value) =>
            onUpdate(image.id, "isActive", value)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   SHARED UI
========================================================= */

function SectionStatus({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between border border-[#2e2a26] bg-[#111111] px-5 py-4 rounded-[14px]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
          Section Status
        </p>

        <p className="mt-1 text-sm text-[#f8f3f1]">
          {enabled
            ? "Section is visible on the homepage."
            : "Section is hidden from the homepage."}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative flex h-7 w-12 items-center rounded-full p-1 ${
          enabled
            ? "bg-[#b79a6a]"
            : "bg-[#3a352f]"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-[#1a1816] shadow transition-transform ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function StatusToggle({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between border-t border-[#2e2a26] pt-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#cfc7bb]">
          {label}
        </p>

        <p className="mt-1 text-xs text-[#9a9185]">
          {enabled ? "Visible" : "Hidden"}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative flex h-7 w-12 items-center rounded-full p-1 ${
          enabled
            ? "bg-[#b79a6a]"
            : "bg-[#3a352f]"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-[#1a1816] shadow transition-transform ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

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
      <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full border border-[#3a352f] bg-[#1a1816] px-3 text-sm text-[#f8f3f1] outline-none focus:border-[#f8f3f1] focus:ring-1 focus:ring-[#f8f3f1]/20 rounded-lg"
      />
    </div>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactElement;
}): ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center border border-[#3a352f] bg-[#1a1816] text-[#cfc7bb] disabled:opacity-30 rounded-lg"
    >
      {children}
    </button>
  );
}

function EmptyState({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}): ReactElement {
  return (
    <div className="border border-dashed border-[#3a352f] bg-[#111111] px-6 py-12 text-center rounded-[14px]">
      <p className="text-sm font-medium text-[#f8f3f1]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#cfc7bb]">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 border border-[#f8f3f1] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#f8f3f1] rounded-lg"
      >
        <Plus size={15} />
        {buttonLabel}
      </button>
    </div>
  );
}

function Messages({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}): ReactElement | null {
  if (error) {
    return (
      <div className="border border-[#5a2a27] bg-[#2b1a18] px-4 py-3 rounded-lg">
        <p className="text-sm text-[#f0a39d]">
          {error}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="border border-[#2c4a33] bg-[#1a2419] px-4 py-3 rounded-lg">
        <p className="text-sm text-[#8fb08a]">
          {success}
        </p>
      </div>
    );
  }

  return null;
}

function SaveButton({
  saving,
}: {
  saving: boolean;
}): ReactElement {
  return (
    <div className="sticky bottom-4 z-20 flex justify-end border-t border-[#2e2a26] bg-[#1a1816]/95 px-1 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 border border-[#f8f3f1] bg-[#b79a6a] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#1a1816] hover:bg-[#c8ad7f] disabled:opacity-50 rounded-lg"
      >
        {saving ? (
          <>
            <Loader2 size={15} className="animate-spin" />
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
  );
}

function normalizeData(
  data: HomepageInstagram,
): HomepageInstagram {
  return {
    enabled: data.enabled,
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    username: data.username ?? "",
    href: data.href ?? "",
    images: normalizeImages(data.images ?? []),
  };
}

function normalizeImages(
  images: HomepageInstagram["images"],
): HomepageInstagram["images"] {
  return images.map((image, index) => ({
    ...image,
    alt: image.alt ?? "",
    href: image.href ?? "",
    sortOrder: index + 1,
  }));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}