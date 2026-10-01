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
  Star,
  Trash2,
} from "lucide-react";

import type { HomepageTestimonials } from "@/types/homepage";

import { RichTextEditor } from "./RichTextEditor";

interface TestimonialsSectionEditorProps {
  data: HomepageTestimonials;
  onSave: (
    data: HomepageTestimonials,
  ) => Promise<void>;
}

export function TestimonialsSectionEditor({
  data,
  onSave,
}: TestimonialsSectionEditorProps): ReactElement {
  const [form, setForm] =
    useState<HomepageTestimonials>(normalizeData(data));

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
      | "description",
    value: string | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
    setSuccess(null);
  }

  function handleAddItem(): void {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: `testimonial-${Date.now()}`,
          name: "",
          role: "",
          quote: "",
          image: "",
          rating: 5,
          sortOrder: current.items.length + 1,
          isActive: true,
        },
      ],
    }));

    setError(null);
    setSuccess(null);
  }

  function handleUpdateItem(
    id: string,
    field:
      | "name"
      | "role"
      | "quote"
      | "image"
      | "rating"
      | "isActive",
    value: string | number | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
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

  function handleDeleteItem(id: string): void {
    setForm((current) => ({
      ...current,
      items: normalizeItems(
        current.items.filter(
          (item) => item.id !== id,
        ),
      ),
    }));

    setError(null);
    setSuccess(null);
  }

  function moveItem(
    index: number,
    direction: "up" | "down",
  ): void {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= form.items.length
    ) {
      return;
    }

    const items = [...form.items];

    const currentItem = items[index];

    items[index] = items[targetIndex];
    items[targetIndex] = currentItem;

    setForm((current) => ({
      ...current,
      items: normalizeItems(items),
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
        "Testimonials title is required.",
      );
      return;
    }

    if (!stripHtml(form.description).trim()) {
      setError(
        "Testimonials description is required.",
      );
      return;
    }

    for (const item of form.items) {
      if (!item.name.trim()) {
        setError(
          "Every testimonial must have a customer name.",
        );
        return;
      }

      if (!stripHtml(item.quote).trim()) {
        setError(
          `Quote is required for "${item.name}".`,
        );
        return;
      }

      if (
        item.rating !== undefined &&
        (item.rating < 1 || item.rating > 5)
      ) {
        setError(
          `Rating for "${item.name}" must be between 1 and 5.`,
        );
        return;
      }
    }

    setSaving(true);

    try {
      const normalized: HomepageTestimonials = {
        enabled: form.enabled,
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        items: normalizeItems(form.items),
      };

      await onSave(normalized);

      setForm(normalized);

      setSuccess(
        "Testimonials saved successfully.",
      );
    } catch (saveError) {
      console.error(
        "Failed to save testimonials:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save testimonials.",
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
          placeholder="Testimonials"
        />

        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            updateSection("title", value)
          }
          placeholder="Loved by women who wear Ayesha."
        />
      </div>

      <RichTextEditor
        label="Description"
        value={form.description}
        onChange={(value) =>
          updateSection("description", value)
        }
        placeholder="Tell customers what they can expect from Ayesha..."
        minHeight={180}
      />

      <div className="border-t border-[#e6dfcf] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
              Customer Testimonials
            </p>

            <p className="mt-1 text-sm text-[#2a2520]">
              Add customer reviews and experiences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex shrink-0 items-center gap-2 border border-[#26221d] bg-[#26221d] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#fffdf8] transition hover:border-[#3d372f] hover:bg-[#3d372f]"
          >
            <Plus size={15} />
            Add Testimonial
          </button>
        </div>
      </div>

      {form.items.length === 0 ? (
        <EmptyState
          title="No testimonials yet."
          description="Add your first customer testimonial."
          buttonLabel="Add First Testimonial"
          onClick={handleAddItem}
        />
      ) : (
        <div className="space-y-4">
          {form.items.map((item, index) => (
            <TestimonialCard
              key={item.id}
              item={item}
              index={index}
              totalItems={form.items.length}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
              onMove={moveItem}
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

function TestimonialCard({
  item,
  index,
  totalItems,
  onUpdate,
  onDelete,
  onMove,
}: {
  item: HomepageTestimonials["items"][number];
  index: number;
  totalItems: number;
  onUpdate: (
    id: string,
    field:
      | "name"
      | "role"
      | "quote"
      | "image"
      | "rating"
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
    <div className="border border-[#e6dfcf] bg-[#fffdf8]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6dfcf] bg-[#f7f2e7] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-[#d6ccb6] bg-[#fffdf8] text-xs font-medium text-[#5f584d]">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#756d62]">
              Testimonial
            </p>

            <p className="mt-0.5 text-sm font-medium text-[#2a2520]">
              {item.name || "Untitled testimonial"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            label="Move testimonial up"
            disabled={index === 0}
            onClick={() => onMove(index, "up")}
          >
            <ArrowUp size={15} />
          </IconButton>

          <IconButton
            label="Move testimonial down"
            disabled={index === totalItems - 1}
            onClick={() => onMove(index, "down")}
          >
            <ArrowDown size={15} />
          </IconButton>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center border border-[#fdecec] bg-[#fffdf8] text-[#b08d57] transition hover:border-[#b08d57] hover:bg-[#fdecec]"
            aria-label="Delete testimonial"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field
            label="Customer Name"
            value={item.name}
            onChange={(value) =>
              onUpdate(item.id, "name", value)
            }
            placeholder="Aarohi Sharma"
          />

          <Field
            label="Role / Location"
            value={item.role ?? ""}
            onChange={(value) =>
              onUpdate(item.id, "role", value)
            }
            placeholder="Verified Customer"
          />
        </div>

        <RichTextEditor
          label="Quote"
          value={item.quote}
          onChange={(value) =>
            onUpdate(item.id, "quote", value)
          }
          placeholder="Write the customer's experience..."
          minHeight={150}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <Field
            label="Customer Image URL"
            value={item.image ?? ""}
            onChange={(value) =>
              onUpdate(item.id, "image", value)
            }
            placeholder="https://..."
          />

          <RatingField
            value={item.rating ?? 5}
            onChange={(value) =>
              onUpdate(item.id, "rating", value)
            }
          />
        </div>

        <StatusToggle
          label="Item Status"
          enabled={item.isActive}
          onChange={(value) =>
            onUpdate(item.id, "isActive", value)
          }
        />
      </div>
    </div>
  );
}

function RatingField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}): ReactElement {
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
        Rating
      </label>

      <div className="mt-2 flex h-11 items-center gap-1 border border-[#d6ccb6] bg-[#fffdf8] px-3">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            aria-label={`${rating} star rating`}
            className="transition hover:scale-110"
          >
            <Star
              size={17}
              className={
                rating <= value
                  ? "fill-[#26221d] text-[#26221d]"
                  : "text-[#d6ccb6]"
              }
            />
          </button>
        ))}
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
    <div className="flex items-center justify-between border border-[#e6dfcf] bg-[#f7f2e7] px-5 py-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
          Section Status
        </p>

        <p className="mt-1 text-sm text-[#2a2520]">
          {enabled
            ? "Testimonials are visible on the homepage."
            : "Testimonials are hidden from the homepage."}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all ${
          enabled
            ? "bg-[#26221d]"
            : "bg-[#d6ccb6]"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-[#fffdf8] shadow transition-transform ${
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
    <div className="flex items-center justify-between border-t border-[#e6dfcf] pt-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#5f584d]">
          {label}
        </p>

        <p className="mt-1 text-xs text-[#756d62]">
          {enabled ? "Visible" : "Hidden"}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative flex h-7 w-12 items-center rounded-full p-1 transition-all ${
          enabled
            ? "bg-[#26221d]"
            : "bg-[#d6ccb6]"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-[#fffdf8] shadow transition-transform ${
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
      <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full border border-[#d6ccb6] bg-[#fffdf8] px-3 text-sm text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]/20"
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
      className="inline-flex h-8 w-8 items-center justify-center border border-[#d6ccb6] bg-[#fffdf8] text-[#5f584d] transition hover:border-[#756d62] hover:text-[#2a2520] disabled:cursor-not-allowed disabled:opacity-30"
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
    <div className="border border-dashed border-[#d6ccb6] bg-[#f7f2e7] px-6 py-12 text-center">
      <p className="text-sm font-medium text-[#2a2520]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[#5f584d]">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 border border-[#26221d] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#26221d] transition hover:bg-[#26221d] hover:text-[#fffdf8]"
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
      <div className="border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="border border-[#bfe3cb] bg-[#e8f5ec] px-4 py-3">
        <p className="text-sm text-[#2f7d4f]">
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
    <div className="sticky bottom-4 z-20 flex justify-end border-t border-[#e6dfcf] bg-[#fffdf8]/95 px-1 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 border border-[#26221d] bg-[#26221d] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#fffdf8] transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-50"
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
  );
}

function normalizeData(
  data: HomepageTestimonials,
): HomepageTestimonials {
  return {
    enabled: data.enabled,
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    items: normalizeItems(data.items ?? []),
  };
}

function normalizeItems(
  items: HomepageTestimonials["items"],
): HomepageTestimonials["items"] {
  return items.map((item, index) => ({
    ...item,
    role: item.role ?? "",
    image: item.image ?? "",
    rating: item.rating ?? 5,
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