"use client";

import {
  FormEvent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  Loader2,
  Save,
} from "lucide-react";

import type { HomepageNewsletter } from "@/types/homepage";

import { RichTextEditor } from "./RichTextEditor";

interface NewsletterSectionEditorProps {
  data: HomepageNewsletter;
  onSave: (
    data: HomepageNewsletter,
  ) => Promise<void>;
}

export function NewsletterSectionEditor({
  data,
  onSave,
}: NewsletterSectionEditorProps): ReactElement {
  const [form, setForm] =
    useState<HomepageNewsletter>(normalizeData(data));

  const [saving, setSaving] = useState(false);
  const [error, setError] =
    useState<string | null>(null);
  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    setForm(normalizeData(data));
  }, [data]);

  function updateField(
    field:
      | "enabled"
      | "eyebrow"
      | "title"
      | "description"
      | "buttonLabel"
      | "placeholder",
    value: string | boolean,
  ): void {
    setForm((current) => ({
      ...current,
      [field]: value,
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
        "Newsletter title is required.",
      );
      return;
    }

    if (!stripHtml(form.description).trim()) {
      setError(
        "Newsletter description is required.",
      );
      return;
    }

    if (!form.buttonLabel.trim()) {
      setError(
        "Newsletter button label is required.",
      );
      return;
    }

    if (!form.placeholder.trim()) {
      setError(
        "Newsletter input placeholder is required.",
      );
      return;
    }

    setSaving(true);

    try {
      const normalized: HomepageNewsletter = {
        enabled: form.enabled,
        eyebrow: form.eyebrow.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        buttonLabel: form.buttonLabel.trim(),
        placeholder: form.placeholder.trim(),
      };

      await onSave(normalized);

      setForm(normalized);

      setSuccess(
        "Newsletter saved successfully.",
      );
    } catch (saveError) {
      console.error(
        "Failed to save newsletter:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save newsletter.",
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
      {/* SECTION STATUS */}

      <div className="flex items-center justify-between border border-[#e5e0db] bg-[#faf9f7] px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#77736e]">
            Section Status
          </p>

          <p className="mt-1 text-sm text-[#393532]">
            {form.enabled
              ? "Newsletter is visible on the homepage."
              : "Newsletter is hidden from the homepage."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={form.enabled}
          onClick={() =>
            updateField(
              "enabled",
              !form.enabled,
            )
          }
          className={`relative flex h-7 w-12 items-center rounded-full p-1 transition-all ${
            form.enabled
              ? "bg-[#8f6b57]"
              : "bg-[#d8d0c8]"
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-[#fffdf9] shadow transition-transform ${
              form.enabled
                ? "translate-x-5"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* BASIC CONTENT */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Eyebrow"
          value={form.eyebrow}
          onChange={(value) =>
            updateField("eyebrow", value)
          }
          placeholder="Stay in the know"
        />

        <Field
          label="Title"
          value={form.title}
          onChange={(value) =>
            updateField("title", value)
          }
          placeholder="Join the Ayesha community."
        />
      </div>

      {/* RICH TEXT */}

      <RichTextEditor
        label="Description"
        value={form.description}
        onChange={(value) =>
          updateField("description", value)
        }
        placeholder="Write your newsletter message..."
        minHeight={180}
      />

      {/* FORM SETTINGS */}

      <div className="border-t border-[#e5e0db] pt-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#77736e]">
          Signup Form
        </p>

        <p className="mt-1 text-sm text-[#393532]">
          Configure the newsletter input and button.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          label="Input Placeholder"
          value={form.placeholder}
          onChange={(value) =>
            updateField(
              "placeholder",
              value,
            )
          }
          placeholder="Enter your email address"
        />

        <Field
          label="Button Label"
          value={form.buttonLabel}
          onChange={(value) =>
            updateField(
              "buttonLabel",
              value,
            )
          }
          placeholder="Subscribe"
        />
      </div>

      {/* MESSAGES */}

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

      {/* SAVE */}

      <div className="sticky bottom-4 z-20 flex justify-end border-t border-[#e5e0db] bg-white/95 px-1 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 border border-[#8f6b57] bg-[#8f6b57] px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-[#fffdf9] transition hover:bg-[#755644] disabled:cursor-not-allowed disabled:opacity-50"
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
      <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#77736e]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full border border-[#d8d1ca] bg-white px-3 text-sm text-[#292522] outline-none focus:border-[#8f6b57] focus:ring-1 focus:ring-[#8f6b57]/20"
      />
    </div>
  );
}

function normalizeData(
  data: HomepageNewsletter,
): HomepageNewsletter {
  return {
    enabled: data.enabled,
    eyebrow: data.eyebrow ?? "",
    title: data.title ?? "",
    description: data.description ?? "",
    buttonLabel: data.buttonLabel ?? "",
    placeholder: data.placeholder ?? "",
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}