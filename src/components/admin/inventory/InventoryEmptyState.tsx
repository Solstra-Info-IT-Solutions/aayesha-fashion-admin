import { PackageOpen } from "lucide-react";

interface InventoryEmptyStateProps {
  filtered?: boolean;
}

export default function InventoryEmptyState({
  filtered = false,
}: InventoryEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8d1ca] bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f1ec] text-[#969696]">
        <PackageOpen size={21} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-[#171717]">
        {filtered
          ? "No matching inventory"
          : "No inventory found"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f706f]">
        {filtered
          ? "Try changing your search or inventory filters."
          : "Inventory will appear here once products with variants are available."}
      </p>
    </div>
  );
}