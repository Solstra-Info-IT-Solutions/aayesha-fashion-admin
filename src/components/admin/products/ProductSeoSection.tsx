"use client";

import type {
  ProductSEO,
} from "@/types/admin-product";

interface ProductSeoSectionProps {
  seo: ProductSEO;
  onChange: (
    seo: ProductSEO,
  ) => void;
}

export default function ProductSeoSection({
  seo,
  onChange,
}: ProductSeoSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e6dfcf] bg-[#fffdf8] p-5">
      <h2 className="text-base font-semibold text-[#2a2520]">
        SEO
      </h2>

      <p className="mt-1 text-sm text-[#5f584d]">
        Search-engine metadata for the
        product page.
      </p>

      <div className="mt-5 space-y-4">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#2a2520]">
            Meta Title
          </span>

          <input
            value={seo.title ?? ""}
            onChange={(event) =>
              onChange({
                ...seo,
                title:
                  event.target
                    .value,
              })
            }
            className="h-11 w-full rounded-xl border border-[#d6ccb6] px-3 text-sm outline-none focus:border-[#b08d57]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#2a2520]">
            Meta Description
          </span>

          <textarea
            value={
              seo.description ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...seo,
                description:
                  event.target
                    .value,
              })
            }
            rows={4}
            className="w-full rounded-xl border border-[#d6ccb6] px-3 py-3 text-sm outline-none focus:border-[#b08d57]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#2a2520]">
            Keywords
          </span>

          <input
            value={(
              seo.keywords ??
              []
            ).join(", ")}
            onChange={(event) =>
              onChange({
                ...seo,
                keywords:
                  event.target.value
                    .split(",")
                    .map(
                      (item) =>
                        item.trim(),
                    )
                    .filter(
                      Boolean,
                    ),
              })
            }
            placeholder="anarkali, festive wear, indian fashion"
            className="h-11 w-full rounded-xl border border-[#d6ccb6] px-3 text-sm outline-none focus:border-[#b08d57]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#2a2520]">
            Canonical URL
          </span>

          <input
            value={
              seo.canonical ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...seo,
                canonical:
                  event.target
                    .value,
              })
            }
            placeholder="https://..."
            className="h-11 w-full rounded-xl border border-[#d6ccb6] px-3 text-sm outline-none focus:border-[#b08d57]"
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={
              seo.noIndex === true
            }
            onChange={(event) =>
              onChange({
                ...seo,
                noIndex:
                  event.target
                    .checked,
              })
            }
            className="h-4 w-4 accent-[#2a2520]"
          />

          <span className="text-sm text-[#2a2520]">
            Prevent search engine indexing
          </span>
        </label>
      </div>
    </section>
  );
}