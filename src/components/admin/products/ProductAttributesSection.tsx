"use client";

interface ProductAttributesSectionProps {
  description?: string;
  onChange: (
    description: string,
  ) => void;
}

export default function ProductAttributesSection({
  description = "",
  onChange,
}: ProductAttributesSectionProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
          Product Information
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#6f706f]">
          Add additional information
          about this product.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-5">
        <label className="block min-w-0">
          <span className="mb-1.5 block break-words text-sm font-medium leading-5 text-[#292c2c]">
            Product Information
          </span>

          <textarea
            value={description}
            onChange={(event) =>
              onChange(
                event.target.value,
              )
            }
            rows={6}
            placeholder="Add product details..."
            className="box-border min-h-[150px] min-w-0 w-full max-w-full resize-y rounded-xl border border-[#d8d1ca] bg-white px-3 py-3 text-sm leading-6 text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6]"
          />
        </label>
      </div>
    </section>
  );
}