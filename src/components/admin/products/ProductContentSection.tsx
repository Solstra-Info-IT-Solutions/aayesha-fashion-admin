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
  "box-border min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]";

const labelClassName =
  "mb-1.5 block break-words text-sm font-medium leading-5 text-[#292c2c]";

export default function ProductContentSection({
  content,
  onChange,
}: ProductContentSectionProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
          Content
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#6f706f]">
          Product description and customer-facing
          information.
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
              content.description ?? ""
            }
            onChange={(event) =>
              onChange({
                ...content,
                description:
                  event.target.value,
              })
            }
            rows={7}
            placeholder="Write a detailed product description..."
            className={`${inputClassName} resize-y py-3 leading-6`}
          />
        </label>

        {/* FORMAT + FIT NOTE */}
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
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
                Plain
              </option>

              <option value="html">
                HTML
              </option>

              <option value="rich">
                Rich
              </option>
            </select>
          </label>

          <label className="block min-w-0">
            <span className={labelClassName}>
              Fit Note
            </span>

            <input
              value={
                content.fitNote ?? ""
              }
              onChange={(event) =>
                onChange({
                  ...content,
                  fitNote:
                    event.target.value,
                })
              }
              placeholder="Regular fit"
              className={`${inputClassName} h-11`}
            />
          </label>
        </div>

        {/* HIGHLIGHTS */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Highlights
          </span>

          <textarea
            value={(
              content.highlights ?? []
            ).join("\n")}
            onChange={(event) =>
              onChange({
                ...content,
                highlights:
                  event.target.value
                    .split("\n")
                    .map(
                      (item) =>
                        item.trim(),
                    )
                    .filter(Boolean),
              })
            }
            rows={4}
            placeholder={
              "Hand embroidery\nSoft lining\nFestive silhouette"
            }
            className={`${inputClassName} resize-y py-3 leading-6`}
          />
        </label>

        {/* STYLING NOTES */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Styling Notes
          </span>

          <textarea
            value={
              content.stylingNotes ?? ""
            }
            onChange={(event) =>
              onChange({
                ...content,
                stylingNotes:
                  event.target.value,
              })
            }
            rows={3}
            placeholder="Add styling or outfit pairing suggestions..."
            className={`${inputClassName} resize-y py-3 leading-6`}
          />
        </label>

        {/* MATERIALS & CARE */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Materials & Care
          </span>

          <textarea
            value={
              typeof content.materialsAndCare ===
              "string"
                ? content.materialsAndCare
                : (
                    content.materialsAndCare ??
                    []
                  ).join("\n")
            }
            onChange={(event) =>
              onChange({
                ...content,
                materialsAndCare:
                  event.target.value,
              })
            }
            rows={4}
            placeholder="Fabric details, washing instructions, ironing and care information..."
            className={`${inputClassName} resize-y py-3 leading-6`}
          />
        </label>
      </div>
    </section>
  );
}