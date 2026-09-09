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

export default function ProductContentSection({
  content,
  onChange,
}: ProductContentSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <h2 className="text-base font-semibold text-[#171717]">
        Content
      </h2>

      <p className="mt-1 text-sm text-[#6f706f]">
        Product description and customer-facing
        information.
      </p>

      <div className="mt-5 space-y-4">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
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
                  event.target
                    .value,
              })
            }
            rows={7}
            placeholder="Write a detailed product description..."
            className="w-full rounded-xl border border-[#d8d1ca] px-3 py-3 text-sm leading-6 outline-none focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
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
              className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
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

          <label>
            <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Fit Note
            </span>

            <input
              value={
                content.fitNote ??
                ""
              }
              onChange={(event) =>
                onChange({
                  ...content,
                  fitNote:
                    event.target
                      .value,
                })
              }
              placeholder="Regular fit"
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
            />
          </label>
        </div>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Highlights
          </span>

          <textarea
            value={(
              content.highlights ??
              []
            ).join("\n")}
            onChange={(event) =>
              onChange({
                ...content,
                highlights:
                  event.target
                    .value
                    .split("\n")
                    .map(
                      (item) =>
                        item.trim(),
                    )
                    .filter(Boolean),
              })
            }
            rows={4}
            placeholder={"Hand embroidery\nSoft lining\nFestive silhouette"}
            className="w-full rounded-xl border border-[#d8d1ca] px-3 py-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Styling Notes
          </span>

          <textarea
            value={
              content.stylingNotes ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...content,
                stylingNotes:
                  event.target
                    .value,
              })
            }
            rows={3}
            className="w-full rounded-xl border border-[#d8d1ca] px-3 py-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
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
                  event.target
                    .value,
              })
            }
            rows={4}
            className="w-full rounded-xl border border-[#d8d1ca] px-3 py-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>
      </div>
    </section>
  );
}