import { RefreshCw } from "lucide-react";

export function OrdersHeader({
  total,
  loading,
  onRefresh,
}: {
  total: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#969696]">
          Store operations
        </p>

        <h1 className="mt-1 font-serif text-4xl text-[#171717]">
          Orders
        </h1>

        <p className="mt-2 text-sm text-[#6f706f]">
          Manage customer orders, payments,
          shipping and fulfilment.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#6f706f]">
          {total.toLocaleString("en-IN")} orders
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 border border-[#d8d1ca] bg-white px-4 text-sm text-[#292c2c] hover:border-[#292c2c] disabled:opacity-60"
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
      </div>
    </div>
  );
}