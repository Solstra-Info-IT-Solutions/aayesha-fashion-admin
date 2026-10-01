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
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1ead9] text-[#8a6a3b]">
        <PackagePlus size={26} strokeWidth={1.5} />
      </span>

      <h3 className="display mt-4 text-3xl font-semibold text-[#2a2520]">
        {filtered ? "No matching products" : "Your catalog is empty"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5f584d]">
        {filtered
          ? "Nothing matches these filters. Try a different search or clear the filters."
          : "Add your first product, or import many at once from a CSV file."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {filtered && onReset ? (
          <button type="button" onClick={onReset} className="inline-flex h-10 items-center rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-[#fffdf8] hover:bg-[#3d372f]">
            Clear all filters
          </button>
        ) : (
          <>
            <Link href="/admin/products/new" className="inline-flex h-10 items-center rounded-lg bg-[#26221d] px-5 text-sm font-semibold text-[#fffdf8] hover:bg-[#3d372f]">
              Add product
            </Link>

            <Link href="/admin/products/import" className="inline-flex h-10 items-center rounded-lg border border-[#d6ccb6] px-5 text-sm font-semibold text-[#2a2520] hover:border-[#b08d57]">
              Import CSV
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
