import {
  Plus,
  RefreshCw,
} from "lucide-react";

interface VariantsHeaderProps {
  onAdd: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export default function VariantsHeader({
  onAdd,
  onRefresh,
  loading = false,
}: VariantsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e7e2dd] pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#171717]">
          Product Variants
        </h1>

        <p className="mt-1 text-sm text-[#6f706f]">
          Manage SKUs, sizes, colors, pricing and variant status.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d8d1ca] bg-white px-4 text-sm font-medium text-[#292c2c] transition hover:bg-[#fcfbf9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#292c2c]"
        >
          <Plus size={17} />
          Add Variant
        </button>
      </div>
    </div>
  );
}