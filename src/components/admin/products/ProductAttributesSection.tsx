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
    <section className="surface min-w-0 overflow-hidden p-5 sm:p-6">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="display break-words text-[26px] font-semibold leading-tight text-[#f8f3f1]">
          Product Information
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#cfc7bb]">
          Add additional information
          about this product.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-5">
        <label className="block min-w-0">
          <span className="mb-1.5 block break-words text-sm font-medium leading-5 text-[#f8f3f1]">
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
            className="box-border min-h-[150px] min-w-0 w-full max-w-full resize-y rounded-xl border border-[#3a352f] bg-[#1a1816] px-3 py-3 text-sm leading-6 text-[#f8f3f1] outline-none transition focus:border-[#b79a6a] focus:ring-2 focus:ring-[#2a241b]"
          />
        </label>
      </div>
    </section>
  );
}