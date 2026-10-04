import Link from "next/link";
import { PackagePlus } from "lucide-react";

export default function ProductEmptyState({
  filtered = false,
  onReset,
}: {
  filtered?: boolean;
  onReset?: () => void;
}) {
  return (
    <div className="surface px-6 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2a241b] text-[#d9c7a3]">
        <PackagePlus size={26} strokeWidth={1.5} />
      </span>

      <h3 className="display mt-4 text-3xl font-semibold text-[#f8f3f1]">
        {filtered ? "No matching products" : "Your catalog is empty"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
        {filtered
          ? "Nothing matches these filters. Try a different search or clear the filters."
          : "Add your first product, or import many at once from a CSV file."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {filtered && onReset ? (
          <button type="button" onClick={onReset} className="inline-flex h-10 items-center rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] hover:bg-[#c8ad7f]">
            Clear all filters
          </button>
        ) : (
          <>
            <Link href="/admin/products/new" className="inline-flex h-10 items-center rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] hover:bg-[#c8ad7f]">
              Add product
            </Link>

            <Link href="/admin/products/import" className="inline-flex h-10 items-center rounded-lg border border-[#3a352f] px-5 text-sm font-semibold text-[#f8f3f1] hover:border-[#b79a6a]">
              Import CSV
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
