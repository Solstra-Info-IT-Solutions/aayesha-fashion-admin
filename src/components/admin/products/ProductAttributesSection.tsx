"use client";

import type {
  ProductAttributes,
} from "@/types/admin-product";

interface ProductAttributesSectionProps {
  attributes: ProductAttributes;
  onChange: (
    attributes: ProductAttributes,
  ) => void;
}

const fields: Array<
  [
    keyof ProductAttributes,
    string,
  ]
> = [
  ["fabric", "Fabric"],
  [
    "composition",
    "Composition",
  ],
  ["fit", "Fit"],
  ["pattern", "Pattern"],
  ["work", "Work"],
  ["neckline", "Neckline"],
  ["sleeve", "Sleeve"],
  [
    "silhouette",
    "Silhouette",
  ],
  ["length", "Length"],
  ["lining", "Lining"],
  [
    "transparency",
    "Transparency",
  ],
];

export default function ProductAttributesSection({
  attributes,
  onChange,
}: ProductAttributesSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <h2 className="text-base font-semibold text-[#171717]">
        Attributes
      </h2>

      <p className="mt-1 text-sm text-[#6f706f]">
        Structured product specifications.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map(
          ([key, label]) => (
            <label key={String(key)}>
              <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                {label}
              </span>

              <input
                value={String(
                  attributes[key] ??
                    "",
                )}
                onChange={(
                  event,
                ) =>
                  onChange({
                    ...attributes,
                    [key]:
                      event.target
                        .value,
                  })
                }
                className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
              />
            </label>
          ),
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Occasion
          </span>

          <input
            value={(
              attributes.occasion ??
              []
            ).join(", ")}
            onChange={(event) =>
              onChange({
                ...attributes,
                occasion:
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
            placeholder="Festive, Wedding"
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>

        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Care Instructions
          </span>

          <textarea
            value={(
              attributes.careInstructions ??
              []
            ).join("\n")}
            onChange={(event) =>
              onChange({
                ...attributes,
                careInstructions:
                  event.target.value
                    .split("\n")
                    .map(
                      (item) =>
                        item.trim(),
                    )
                    .filter(
                      Boolean,
                    ),
              })
            }
            rows={3}
            className="w-full rounded-xl border border-[#d8d1ca] px-3 py-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>
      </div>
    </section>
  );
}