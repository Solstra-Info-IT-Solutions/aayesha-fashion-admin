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
    <section className="surface p-5 sm:p-6">
      <h2 className="display text-[26px] font-semibold leading-tight text-[#f8f3f1]">
        SEO
      </h2>

      <p className="mt-1 text-sm text-[#cfc7bb]">
        Search-engine metadata for the
        product page.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
            className="h-11 w-full rounded-xl border border-[#3a352f] px-3 text-sm outline-none focus:border-[#b79a6a]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
            className="w-full rounded-xl border border-[#3a352f] px-3 py-3 text-sm outline-none focus:border-[#b79a6a]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
            className="h-11 w-full rounded-xl border border-[#3a352f] px-3 text-sm outline-none focus:border-[#b79a6a]"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#f8f3f1]">
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
            className="h-11 w-full rounded-xl border border-[#3a352f] px-3 text-sm outline-none focus:border-[#b79a6a]"
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
            className="h-4 w-4 accent-[#f8f3f1]"
          />

          <span className="text-sm text-[#f8f3f1]">
            Prevent search engine indexing
          </span>
        </label>
      </div>
    </section>
  );
}