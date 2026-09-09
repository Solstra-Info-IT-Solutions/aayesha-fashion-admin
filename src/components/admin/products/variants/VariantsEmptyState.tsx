import { PackageOpen } from "lucide-react";

interface VariantsEmptyStateProps {
  filtered?: boolean;
  onAdd?: () => void;
}

export default function VariantsEmptyState({
  filtered = false,
  onAdd,
}: VariantsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d1ca] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f1ec] text-[#969696]">
        <PackageOpen size={21} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-[#171717]">
        {filtered
          ? "No matching variants"
          : "No variants yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f706f]">
        {filtered
          ? "Try a different search or status filter."
          : "Add the first variant to start managing this product's SKUs."}
      </p>

      {!filtered && onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#292c2c]"
        >
          Add Variant
        </button>
      )}
    </div>
  );
}