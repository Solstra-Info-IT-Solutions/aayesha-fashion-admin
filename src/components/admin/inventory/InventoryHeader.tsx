import { RefreshCw, PackageSearch } from "lucide-react";

interface InventoryHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export default function InventoryHeader({
  onRefresh,
  loading = false,
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e7e2dd] pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f9e4e6] text-[#d98791]">
          <PackageSearch size={20} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#171717]">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-[#6f706f]">
            Monitor stock, reservations, thresholds and inventory history.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d8d1ca] bg-white px-4 text-sm font-medium text-[#292c2c] transition hover:bg-[#fcfbf9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw
          size={16}
          className={loading ? "animate-spin" : ""}
        />
        Refresh
      </button>
    </div>
  );
}