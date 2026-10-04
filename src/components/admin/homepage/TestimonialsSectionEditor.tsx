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

      <div className="border-t border-[#2e2a26] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
              Customer Testimonials
            </p>

            <p className="mt-1 text-sm text-[#f8f3f1]">
              Add customer reviews and experiences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex shrink-0 items-center gap-2 border border-[#f8f3f1] bg-[#b79a6a] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#1a1816] transition hover:border-[#e6dfd4] hover:bg-[#c8ad7f] rounded-lg"
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
    <div className="border border-[#2e2a26] bg-[#1a1816] rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2e2a26] bg-[#111111] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-[#3a352f] bg-[#1a1816] text-xs font-medium text-[#cfc7bb] rounded-lg">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a9185]">
              Testimonial
            </p>

            <p className="mt-0.5 text-sm font-medium text-[#f8f3f1]">
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
            className="ml-2 inline-flex h-8 w-8 items-center justify-center border border-[#2b1a18] bg-[#1a1816] text-[#b79a6a] transition hover:border-[#b79a6a] hover:bg-[#2b1a18] rounded-lg"
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
      <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
        Rating
      </label>

      <div className="mt-2 flex h-11 items-center gap-1 border border-[#3a352f] bg-[#1a1816] px-3 rounded-lg">
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
                  ? "fill-[#f8f3f1] text-[#f8f3f1]"
                  : "text-[#8c847d]"
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
    <div className="flex items-center justify-between border border-[#2e2a26] bg-[#111111] px-5 py-4 rounded-[14px]">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#cfc7bb]">
          Section Status
        </p>

        <p className="mt-1 text-sm text-[#f8f3f1]">
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
        className={`relative flex h-7 w-12 items-center rounded-full p-1 transition-all ${
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
      className="inline-flex h-8 w-8 items-center justify-center border border-[#3a352f] bg-[#1a1816] text-[#cfc7bb] transition hover:border-[#9a9185] hover:text-[#f8f3f1] disabled:cursor-not-allowed disabled:opacity-30 rounded-lg"
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
        className="mt-5 inline-flex items-center gap-2 border border-[#f8f3f1] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#f8f3f1] transition hover:bg-[#b79a6a] hover:text-[#1a1816] rounded-lg"
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
        className="inline-flex items-center gap-2 border border-[#f8f3f1] bg-[#b79a6a] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#1a1816] transition hover:bg-[#c8ad7f] disabled:cursor-not-allowed disabled:opacity-50 rounded-lg"
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