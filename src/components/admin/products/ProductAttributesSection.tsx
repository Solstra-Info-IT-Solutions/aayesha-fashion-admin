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
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5] p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#3f2d2a]">
          Product Information
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#70635d]">
          Add additional information
          about this product.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-5">
        <label className="block min-w-0">
          <span className="mb-1.5 block break-words text-sm font-medium leading-5 text-[#3f2d2a]">
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
            className="box-border min-h-[150px] min-w-0 w-full max-w-full resize-y rounded-xl border border-[#d8cec5] bg-[#fbf9f5] px-3 py-3 text-sm leading-6 text-[#3f2d2a] outline-none transition focus:border-[#a98282] focus:ring-2 focus:ring-[#e9dcd7]"
          />
        </label>
      </div>
    </section>
  );
}