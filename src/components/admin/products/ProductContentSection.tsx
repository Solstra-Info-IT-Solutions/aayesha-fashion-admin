"use client";

import type {
  ProductContent,
} from "@/types/admin-product";

interface ProductContentSectionProps {
  content: ProductContent;
  onChange: (
    content: ProductContent,
  ) => void;
}

const inputClassName =
  "box-border min-w-0 w-full max-w-full rounded-xl border border-[#d3d7df] bg-[#ffffff] px-3 text-sm text-[#0f172a] outline-none transition focus:border-[#818cf8] focus:ring-2 focus:ring-[#eef2ff]";

const labelClassName =
  "mb-1.5 block break-words text-sm font-medium leading-5 text-[#0f172a]";

export default function ProductContentSection({
  content,
  onChange,
}: ProductContentSectionProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e5e7ec] bg-[#ffffff] p-4 sm:p-5">
      {/* HEADER */}

      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#0f172a]">
          Content
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#5b6270]">
          Add the product description
          and customer-facing content.
        </p>
      </div>

      <div className="mt-5 min-w-0 space-y-4">

        {/* DESCRIPTION */}

        <label className="block min-w-0">
          <span className={labelClassName}>
            Description
          </span>

          <textarea
            value={
              content.description ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...content,
                description:
                  event.target.value,
              })
            }
            rows={8}
            placeholder="Write a detailed product description..."
            className={`${inputClassName} resize-y py-3 leading-6`}
          />
        </label>

        {/* DESCRIPTION FORMAT */}

        <label className="block min-w-0">
          <span className={labelClassName}>
            Description Format
          </span>

          <select
            value={
              content.descriptionFormat
            }
            onChange={(event) =>
              onChange({
                ...content,
                descriptionFormat:
                  event.target
                    .value as ProductContent["descriptionFormat"],
              })
            }
            className={`${inputClassName} h-11`}
          >
            <option value="plain">
              Plain Text
            </option>

            <option value="html">
              HTML
            </option>

            <option value="rich">
              Rich Text
            </option>
          </select>
        </label>

        {/* RICH CONTENT */}

        {content.descriptionFormat ===
          "rich" && (
          <label className="block min-w-0">
            <span className={labelClassName}>
              Rich Content
            </span>

            <textarea
              value={
                content.richContent ??
                ""
              }
              onChange={(event) =>
                onChange({
                  ...content,
                  richContent:
                    event.target
                      .value,
                })
              }
              rows={8}
              placeholder="Add formatted product content..."
              className={`${inputClassName} resize-y py-3 leading-6`}
            />

            <p className="mt-1.5 text-xs leading-5 text-[#737a8c]">
              Optional. Use this field
              when you need formatted
              product content.
            </p>
          </label>
        )}

      </div>
    </section>
  );
}