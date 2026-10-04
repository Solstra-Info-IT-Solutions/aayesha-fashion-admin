import { PackageSearch } from "lucide-react";

export function OrdersEmptyState({
  filtered,
  onReset,
}: {
  filtered: boolean;
  onReset?: () => void;
}) {
  return (
    <div className="surface px-6 py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2a241b] text-[#d9c7a3]">
        <PackageSearch size={26} strokeWidth={1.5} />
      </span>

      <h2 className="display mt-4 text-3xl font-semibold text-[#f8f3f1]">
        {filtered ? "No matching orders" : "No orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
        {filtered
          ? "Nothing matches these filters. Try a different search, status or date range."
          : "Orders will appear here as soon as customers place them."}
      </p>

      {filtered && onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#b79a6a] px-5 text-sm font-semibold text-[#1a1816] hover:bg-[#c8ad7f]"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
