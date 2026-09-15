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

const inputClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]";

const labelClassName =
  "mb-1.5 block break-words text-sm font-medium leading-5 text-[#292c2c]";

export default function ProductAttributesSection({
  attributes,
  onChange,
}: ProductAttributesSectionProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
          Attributes
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#6f706f]">
          Structured product specifications.
        </p>
      </div>

      {/* ATTRIBUTE FIELDS */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map(
          ([key, label]) => (
            <label
              key={String(key)}
              className="block min-w-0"
            >
              <span className={labelClassName}>
                {label}
              </span>

              <input
                value={String(
                  attributes[key] ?? "",
                )}
                onChange={(event) =>
                  onChange({
                    ...attributes,
                    [key]:
                      event.target.value,
                  })
                }
                className={inputClassName}
              />
            </label>
          ),
        )}
      </div>

      {/* OCCASION + CARE */}
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {/* OCCASION */}
        <label className="block min-w-0">
          <span className={labelClassName}>
            Occasion
          </span>

          <input
            value={(
              attributes.occasion ?? []
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
                    .filter(Boolean),
              })
            }
            placeholder="Festive, Wedding"
            className={inputClassName}
          />
        </label>

        {/* CARE INSTRUCTIONS */}
        <label className="block min-w-0">
          <span className={labelClassName}>
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
                    .filter(Boolean),
              })
            }
            rows={3}
            placeholder="Add care instructions..."
            className="box-border min-h-[92px] min-w-0 w-full max-w-full resize-y rounded-xl border border-[#d8d1ca] bg-white px-3 py-3 text-sm leading-5 text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </label>
      </div>
    </section>
  );
}