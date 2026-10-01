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

import type { HomepageWhyChooseUs } from "@/types/homepage";

import { RichTextEditor } from "./RichTextEditor";

interface WhyChooseUsSectionEditorProps {
  data: HomepageWhyChooseUs;
  onSave: (
    data: HomepageWhyChooseUs,
  ) => Promise<void>;
}

/* =========================================================
   EDITOR
========================================================= */

export function WhyChooseUsSectionEditor({
  data,
  onSave,
}: WhyChooseUsSectionEditorProps): ReactElement {
  const [form, setForm] =
    useState<HomepageWhyChooseUs>(normalizeData(data));

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    setForm(normalizeData(data));
  }, [data]);

  /* =======================================================
     SECTION FIELD
  ======================================================= */

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

  /* =======================================================
     ADD ITEM
  ======================================================= */

  function handleAddItem(): void {
    const newItem = {
      id: `why-${Date.now()}`,
      title: "",
      description: "",
      icon: "",
      sortOrder: form.items.length + 1,
      isActive: true,
    };

    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        newItem,
      ],
    }));

    setError(null);
    setSuccess(null);
  }

  /* =======================================================
     UPDATE ITEM
  ======================================================= */

  function handleUpdateItem(
    id: string,
    field:
      | "title"
      | "description"
      | "icon"
      | "isActive",
    value: string | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      items: current.items.map(
        (item) =>
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

  /* =======================================================
     DELETE ITEM
  ======================================================= */

  function handleDeleteItem(
    id: string,
  ): void {
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

  /* =======================================================
     MOVE ITEM
  ======================================================= */

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

    const items = [
      ...form.items,
    ];

    const currentItem =
      items[index];

    items[index] =
      items[targetIndex];

    items[targetIndex] =
      currentItem;

    setForm((current) => ({
      ...current,
      items: normalizeItems(items),
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
        "Why Ayesha title is required.",
      );
      return;
    }

    if (!stripHtml(form.description).trim()) {
      setError(
        "Why Ayesha description is required.",
      );
      return;
    }

    for (const item of form.items) {
      if (!item.title.trim()) {
        setError(
          "Every Why Ayesha item must have a title.",
        );
        return;
      }

      if (!stripHtml(item.description).trim()) {
        setError(
          `Description is required for "${item.title || "this item"}".`,
        );
        return;
      }
    }

    setSaving(true);

    try {
      const normalized: HomepageWhyChooseUs = {
        enabled: form.enabled,
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),

        // Keep HTML exactly as entered.
        description: form.description.trim(),

        items: normalizeItems(
          form.items,
        ),
      };

      await onSave(normalized);

      setForm(normalized);

      setSuccess(
        "Why Ayesha saved successfully.",
      );
    } catch (saveError) {
      console.error(
        "Failed to save Why Ayesha:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save Why Ayesha.",
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

      <div className="flex items-center justify-between border border-[#e5e7ec] bg-[#f4f5f7] px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5b6270]">
            Section Status
          </p>

          <p className="mt-1 text-sm text-[#1a1d24]">
            {form.enabled
              ? "Why Ayesha is visible on the homepage."
              : "Why Ayesha is hidden from the homepage."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={form.enabled}
          aria-label={
            form.enabled
              ? "Disable Why Ayesha"
              : "Enable Why Ayesha"
          }
          onClick={() =>
            updateSection(
              "enabled",
              !form.enabled,
            )
          }
          className={`group relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7d8aa6]/25 focus:ring-offset-2 ${
            form.enabled
              ? "bg-[#2b3a55]"
              : "bg-[#d3d7df]"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-[#ffffff] shadow-[0_1px_3px_rgba(70,55,45,0.18)] transition-transform duration-200 ease-out ${
              form.enabled
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* =====================================================
          SECTION CONTENT
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Eyebrow"
          value={form.eyebrow}
          onChange={(value) =>
            updateSection(
              "eyebrow",
              value,
            )
          }
          placeholder="Why Ayesha"
        />

        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            updateSection(
              "title",
              value,
            )
          }
          placeholder="Why women choose Ayesha."
        />
      </div>

      {/* =====================================================
          RICH TEXT SECTION DESCRIPTION
      ===================================================== */}

      <RichTextEditor
        label="Description"
        value={form.description}
        onChange={(value) =>
          updateSection(
            "description",
            value,
          )
        }
        placeholder="Tell customers what makes Ayesha different..."
        minHeight={180}
      />

      {/* =====================================================
          ITEMS HEADER
      ===================================================== */}

      <div className="border-t border-[#e5e7ec] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5b6270]">
              Why Ayesha Items
            </p>

            <p className="mt-1 text-sm text-[#1a1d24]">
              Add the key reasons customers choose
              Ayesha.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex shrink-0 items-center gap-2 border border-[#2b3a55] bg-[#2b3a55] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#ffffff] transition hover:border-[#1e2a40] hover:bg-[#1e2a40]"
          >
            <Plus size={15} />

            Add Item
          </button>
        </div>
      </div>

      {/* =====================================================
          ITEMS
      ===================================================== */}

      {form.items.length === 0 ? (
        <div className="border border-dashed border-[#d3d7df] bg-[#f4f5f7] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#1a1d24]">
            No Why Ayesha items yet.
          </p>

          <p className="mt-1 text-xs text-[#5b6270]">
            Add your first item to build this section.
          </p>

          <button
            type="button"
            onClick={handleAddItem}
            className="mt-5 inline-flex items-center gap-2 border border-[#2b3a55] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#2b3a55] transition hover:bg-[#2b3a55] hover:text-[#ffffff]"
          >
            <Plus size={15} />

            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {form.items.map(
            (item, index) => (
              <WhyAyeshaItemCard
                key={item.id}
                item={item}
                index={index}
                totalItems={
                  form.items.length
                }
                onUpdate={
                  handleUpdateItem
                }
                onDelete={
                  handleDeleteItem
                }
                onMove={moveItem}
              />
            ),
          )}
        </div>
      )}

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
        <div className="border border-[#bfe3cb] bg-[#e8f5ec] px-4 py-3">
          <p className="text-sm text-[#2f7d4f]">
            {success}
          </p>
        </div>
      )}

      {/* =====================================================
          SAVE
      ===================================================== */}

      <div className="sticky bottom-4 z-20 flex justify-end border-t border-[#e5e7ec] bg-[#ffffff]/95 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 border border-[#2b3a55] bg-[#2b3a55] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#ffffff] transition hover:border-[#1e2a40] hover:bg-[#1e2a40] disabled:cursor-not-allowed disabled:opacity-50"
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
   ITEM CARD
========================================================= */

interface WhyAyeshaItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

function WhyAyeshaItemCard({
  item,
  index,
  totalItems,
  onUpdate,
  onDelete,
  onMove,
}: {
  item: WhyAyeshaItem;
  index: number;
  totalItems: number;
  onUpdate: (
    id: string,
    field:
      | "title"
      | "description"
      | "icon"
      | "isActive",
    value: string | boolean,
  ) => void;
  onDelete: (id: string) => void;
  onMove: (
    index: number,
    direction: "up" | "down",
  ) => void;
}): ReactElement {
  return (
    <div className="border border-[#e5e7ec] bg-[#ffffff]">
      {/* ===================================================
          ITEM HEADER
      =================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7ec] bg-[#f4f5f7] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-[#d3d7df] bg-[#ffffff] text-xs font-medium text-[#5b6270]">
            {String(index + 1).padStart(
              2,
              "0",
            )}
          </span>

          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#737a8c]">
              Why Ayesha Item
            </p>

            <p className="mt-0.5 text-sm font-medium text-[#1a1d24]">
              {item.title ||
                "Untitled item"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              onMove(index, "up")
            }
            disabled={index === 0}
            className="inline-flex h-8 w-8 items-center justify-center border border-[#d3d7df] bg-[#ffffff] text-[#5b6270] transition hover:border-[#737a8c] hover:text-[#1a1d24] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move item up"
          >
            <ArrowUp size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              onMove(index, "down")
            }
            disabled={
              index ===
              totalItems - 1
            }
            className="inline-flex h-8 w-8 items-center justify-center border border-[#d3d7df] bg-[#ffffff] text-[#5b6270] transition hover:border-[#737a8c] hover:text-[#1a1d24] disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move item down"
          >
            <ArrowDown size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(item.id)
            }
            className="ml-2 inline-flex h-8 w-8 items-center justify-center border border-[#fdecec] bg-[#ffffff] text-[#7d8aa6] transition hover:border-[#7d8aa6] hover:bg-[#fdecec]"
            aria-label="Delete item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* ===================================================
          ITEM CONTENT
      =================================================== */}

      <div className="space-y-5 p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <Field
            label="Title"
            value={item.title}
            onChange={(value) =>
              onUpdate(
                item.id,
                "title",
                value,
              )
            }
            placeholder="Thoughtfully Designed"
          />

          <Field
            label="Icon"
            value={item.icon ?? ""}
            onChange={(value) =>
              onUpdate(
                item.id,
                "icon",
                value,
              )
            }
            placeholder="sparkles"
          />
        </div>

        {/* =================================================
            RICH TEXT ITEM DESCRIPTION
        ================================================= */}

        <RichTextEditor
          label="Description"
          value={item.description}
          onChange={(value) =>
            onUpdate(
              item.id,
              "description",
              value,
            )
          }
          placeholder="Describe this benefit..."
          minHeight={150}
        />

        {/* =================================================
            ITEM STATUS
        ================================================= */}

        <div className="flex items-center justify-between border-t border-[#e5e7ec] pt-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#5b6270]">
              Item Status
            </p>

            <p className="mt-1 text-xs text-[#737a8c]">
              {item.isActive
                ? "Visible"
                : "Hidden"}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={
              item.isActive
            }
            aria-label={
              item.isActive
                ? "Deactivate item"
                : "Activate item"
            }
            onClick={() =>
              onUpdate(
                item.id,
                "isActive",
                !item.isActive,
              )
            }
            className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7d8aa6]/25 focus:ring-offset-2 ${
              item.isActive
                ? "bg-[#2b3a55]"
                : "bg-[#d3d7df]"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-[#ffffff] shadow-[0_1px_3px_rgba(70,55,45,0.18)] transition-transform duration-200 ${
                item.isActive
                  ? "translate-x-5"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
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
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full border border-[#d3d7df] bg-[#ffffff] px-3 text-sm text-[#1a1d24] outline-none transition placeholder:text-[#737a8c] focus:border-[#2b3a55] focus:ring-1 focus:ring-[#2b3a55]/20"
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
    <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5b6270]">
      {text}
    </label>
  );
}

/* =========================================================
   NORMALIZE DATA
========================================================= */

function normalizeData(
  data: HomepageWhyChooseUs,
): HomepageWhyChooseUs {
  return {
    enabled: data.enabled,
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    description:
      data.description ?? "",
    items: normalizeItems(
      data.items ?? [],
    ),
  };
}

/* =========================================================
   NORMALIZE ITEMS
========================================================= */

function normalizeItems(
  items: HomepageWhyChooseUs["items"],
): HomepageWhyChooseUs["items"] {
  return items.map(
    (item, index) => ({
      ...item,
      icon: item.icon ?? "",
      sortOrder: index + 1,
    }),
  );
}

/* =========================================================
   STRIP HTML
========================================================= */

function stripHtml(
  html: string,
): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}